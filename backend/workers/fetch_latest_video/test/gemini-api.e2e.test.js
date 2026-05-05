jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

jest.mock('../../../database/index.js', () => ({
  hasVideo: jest.fn(),
  saveProcessedItem: jest.fn()
}));

const axios = require('axios');
const database = require('../../../database/index.js');

process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.YOUTUBE_API_KEY = 'test-youtube-key';
process.env.YOUTUBE_CHANNEL_ID = 'test-channel-id';

const cronModule = require('../src/index.js');
const testingApi = cronModule.__testing;

const youtubeResponse = {
  data: {
    items: [
      {
        id: { videoId: 'abc123' },
        snippet: {
          title: 'AI &amp; developer tooling update',
          publishedAt: '2026-05-05T10:00:00Z'
        }
      }
    ]
  }
};

const geminiResponse = {
  data: {
    candidates: [
      {
        content: {
          parts: [
            {
              text: JSON.stringify({
                title: 'AI tooling update in brief',
                summary: 'A concise summary of the latest developer tooling changes from YouTube.'
              })
            }
          ]
        }
      }
    ]
  }
};

describe('fetch_latest_video Gemini integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    database.hasVideo.mockReturnValue(false);
    axios.get.mockResolvedValue(youtubeResponse);
    axios.post.mockResolvedValue(geminiResponse);
  });

  test('generateContentWithGemini calls Gemini API and parses response', async () => {
    const result = await testingApi.generateContentWithGemini({
      title: 'AI developer tooling update',
      publishedAt: '2026-05-05',
      youtubeUrl: 'https://www.youtube.com/watch?v=abc123'
    });

    expect(axios.post).toHaveBeenCalled();
    expect(result).toEqual({
      title: 'AI tooling update in brief',
      summary: 'A concise summary of the latest developer tooling changes from YouTube.'
    });
  });

  test('runFeatureCronJob fetches video, calls Gemini, and stores processed item', async () => {
    await testingApi.runFeatureCronJob();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('youtube'),
      expect.objectContaining({ params: expect.objectContaining({ type: 'video' }) })
    );
    expect(axios.post).toHaveBeenCalled();
    expect(database.saveProcessedItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'abc123',
        title: 'AI tooling update in brief',
        summary: 'A concise summary of the latest developer tooling changes from YouTube.',
        youtubeUrl: 'https://www.youtube.com/watch?v=abc123'
      })
    );
  });

  test('runFeatureCronJob skips save when video already exists', async () => {
    database.hasVideo.mockReturnValue(true);

    await testingApi.runFeatureCronJob();

    expect(database.saveProcessedItem).not.toHaveBeenCalled();
  });
});
