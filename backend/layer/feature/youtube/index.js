
const { prisma } = require('../../db/prisma/index.js');
const { toDate } = require('../../db/utils/index.js');

async function findAllVideos() {
  return prisma.video.findMany({
    orderBy: {
      publishedAt: 'desc'
    }
  });
}

async function findVideoByVideoId(videoId) {
  return prisma.video.findUnique({
    where: {
      videoId
    }
  });
}

async function upsertVideo(input) {
  return prisma.video.upsert({
    where: {
      videoId: input.videoId
    },
    create: input,
    update: {
      title: input.title,
      description: input.description,
      publishedAt: input.publishedAt,
      generatedContent: input.generatedContent,
      youtubeUrl: input.youtubeUrl,
      source: input.source
    }
  });
}

async function countVideos() {
  return prisma.video.count();
}

function toApiItem(video) {
  return {
    id: video.videoId,
    title: video.title,
    summary: video.generatedContent,
    youtubeUrl: video.youtubeUrl || `https://www.youtube.com/watch?v=${video.videoId}`,
    publishedAt: video.publishedAt.toISOString().slice(0, 10),
    source: video.source || 'database',
    description: video.description || ''
  };
}

function toDbInput(item) {
  const videoId = item.id || item.videoId;

  return {
    videoId,
    title: item.title || 'Untitled video',
    description: item.description || item.title || '',
    publishedAt: toDate(item.publishedAt),
    generatedContent: item.summary || item.generatedContent || 'Generated summary is pending.',
    youtubeUrl: item.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`,
    source: item.source || 'api'
  };
}

async function getAllProcessedItems() {
  const videos = await findAllVideos();
  return videos.map(toApiItem);
}

async function hasVideo(videoId) {
  const video = await findVideoByVideoId(videoId);
  return Boolean(video);
}

async function saveProcessedItem(item) {
  const saved = await upsertVideo(toDbInput(item));
  return toApiItem(saved);
}

async function seedIfEmpty(seedItems) {
  const count = await countVideos();
  if (count > 0 || !Array.isArray(seedItems) || seedItems.length === 0) {
    return;
  }

  for (const item of seedItems) {
    await saveProcessedItem(item);
  }
}

module.exports = {
  getAllProcessedItems,
  hasVideo,
  saveProcessedItem,
  seedIfEmpty
};
