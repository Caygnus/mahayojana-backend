import { Request, Response, NextFunction } from 'express';
import Logger from './Logger';

/**
 * Formats the request body as a pretty JSON string
 */
const formatJsonBody = (body: any): string => {
    try {
        return JSON.stringify(body, null, 2);
    } catch (error) {
        return JSON.stringify({ error: 'Unable to stringify body' });
    }
};

/**
 * Formats an incoming request as a cURL command
 */
const formatRequestAsCurl = (req: Request): string => {
    const method = req.method;
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    let curlCmd = `curl -X ${method} '${url}'`;

    // Add headers
    Object.entries(req.headers).forEach(([key, value]) => {
        // Skip host header as it's included in the URL
        if (key.toLowerCase() !== 'host') {
            curlCmd += `\n  -H '${key}: ${value}'`;
        }
    });

    // Add request body if present
    if (['POST', 'PUT', 'PATCH'].includes(method) && Object.keys(req.body).length > 0) {
        curlCmd += `\n  -d '${formatJsonBody(req.body)}'`;
    }

    return curlCmd;
};

/**
 * Middleware to log requests and responses
 */
export const requestLoggingMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // Log incoming request
    Logger.info('\n📥 Incoming Request Details:');
    Logger.info('=========================');
    Logger.info(`${req.method} ${req.originalUrl}`);

    if (Object.keys(req.body).length > 0) {
        Logger.info('\nRequest Body:');
        Logger.info('------------');
        Logger.info(formatJsonBody(req.body));
    }

    Logger.info('\nEquivalent cURL command:');
    Logger.info('--------------------');
    Logger.info(formatRequestAsCurl(req));
    Logger.info('=========================');

    // Capture and log response
    const originalSend = res.send;
    res.send = function (body) {
        Logger.info('\n📤 Outgoing Response:');
        Logger.info('===================');
        Logger.info(`Status: ${res.statusCode}`);

        const headers = res.getHeaders();
        if (Object.keys(headers).length > 0) {
            Logger.info('\nResponse Headers:');
            Logger.info('----------------');
            Logger.info(formatJsonBody(headers));
        }

        Logger.info('\nResponse Body:');
        Logger.info('-------------');
        Logger.info(formatJsonBody(body));
        Logger.info('===================\n');

        return originalSend.call(this, body);
    };

    next();
};

export default requestLoggingMiddleware; 