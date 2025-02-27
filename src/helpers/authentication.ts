import { Request, Response, NextFunction } from 'express';
import { AuthFailureError } from '../core/ApiError';
import { AuthService } from '../features/auth/services/auth.service';
import Logger from '../core/Logger';

/**
 * Authentication middleware to validate JWT tokens
 * This middleware extracts the token from the Authorization header,
 * validates it, and adds the authenticated agent to the request object.
 */
const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthFailureError('Invalid or missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthFailureError('Invalid token format');
    }

    // Validate the token
    const authService = new AuthService();
    const { valid, agent } = await authService.validateToken(token);

    if (!valid || !agent) {
      throw new AuthFailureError('Invalid or expired token');
    }

    // Add the authenticated agent to the request
    (req as any).agent = agent;

    next();
  } catch (error) {
    Logger.error('Authentication error:', error);
    next(error);
  }
};

export default authentication;
