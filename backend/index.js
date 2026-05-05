const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const demoContent = [
  {
    id: 1,
    title: 'How AI Summarizes Breaking Tech News in Minutes',
    summary:
      'A concise breakdown of the newest AI workflow for collecting headlines, extracting key facts, and publishing short summaries quickly.',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    publishedAt: '2026-05-04'
  },
  {
    id: 2,
    title: 'Startup Funding Trends You Need to Watch This Week',
    summary:
      'This generated article compares seed, Series A, and late-stage movement with practical signals founders can track every day.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    publishedAt: '2026-05-03'
  },
  {
    id: 3,
    title: 'Cybersecurity Alerts: What Changed Overnight',
    summary:
      'An overview of new vulnerabilities, response timelines, and what engineering teams should patch first this morning.',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    publishedAt: '2026-05-02'
  }
];

app.get('/api/content/latest', (req, res) => {
  res.json({ item: demoContent[0] });
});

app.get('/api/content', (req, res) => {
  const { search = '', date = '' } = req.query;

  const normalizedSearch = String(search).trim().toLowerCase();
  const normalizedDate = String(date).trim();

  const filtered = demoContent.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(normalizedSearch);
    const summaryMatch = item.summary.toLowerCase().includes(normalizedSearch);
    const searchMatch = !normalizedSearch || titleMatch || summaryMatch;
    const dateMatch = !normalizedDate || item.publishedAt === normalizedDate;

    return searchMatch && dateMatch;
  });

  res.json({ items: filtered });
});

app.get('/', (req, res) => {
  res.send('News Summarizer Backend is running');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
