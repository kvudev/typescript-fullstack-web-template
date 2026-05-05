const express = require('express');
const {
  getAllProcessedItems,
  saveProcessedItem,
  seedIfEmpty
} = require('layer/feature/youtube');
const createApiRouter = require('./api');

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

const initializePromise = Promise.resolve(seedIfEmpty(seedContent)).catch((error) => {
  console.error('[server] Failed to initialize seed data:', error.message);
});

app.use('/api', createApiRouter({ getAllProcessedItems, saveProcessedItem }));

app.get('/', (req, res) => {
  res.send('News Summarizer Backend server is running');
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  initializePromise.then(() => {
    app.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
    });
  });
}

module.exports = app;
