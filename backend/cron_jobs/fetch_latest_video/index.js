const cron = require('node-cron');
const axios = require('axios');
const { decode } = require('html-entities');
const { hasVideo, saveProcessedItem } = require('../../database');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

function buildYoutubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function generateContentWithGemini(video) {
  return {
    title: `Generated: ${video.title}`,
    summary:
      'Auto-generated summary placeholder from Gemini pipeline. Replace this function with real Gemini API integration.'
  };
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

    if (hasVideo(latestVideo.id)) {
      console.log(`[cron] Video ${latestVideo.id} already processed. Skipping.`);
      return;
    }

    const generated = generateContentWithGemini(latestVideo);
    const processedItem = {
      id: latestVideo.id,
      title: generated.title,
      summary: generated.summary,
      youtubeUrl: latestVideo.youtubeUrl,
      publishedAt: latestVideo.publishedAt || new Date().toISOString().slice(0, 10),
      source: 'youtube-cron'
    };

    saveProcessedItem(processedItem);
    console.log(`[cron] Stored new processed video ${processedItem.id}.`);
  } catch (error) {
    console.error('[cron] Failed to execute cron cycle:', error.message);
  }
}

function startFetchLatestVideoCron() {
  cron.schedule('*/5 * * * *', () => {
    runFeatureCronJob();
  });

  console.log('[cron] fetch_latest_video started. Runs every 5 minutes.');
  runFeatureCronJob();
}

module.exports = {
  name: 'fetch_latest_video',
  start: startFetchLatestVideoCron
};
