import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /auth/signup-agent:
 *   post:
 *     summary: Register a new agent
 *     description: Create a new agent account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Agent created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: Email already exists
 */
router.post('/signup-agent', controller.signupAgent);

/**
 * @swagger
 * /auth/login-agent:
 *   post:
 *     summary: Login as an agent
 *     description: Authenticate an agent and get a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Agent logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Agent logged in successfully
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Agent not found
 */
router.post('/login-agent', controller.loginAgent);

router.post('/signup-user', controller.signupUser);

router.post('/login-user', controller.loginUser);
export default router;
