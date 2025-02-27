import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';
import Logger from './core/Logger';
import { ErrorType, ApiError, InternalError } from './core/ApiError';
import { corsUrl } from './config';
import { NotFoundError } from './core/ApiError';
import { environment } from './config';
import cors from 'cors';
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './utils/swagger';

// Load environment variables
import './database';

dotenv.config();

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

process.on('unhandledRejection', (e) => {
  Logger.error(e);
});

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Swagger UI
if (environment !== 'production') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
  );
  Logger.info('Swagger UI available at /api-docs');
}

// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
}) as ErrorRequestHandler);

export default app;
