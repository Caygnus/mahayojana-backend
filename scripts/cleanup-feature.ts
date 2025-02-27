import fs from 'fs';
import path from 'path';

const FEATURE_NAME = process.argv[2];

if (!FEATURE_NAME) {
  console.error('Please provide a feature name');
  console.log('Usage: npm run cleanup-feature <feature-name>');
  process.exit(1);
}

// Convert feature name to kebab case
const featureNameKebab = FEATURE_NAME.toLowerCase().replace(/\s+/g, '-');

// Paths
const FEATURE_DIR = path.join(
  process.cwd(),
  'src',
  'features',
  featureNameKebab,
);
const ROUTES_DIR = path.join(process.cwd(), 'src', 'routes');

// Function to remove directory recursively
const removeDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
    console.log(`Removed directory: ${dir}`);
  }
};

// Function to update route files
const cleanupRoutes = () => {
  // Get all version directories
  const versionDirs = fs
    .readdirSync(ROUTES_DIR)
    .filter(
      (dir) =>
        dir.startsWith('v') &&
        fs.statSync(path.join(ROUTES_DIR, dir)).isDirectory(),
    );

  versionDirs.forEach((version) => {
    const versionIndexPath = path.join(ROUTES_DIR, version, 'index.ts');
    if (fs.existsSync(versionIndexPath)) {
      let content = fs.readFileSync(versionIndexPath, 'utf-8');

      // Remove import statement
      const importRegex = new RegExp(
        `import\\s+${featureNameKebab}Routes\\s+from\\s+['"]../../features/${featureNameKebab}/routes/${featureNameKebab}.routes['"];?\\n?`,
      );
      content = content.replace(importRegex, '');

      // Remove route registration
      const routeRegex = new RegExp(
        `\\s*router\\.use\\s*\\(['"]/${featureNameKebab}['"]\\s*,\\s*${featureNameKebab}Routes\\);?\\n?`,
      );
      content = content.replace(routeRegex, '');

      // Clean up extra newlines
      content = content.replace(/\n{3,}/g, '\n\n');

      fs.writeFileSync(versionIndexPath, content);
      console.log(`Updated routes in ${versionIndexPath}`);
    }
  });
};

// Main cleanup function
const cleanup = () => {
  try {
    // Check if feature exists
    if (!fs.existsSync(FEATURE_DIR)) {
      console.error(`Feature '${featureNameKebab}' not found`);
      process.exit(1);
    }

    // Remove feature directory
    removeDir(FEATURE_DIR);

    // Clean up route registrations
    cleanupRoutes();

    console.log(`\n✨ Feature '${featureNameKebab}' removed successfully!`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanup();
