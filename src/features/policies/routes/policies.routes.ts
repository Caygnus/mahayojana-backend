import express from 'express';
import { PoliciesController } from '../controllers/policies.controller';
import { PoliciesService } from '../services/policies.service';
import validator from '../../../helpers/validator';
import { PoliciesValidation } from '../validations/policies.validation';
import asyncHandler from '../../../helpers/asyncHandler';
import { ValidationSource } from '../../../helpers/validator';
import authentication from '../../../helpers/authentication';

const router = express.Router();
const controller = new PoliciesController(new PoliciesService());

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePolicyRequest:
 *       type: object
 *       required:
 *         - policyNumber
 *         - policyType
 *         - title
 *         - policyStartDate
 *         - policyEndDate
 *         - policyStatus
 *         - policyAmount
 *         - policyTerm
 *       properties:
 *         policyNumber:
 *           type: string
 *           description: Unique policy number
 *         policyType:
 *           type: string
 *           description: Type of policy
 *         title:
 *           type: string
 *           description: Policy title
 *         description:
 *           type: string
 *           description: Policy description
 *         policyStartDate:
 *           type: string
 *           format: date-time
 *           description: Policy start date
 *         policyEndDate:
 *           type: string
 *           format: date-time
 *           description: Policy end date
 *         policyStatus:
 *           type: string
 *           description: Current status of the policy
 *         policyAmount:
 *           type: number
 *           description: Policy amount
 *         policyTerm:
 *           type: number
 *           description: Policy term in months
 *         schemaDefinition:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/DynamicFieldDefinition'
 *           description: Schema definition for dynamic fields
 *         dynamicFields:
 *           type: object
 *           additionalProperties: true
 *           description: Dynamic fields data based on schema definition
 *     UpdateSchemaRequest:
 *       type: object
 *       required:
 *         - schemaDefinition
 *       properties:
 *         schemaDefinition:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/DynamicFieldDefinition'
 *           description: Schema definition for dynamic fields
 *     UpdateDynamicFieldsRequest:
 *       type: object
 *       required:
 *         - dynamicFields
 *       properties:
 *         dynamicFields:
 *           type: object
 *           additionalProperties: true
 *           description: Dynamic fields data based on schema definition
 */

/**
 * @swagger
 * tags:
 *   name: Policies
 *   description: Policy management with dynamic fields
 */

/**
 * @swagger
 * /policies:
 *   post:
 *     summary: Create a new policy
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePolicyRequest'
 *     responses:
 *       200:
 *         description: Policy created successfully
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
 *                   example: Policy created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Policy'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authentication,
  validator(PoliciesValidation.create),
  asyncHandler(controller.create.bind(controller)),
);

/**
 * @swagger
 * /policies:
 *   get:
 *     summary: Get all policies with pagination and filtering
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: policyType
 *         schema:
 *           type: string
 *         description: Filter by policy type
 *       - in: query
 *         name: policyStatus
 *         schema:
 *           type: string
 *         description: Filter by policy status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (partial match)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (from)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (to)
 *       - in: query
 *         name: dynamic.*
 *         description: Filter by dynamic fields (e.g., dynamic.category=OBC)
 *     responses:
 *       200:
 *         description: Success
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
 *                   example: Policies retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     policies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Policy'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authentication,
  validator(PoliciesValidation.query, ValidationSource.QUERY),
  asyncHandler(controller.findAll.bind(controller)),
);

/**
 * @swagger
 * /policies/{id}:
 *   get:
 *     summary: Get a policy by ID
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Policy ID
 *     responses:
 *       200:
 *         description: Success
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
 *                   example: Policy retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Policy'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Policy not found
 */
router.get(
  '/:id',
  authentication,
  validator(PoliciesValidation.id, ValidationSource.PARAM),
  asyncHandler(controller.findById.bind(controller)),
);

/**
 * @swagger
 * /policies/{id}:
 *   put:
 *     summary: Update a policy
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Policy ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyNumber:
 *                 type: string
 *               policyType:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               policyStartDate:
 *                 type: string
 *                 format: date-time
 *               policyEndDate:
 *                 type: string
 *                 format: date-time
 *               policyStatus:
 *                 type: string
 *               policyAmount:
 *                 type: number
 *               policyTerm:
 *                 type: number
 *               schemaDefinition:
 *                 type: object
 *                 additionalProperties:
 *                   $ref: '#/components/schemas/DynamicFieldDefinition'
 *               dynamicFields:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Policy updated successfully
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
 *                   example: Policy updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Policy'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Policy not found
 */
router.put(
  '/:id',
  authentication,
  validator(PoliciesValidation.id, ValidationSource.PARAM),
  validator(PoliciesValidation.update),
  asyncHandler(controller.update.bind(controller)),
);

/**
 * @swagger
 * /policies/{id}:
 *   delete:
 *     summary: Delete a policy
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Policy ID
 *     responses:
 *       200:
 *         description: Policy deleted successfully
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
 *                   example: Policy deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Policy not found
 */
router.delete(
  '/:id',
  authentication,
  validator(PoliciesValidation.id, ValidationSource.PARAM),
  asyncHandler(controller.delete.bind(controller)),
);

/**
 * @swagger
 * /policies/{id}/schema:
 *   put:
 *     summary: Update policy schema definition
 *     description: Update the schema definition for dynamic fields of a policy
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Policy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSchemaRequest'
 *     responses:
 *       200:
 *         description: Schema updated successfully
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
 *                   example: Policy schema updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Policy'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Policy not found
 */
router.put(
  '/:id/schema',
  authentication,
  validator(PoliciesValidation.id, ValidationSource.PARAM),
  asyncHandler(controller.updateSchema.bind(controller)),
);

/**
 * @swagger
 * /policies/{id}/fields:
 *   put:
 *     summary: Update policy dynamic fields
 *     description: Update the dynamic fields data for a policy
 *     tags: [Policies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Policy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDynamicFieldsRequest'
 *     responses:
 *       200:
 *         description: Dynamic fields updated successfully
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
 *                   example: Policy dynamic fields updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Policy'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Policy not found
 */
router.put(
  '/:id/fields',
  authentication,
  validator(PoliciesValidation.id, ValidationSource.PARAM),
  asyncHandler(controller.updateDynamicFields.bind(controller)),
);

export default router;
