const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'processed_videos.json');

function ensureDbFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ items: [] }, null, 2));
  }
}

function loadDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const parsed = JSON.parse(raw || '{"items": []}');
  return Array.isArray(parsed.items) ? parsed : { items: [] };
}

function saveDb(db) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function getAllProcessedItems() {
  const db = loadDb();
  return [...db.items].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });
}

function hasVideo(videoId) {
  const db = loadDb();
  return db.items.some((item) => item.id === videoId);
}

function saveProcessedItem(item) {
  const db = loadDb();
  const existingIndex = db.items.findIndex((entry) => entry.id === item.id);

  if (existingIndex >= 0) {
    db.items[existingIndex] = { ...db.items[existingIndex], ...item };
  } else {
    db.items.push(item);
  }

  saveDb(db);
  return item;
}

function seedIfEmpty(seedItems) {
  const db = loadDb();
  if (db.items.length > 0) {
    return;
  }

  db.items = seedItems;
  saveDb(db);
}

module.exports = {
  getAllProcessedItems,
  hasVideo,
  saveProcessedItem,
  seedIfEmpty
};
