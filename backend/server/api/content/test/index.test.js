const request = require('supertest');

jest.mock('../../../../database/index.js', () => ({
  getAllProcessedItems: jest.fn(),
  saveProcessedItem: jest.fn(),
  seedIfEmpty: jest.fn()
}));

const database = require('../../../../database/index.js');
const app = require('../../../index');

describe('backend/server api/content routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET / returns health message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('News Summarizer Backend server is running');
  });

  test('GET /api/content/latest returns latest item', async () => {
    const item = {
      id: 'video-1',
      title: 'Latest title',
      summary: 'Latest summary',
      youtubeUrl: 'https://youtube.com/watch?v=1',
      publishedAt: '2026-05-05',
      source: 'youtube-cron'
    };
    database.getAllProcessedItems.mockReturnValue([item]);

    const response = await request(app).get('/api/content/latest');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ item });
  });

  test('GET /api/content filters by search and date', async () => {
    database.getAllProcessedItems.mockReturnValue([
      {
        id: 'video-1',
        title: 'AI news update',
        summary: 'Developer tooling summary',
        youtubeUrl: 'https://youtube.com/watch?v=1',
        publishedAt: '2026-05-05',
        source: 'youtube-cron'
      },
      {
        id: 'video-2',
        title: 'Cloud digest',
        summary: 'Infra market recap',
        youtubeUrl: 'https://youtube.com/watch?v=2',
        publishedAt: '2026-05-04',
        source: 'youtube-cron'
      }
    ]);

    const response = await request(app).get('/api/content').query({ search: 'ai', date: '2026-05-05' });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe('video-1');
  });

  test('POST /api/content/ingest rejects invalid payload', async () => {
    const response = await request(app).post('/api/content/ingest').send({ title: 'Missing fields' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'videoId, title, and youtubeUrl are required' });
  });

  test('POST /api/content/ingest stores a valid item', async () => {
    const savedItem = {
      id: 'video-3',
      title: 'Stored title',
      summary: 'Stored summary',
      youtubeUrl: 'https://youtube.com/watch?v=3',
      publishedAt: '2026-05-05',
      source: 'api'
    };
    database.saveProcessedItem.mockReturnValue(savedItem);

    const response = await request(app).post('/api/content/ingest').send({
      videoId: 'video-3',
      title: 'Stored title',
      summary: 'Stored summary',
      youtubeUrl: 'https://youtube.com/watch?v=3',
      publishedAt: '2026-05-05'
    });

    expect(response.status).toBe(201);
    expect(database.saveProcessedItem).toHaveBeenCalled();
    expect(response.body).toEqual({ item: savedItem });
  });
});