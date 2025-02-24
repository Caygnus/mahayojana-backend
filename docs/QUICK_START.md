# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)
- Git
- Docker (optional, for containerization)

## Getting Started in 5 Minutes

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd nodejs-backend-architecture-typescript
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your configurations
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Installation**
   ```bash
   curl http://localhost:3000/v1/api/status
   ```

## First API Endpoint (Example)

Here's a quick example of creating your first API endpoint:

1. **Create a Model** (`src/database/models/Post.ts`):
   ```typescript
   import { Schema, model, Document } from 'mongoose';

   export interface IPost extends Document {
     title: string;
     content: string;
     author: string;
     createdAt: Date;
   }

   const postSchema = new Schema({
     title: { type: String, required: true },
     content: { type: String, required: true },
     author: { type: String, required: true },
     createdAt: { type: Date, default: Date.now },
   });

   export const Post = model<IPost>('Post', postSchema);
   ```

2. **Create a Repository** (`src/database/repository/PostRepo.ts`):
   ```typescript
   import { Post, IPost } from '../models/Post';

   export default class PostRepo {
     public static async create(post: IPost): Promise<IPost> {
       const newPost = await Post.create(post);
       return newPost;
     }

     public static async findById(id: string): Promise<IPost | null> {
       return Post.findById(id);
     }
   }
   ```

3. **Create a Route** (`src/routes/post/index.ts`):
   ```typescript
   import express from 'express';
   import { AsyncHandler } from '../../helpers/AsyncHandler';
   import PostRepo from '../../database/repository/PostRepo';

   const router = express.Router();

   router.post(
     '/',
     AsyncHandler(async (req, res) => {
       const post = await PostRepo.create(req.body);
       return res.status(201).json(post);
     }),
   );

   router.get(
     '/:id',
     AsyncHandler(async (req, res) => {
       const post = await PostRepo.findById(req.params.id);
       if (!post) throw new NotFoundError('Post not found');
       return res.json(post);
     }),
   );

   export default router;
   ```

4. **Register Route** (`src/routes/v1/index.ts`):
   ```typescript
   import express from 'express';
   import postRouter from './post';

   const router = express.Router();
   router.use('/posts', postRouter);

   export default router;
   ```

## Common Commands

```bash
# Development
npm run dev         # Start development server
npm run build      # Build the project
npm run test       # Run tests
npm run lint       # Run linter
npm run format     # Format code

# Docker
docker-compose up  # Start with Docker
docker-compose down # Stop Docker containers

# Database
npm run db:seed    # Seed database
npm run db:migrate # Run migrations
```

## Next Steps

1. Read the full [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) documentation
2. Explore the `src` directory to understand the codebase
3. Check out existing API implementations in `src/routes`
4. Review test examples in `tests` directory
5. Start building your features!

## Need Help?

1. Check the troubleshooting section in PROJECT_STRUCTURE.md
2. Review the error logs
3. Consult the codebase documentation
4. Reach out to the team

Remember: The project follows a clean architecture pattern with clear separation of concerns. Always maintain this structure when adding new features.
