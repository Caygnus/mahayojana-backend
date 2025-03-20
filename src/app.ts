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
import * as path from 'path';

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

// Serve OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'swagger/swagger.json'));
});

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerUrl: '/openapi.json',
    explorer: true,
  }),
);
Logger.info('Swagger UI available at /api-docs');

// Serve Redoc UI
app.get('/redoc', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Inter:400,600|Source+Code+Pro:400" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Inter, sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="redoc"></div>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        <script>
          Redoc.init(
            '/openapi.json',
            {
              hideDownloadButton: false,
              theme: {
                colors: {
                  primary: {
                    main: '#2684FF'
                  }
                },
                typography: {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  headings: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  }
                }
              }
            },
            document.getElementById('redoc')
          );
        </script>
      </body>
    </html>
  `;
  res.send(htmlContent);
});
Logger.info('Redoc UI available at /redoc');

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
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
