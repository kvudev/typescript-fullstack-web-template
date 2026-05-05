const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;

function findChildCronEntryFiles(dirPath) {
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	const result = [];

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			const childIndex = path.join(fullPath, 'index.js');
			const childSrcIndex = path.join(fullPath, 'src', 'index.js');
			if (fs.existsSync(childSrcIndex)) {
				result.push(childSrcIndex);
				continue;
			}

			if (fs.existsSync(childIndex)) {
				result.push(childIndex);
				continue;
			}

			result.push(...findChildCronEntryFiles(fullPath));
		}
	}

	return result;
}

function startChildCron(entryPath) {
	try {
		const cronModule = require(entryPath);
		const starter = cronModule?.start || cronModule?.default || cronModule;

		if (typeof starter === 'function') {
			starter();
			console.log(`[cron-hub] Started child cron: ${path.relative(ROOT_DIR, entryPath)}`);
			return true;
		}

		console.warn(`[cron-hub] Skipped ${path.relative(ROOT_DIR, entryPath)} because no start function was exported.`);
		return false;
	} catch (error) {
		console.error(`[cron-hub] Failed to start ${path.relative(ROOT_DIR, entryPath)}:`, error.message);
		return false;
	}
}

function startCronHub() {
	const childEntries = findChildCronEntryFiles(ROOT_DIR).filter(
		(filePath) => filePath !== path.join(ROOT_DIR, 'index.js')
	);

	console.log(`[cron-hub] Found ${childEntries.length} child cron job(s).`);

	let startedCount = 0;
	for (const entryPath of childEntries) {
		if (startChildCron(entryPath)) {
			startedCount += 1;
		}
	}

	console.log(`[cron-hub] Started ${startedCount}/${childEntries.length} child cron job(s).`);
}

startCronHub();
