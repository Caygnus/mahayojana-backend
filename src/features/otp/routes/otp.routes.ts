import { Router } from 'express';
import { OtpController } from '../controllers/otp.controller';

const router = Router();

const controller = new OtpController();

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: One-Time Password generation and verification
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOtpRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number to send OTP to
 */

/**
 * @swagger
 * /otp:
 *   post:
 *     summary: Generate and send OTP
 *     description: Generates a one-time password and sends it to the provided phone number
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: OTP sent successfully
 *       400:
 *         description: Bad request - validation error
 */
router.post('/', controller.create);



export default router;