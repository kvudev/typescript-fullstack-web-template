const express = require('express');

function createContentRouter({ getAllProcessedItems, saveProcessedItem }) {
  const router = express.Router();

  router.get('/latest', async (req, res) => {
    const items = await getAllProcessedItems();
    res.json({ item: items[0] || null });
  });

  router.get('/', async (req, res) => {
    const { search = '', date = '' } = req.query;

    const normalizedSearch = String(search).trim().toLowerCase();
    const normalizedDate = String(date).trim();

    const items = await getAllProcessedItems();
    const filtered = items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(normalizedSearch);
      const summaryMatch = item.summary.toLowerCase().includes(normalizedSearch);
      const searchMatch = !normalizedSearch || titleMatch || summaryMatch;
      const dateMatch = !normalizedDate || item.publishedAt === normalizedDate;

      return searchMatch && dateMatch;
    });

    res.json({ items: filtered });
  });

  router.post('/ingest', express.json(), async (req, res) => {
    const payload = req.body || {};

    if (!payload.videoId || !payload.title || !payload.youtubeUrl) {
      return res.status(400).json({ message: 'videoId, title, and youtubeUrl are required' });
    }

    const item = await saveProcessedItem({
      id: payload.videoId,
      title: payload.title,
      summary: payload.summary || 'Generated summary is pending.',
      youtubeUrl: payload.youtubeUrl,
      publishedAt: payload.publishedAt || new Date().toISOString().slice(0, 10),
      source: payload.source || 'api'
    });

    return res.status(201).json({ item });
  });

  return router;
}

module.exports = createContentRouter;
