jest.mock('layer/feature/youtube', () => ({
  getAllProcessedItems: jest.fn(),
  saveProcessedItem: jest.fn(),
  seedIfEmpty: jest.fn(),
  hasVideo: jest.fn()
}));

jest.mock('layer/feature', () => ({
  youtube: {
    getAllProcessedItems: jest.fn(),
    saveProcessedItem: jest.fn(),
    seedIfEmpty: jest.fn(),
    hasVideo: jest.fn()
  }
}));
