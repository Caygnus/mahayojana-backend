# Getting Started

## Project Overview

This is a feature-based Node.js backend project using TypeScript, Express, and MongoDB. The project follows clean architecture principles and is organized around features.

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the project:
   ```bash
   npm run setup
   ```
   This will create the necessary directory structure and boilerplate code.

4. Update `.env` file with your configuration

5. Start development server:
   ```bash
   npm run watch
   ```

## Project Structure

```
src/
├── core/           # Core business logic & interfaces
│   ├── api.response.ts
│   └── error.handler.ts
├── features/       # Feature modules
│   └── auth/      # Example feature
├── utils/         # Shared utilities
├── config/        # Configuration
└── routes/        # API routes by version
    ├── v1/
    └── v2/
```

## Available Scripts

- `npm run setup` - Initialize project structure
- `npm run create-feature <name> [version]` - Create new feature
- `npm run cleanup-feature <name>` - Remove feature
- `npm run watch` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

## Next Steps

1. Read [2_ARCHITECTURE.md](2_ARCHITECTURE.md) for detailed architecture overview
2. Check [3_FEATURE_DEVELOPMENT.md](3_FEATURE_DEVELOPMENT.md) for feature development guide
3. See [4_BEST_PRACTICES.md](4_BEST_PRACTICES.md) for coding standards 