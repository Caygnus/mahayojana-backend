const fs = require('fs');
const path = require('path');

// Ensure build/swagger directory exists
const buildSwaggerDir = path.join(__dirname, '../build/swagger');
if (!fs.existsSync(buildSwaggerDir)) {
  fs.mkdirSync(buildSwaggerDir, { recursive: true });
}

// Copy swagger.json from src to build
const srcSwaggerJson = path.join(__dirname, '../src/swagger/swagger.json');
const buildSwaggerJson = path.join(buildSwaggerDir, 'swagger.json');

if (fs.existsSync(srcSwaggerJson)) {
  fs.copyFileSync(srcSwaggerJson, buildSwaggerJson);
  console.log('✓ Copied swagger.json to build directory');
} else {
  console.error('× swagger.json not found in src/swagger directory');
  process.exit(1);
}

// Copy API documentation guide
const srcDocsDir = path.join(__dirname, '../src/docs');
const buildDocsDir = path.join(__dirname, '../build/docs');

if (!fs.existsSync(buildDocsDir)) {
  fs.mkdirSync(buildDocsDir, { recursive: true });
}

const apiGuide = path.join(srcDocsDir, 'api-documentation-guide.md');
const buildApiGuide = path.join(buildDocsDir, 'api-documentation-guide.md');

if (fs.existsSync(apiGuide)) {
  fs.copyFileSync(apiGuide, buildApiGuide);
  console.log('✓ Copied API documentation guide to build directory');
} else {
  console.warn('! API documentation guide not found in src/docs directory');
}
