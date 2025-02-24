import Logger from './core/Logger';
import { port } from './config';
import app from './app';

app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e))
  .on('close', () => Logger.info('server closed'))
  .on('SIGTERM', () =>
    Logger.info('SIGTERM signal received: closing HTTP server'),
  )
  .on('SIGINT', () =>
    Logger.info('SIGINT signal received: closing HTTP server'),
  )
  .on('uncaughtException', (e) => Logger.error(e))
  .on('unhandledRejection', (e) => Logger.error(e));
