const express = require('express');
const {
  getAllProcessedItems,
  saveProcessedItem,
  seedIfEmpty
} = require('../database');

const app = express();

const seedContent = [
  {
    id: 'seed-1',
    title: 'How AI Summarizes Breaking Tech News in Minutes',
    summary:
      'A concise breakdown of the newest AI workflow for collecting headlines, extracting key facts, and publishing short summaries quickly.',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    publishedAt: '2026-05-04',
    source: 'seed'
  },
  {
    id: 'seed-2',
    title: 'Startup Funding Trends You Need to Watch This Week',
    summary:
      'This generated article compares seed, Series A, and late-stage movement with practical signals founders can track every day.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    publishedAt: '2026-05-03',
    source: 'seed'
  },
  {
    id: 'seed-3',
    title: 'Cybersecurity Alerts: What Changed Overnight',
    summary:
      'An overview of new vulnerabilities, response timelines, and what engineering teams should patch first this morning.',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    publishedAt: '2026-05-02',
    source: 'seed'
  }
];

seedIfEmpty(seedContent);

app.get('/api/content/latest', (req, res) => {
  const items = getAllProcessedItems();
  res.json({ item: items[0] || null });
});

app.get('/api/content', (req, res) => {
  const { search = '', date = '' } = req.query;

  const normalizedSearch = String(search).trim().toLowerCase();
  const normalizedDate = String(date).trim();

  const filtered = getAllProcessedItems().filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(normalizedSearch);
    const summaryMatch = item.summary.toLowerCase().includes(normalizedSearch);
    const searchMatch = !normalizedSearch || titleMatch || summaryMatch;
    const dateMatch = !normalizedDate || item.publishedAt === normalizedDate;

    return searchMatch && dateMatch;
  });

  res.json({ items: filtered });
});

app.post('/api/content/ingest', express.json(), (req, res) => {
  const payload = req.body || {};

  if (!payload.videoId || !payload.title || !payload.youtubeUrl) {
    return res.status(400).json({ message: 'videoId, title, and youtubeUrl are required' });
  }

  const item = saveProcessedItem({
    id: payload.videoId,
    title: payload.title,
    summary: payload.summary || 'Generated summary is pending.',
    youtubeUrl: payload.youtubeUrl,
    publishedAt: payload.publishedAt || new Date().toISOString().slice(0, 10),
    source: payload.source || 'api'
  });

  return res.status(201).json({ item });
});

app.get('/', (req, res) => {
  res.send('News Summarizer Backend server is running');
});

module.exports = app;
