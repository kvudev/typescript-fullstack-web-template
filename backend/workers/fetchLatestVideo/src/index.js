const cron = require('node-cron');
const axios = require('axios');
const { decode } = require('html-entities');
const { hasVideo, saveProcessedItem } = require('layer/feature/youtube');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function buildYoutubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function fallbackGeneratedContent(video) {
  return {
    title: `Generated: ${video.title}`,
    summary:
      'Auto-generated summary placeholder from Gemini pipeline. Replace this fallback by setting GEMINI_API_KEY for real summaries.'
  };
}

function extractGeminiText(response) {
  return response?.data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || '')
    .join('')
    .trim();
}

function parseGeminiJson(rawText) {
  if (!rawText) return null;

  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

async function callGeminiGenerateContent(prompt) {
  const modelCandidates = [
    GEMINI_MODEL,
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ].filter(Boolean);

  const uniqueModels = [...new Set(modelCandidates)];
  const apiVersions = ['v1beta', 'v1'];

  let lastError = null;
  let quotaError = null;

  for (const version of apiVersions) {
    for (const model of uniqueModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`;

      try {
        const response = await axios.post(
          geminiUrl,
          {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4
            }
          },
          {
            params: { key: GEMINI_API_KEY },
            timeout: 15000
          }
        );

        return response;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status === 429) {
          quotaError = quotaError || error;
          console.log(`[cron] Gemini ${version}/${model} hit quota/rate limit (429). Retrying next candidate...`);
          continue;
        }

        if (status === 404 || status === 400) {
          console.log(`[cron] Gemini ${version}/${model} failed with status ${status}. Retrying next candidate...`);
          continue;
        }

        throw error;
      }
    }
  }

  throw quotaError || lastError || new Error('No valid Gemini endpoint/model combination found.');
}

async function generateContentWithGemini(video) {
  if (!GEMINI_API_KEY) {
    console.log('[cron] GEMINI_API_KEY is missing. Using fallback generated content.');
    return fallbackGeneratedContent(video);
  }

  const prompt = [
    'You are a concise tech-news editor.',
    'Create a short, reader-friendly summary for this YouTube video metadata.',
    'Return only valid JSON with exactly two keys: "title" and "summary".',
    'Title must be under 120 characters. Summary must be 2-3 sentences.',
    '',
    `Video title: ${video.title}`,
    `Published date: ${video.publishedAt}`,
    `Source URL: ${video.youtubeUrl}`
  ].join('\n');

  try {
    const response = await callGeminiGenerateContent(prompt);

    const rawText = extractGeminiText(response);
    const parsed = parseGeminiJson(rawText);

    if (!parsed?.title || !parsed?.summary) {
      console.log('[cron] Gemini response missing title/summary. Using fallback generated content.');
      return fallbackGeneratedContent(video);
    }

    return {
      title: String(parsed.title).trim() || `Generated: ${video.title}`,
      summary: String(parsed.summary).trim() || fallbackGeneratedContent(video).summary
    };
  } catch (error) {
    const status = error?.response?.status;
    const statusText = error?.response?.statusText || '';
    const apiMessage = error?.response?.data?.error?.message || error.message;
    console.log(
      `[cron] Gemini API call failed${status ? ` (${status} ${statusText})` : ''}: ${apiMessage}. Using fallback generated content.`
    );
    return fallbackGeneratedContent(video);
  }
}

async function fetchLatestVideoFromYoutube() {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.log('[cron] Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID. Cron job skipped.');
    return null;
  }

  const response = await axios.get(YOUTUBE_BASE_URL, {
    params: {
      key: YOUTUBE_API_KEY,
      channelId: YOUTUBE_CHANNEL_ID,
      part: 'snippet',
      order: 'date',
      maxResults: 1,
      type: 'video'
    }
  });

  const firstItem = response?.data?.items?.[0];
  if (!firstItem?.id?.videoId || !firstItem?.snippet) {
    return null;
  }

  return {
    id: firstItem.id.videoId,
    title: decode(firstItem.snippet.title),
    publishedAt: (firstItem.snippet.publishedAt || '').slice(0, 10),
    youtubeUrl: buildYoutubeUrl(firstItem.id.videoId)
  };
}

async function runFeatureCronJob() {
  try {
    console.log('[cron] Checking latest YouTube video...');
    const latestVideo = await fetchLatestVideoFromYoutube();

    if (!latestVideo) {
      console.log('[cron] No video received from YouTube API.');
      return;
    }

    if (await hasVideo(latestVideo.id)) {
      console.log(`[cron] Video ${latestVideo.id} already processed. Skipping.`);
      return;
    }

    const generated = await generateContentWithGemini(latestVideo);
    const processedItem = {
      id: latestVideo.id,
      title: generated.title,
      summary: generated.summary,
      youtubeUrl: latestVideo.youtubeUrl,
      publishedAt: latestVideo.publishedAt || new Date().toISOString().slice(0, 10),
      source: 'youtube-cron'
    };

    await saveProcessedItem(processedItem);
    console.log(`[cron] Stored new processed video ${processedItem.id}.`);
  } catch (error) {
    console.error('[cron] Failed to execute cron cycle:', error.message);
  }
}

function startFetchLatestVideoCron() {
  cron.schedule('*/5 * * * *', () => {
    runFeatureCronJob();
  });

  console.log('[cron] fetchLatestVideo started. Runs every 5 minutes.');
  runFeatureCronJob();
}

module.exports = {
  name: 'fetchLatestVideo',
  start: startFetchLatestVideoCron,
  __testing: {
    callGeminiGenerateContent,
    generateContentWithGemini,
    runFeatureCronJob,
    fallbackGeneratedContent,
    parseGeminiJson,
    extractGeminiText
  }
};
