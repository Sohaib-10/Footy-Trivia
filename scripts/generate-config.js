const fs = require('fs');
const path = require('path');

const apiBaseUrl = (process.env.API_BASE_URL || 'https://footytrivia-api.onrender.com').trim();
const outputPath = path.join(__dirname, '..', 'config.js');

function validateApiBaseUrl(url) {
  if (!url) return '';
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    throw new Error(`Invalid API_BASE_URL: ${url}`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`API_BASE_URL must use http or https: ${url}`);
  }
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('API_BASE_URL must use https in production builds');
  }
  return parsed.origin;
}

const safeUrl = validateApiBaseUrl(apiBaseUrl);

const content = `// Auto-generated at build time — do not commit (see config.js.example)
window.ENV = window.ENV || {};
window.ENV.API_BASE_URL = ${JSON.stringify(safeUrl)};
window.ENV.SPORTSDB_API_URL = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php';
`;

fs.writeFileSync(outputPath, content, 'utf8');
console.log('Generated config.js' + (safeUrl ? ` (API_BASE_URL=${safeUrl})` : ' (API_BASE_URL empty — set env var for production)'));
