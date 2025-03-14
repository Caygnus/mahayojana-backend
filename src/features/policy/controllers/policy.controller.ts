import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { PolicyService } from '../services/policy.service';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';
import { UpdatePolicyDTO } from '../dtos/update-policy.dto';
import { PolicyValidation } from '../validations/policy.validation';
import Logger from '../../../core/Logger';

export class PolicyController {
  private service: PolicyService;

  constructor() {
    this.service = new PolicyService();
  }

  /**
   * @swagger
   * /policy:
   *   post:
   *     summary: Create a new policy
   *     description: Creates a new insurance policy with all its details and fields
   *     tags: [Policies]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 description: Title of the policy
   *                 example: "Basic Health Insurance"
   *               description:
   *                 type: string
   *                 description: Detailed description of the policy
   *                 example: "Comprehensive health coverage for individuals"
   *               fields:
   *                 type: array
   *                 description: Dynamic fields for the policy form
   *                 items:
   *                   type: object
   *                   required:
   *                     - name
   *                     - field_id
   *                     - field_type
   *                     - field_label
   *                   properties:
   *                     name:
   *                       type: string
   *                       description: Name of the field
   *                       example: "Full Name"
   *                     field_id:
   *                       type: string
   *                       description: Unique identifier for the field
   *                       example: "full_name"
   *                     field_type:
   *                       type: string
   *                       description: Type of the field (text, number, date, etc.)
   *                       enum: ["text", "number", "date", "select", "radio", "checkbox", "textarea", "email", "phone", "password", "file"]
   *                       example: "text"
   *                     field_label:
   *                       type: string
   *                       description: Label to display for the field
   *                       example: "Full Name"
   *                     field_placeholder:
   *                       type: string
   *                       description: Placeholder text for the field
   *                       example: "Enter your full name"
   *                     field_description:
   *                       type: string
   *                       description: Help text for the field
   *                       example: "Enter your legal name as per documents"
   *                     field_options:
   *                       type: array
   *                       description: Options for select/radio/checkbox fields
   *                       items:
   *                         type: string
   *                     field_default_value:
   *                       type: string
   *                       description: Default value for the field
   *                     field_regex:
   *                       type: string
   *                       description: Validation regex pattern
   *                       example: "^[a-zA-Z ]+$"
   *                     field_regex_message:
   *                       type: string
   *                       description: Error message for regex validation
   *                       example: "Only alphabets and spaces allowed"
   *                     field_min_length:
   *                       type: number
   *                       description: Minimum length for text fields
   *                       example: 3
   *                     field_max_length:
   *                       type: number
   *                       description: Maximum length for text fields
   *                       example: 50
   *                     field_min_value:
   *                       type: number
   *                       description: Minimum value for number fields
   *                       example: 18
   *                     field_max_value:
   *                       type: number
   *                       description: Maximum value for number fields
   *                       example: 65
   *                     field_required:
   *                       type: boolean
   *                       description: Whether the field is mandatory
   *                       example: true
   *               policy_type:
   *                 type: string
   *                 description: Type of the policy
   *                 example: "Health"
   *               filling_charge:
   *                 type: number
   *                 description: Charge for filling the policy
   *                 example: 50
   *               currency:
   *                 type: string
   *                 description: Currency for monetary values
   *                 example: "USD"
   *               discount_percentage:
   *                 type: number
   *                 description: Discount percentage (0-100)
   *                 minimum: 0
   *                 maximum: 100
   *                 example: 10
   *               discount_amount:
   *                 type: number
   *                 description: Fixed discount amount
   *                 minimum: 0
   *                 example: 5
   *               tax_percentage:
   *                 type: number
   *                 description: Tax percentage (0-100)
   *                 minimum: 0
   *                 maximum: 100
   *                 example: 8
   *               tax_amount:
   *                 type: number
   *                 description: Fixed tax amount
   *                 minimum: 0
   *                 example: 4
   *               agent_commission_percentage:
   *                 type: number
   *                 description: Agent commission percentage (0-100)
   *                 minimum: 0
   *                 maximum: 100
   *                 example: 5
   *               agent_commission_amount:
   *                 type: number
   *                 description: Fixed agent commission amount
   *                 minimum: 0
   *                 example: 10
   *               agent_commission_allowed:
   *                 type: boolean
   *                 description: Whether agent commission is allowed
   *                 example: true
   *               expiration_date:
   *                 type: string
   *                 format: date-time
   *                 description: Expiration date of the policy
   *                 example: "2025-12-31T23:59:59.000Z"
   *               rules:
   *                 type: array
   *                 description: List of policy rules
   *                 items:
   *                   type: string
   *                 example: ["No pre-existing conditions covered"]
   *               benefits:
   *                 type: array
   *                 description: List of policy benefits
   *                 items:
   *                   type: string
   *                 example: ["Hospitalization coverage"]
   *     responses:
   *       201:
   *         description: Policy created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Unique identifier of the created policy
   *                 title:
   *                   type: string
   *                   description: Title of the created policy
   *                 # ... (other fields same as request)
   *       400:
   *         description: Bad Request - Validation Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: string
   *                   example: "10001"
   *                 message:
   *                   type: string
   *                   example: "Title is required"
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal Server Error
   */
  create = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreatePolicyDTO(req.body);
      data.validate();
      Logger.info(data);

      const result = await this.service.create(data);
      res.status(201).json(result);
    }),
  ];

  /**
   * @swagger
   * /policy/{id}:
   *   get:
   *     summary: Get policy by ID
   *     description: Retrieves a specific policy by its unique identifier
   *     tags: [Policies]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Unique identifier of the policy
   *         example: "507f1f77bcf86cd799439011"
   *     responses:
   *       200:
   *         description: Policy found successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Unique identifier of the policy
   *                 title:
   *                   type: string
   *                   description: Title of the policy
   *                 description:
   *                   type: string
   *                   description: Description of the policy
   *                 fields:
   *                   type: array
   *                   description: Dynamic fields of the policy
   *                 # ... (other fields same as create response)
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: Policy not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Policy not found"
   *       500:
   *         description: Internal Server Error
   */
  findById = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.findById(id);
      if (!result) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      res.json(result);
    }),
  ];

  update = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.id, ValidationSource.PARAM),
    validator(PolicyValidation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = new UpdatePolicyDTO(req.body);
      const result = await this.service.update(id, data);
      if (!result) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      res.json(result);
    }),
  ];

  delete = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.delete(id);
      if (!result) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      res.status(204).send();
    }),
  ];

  list = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.query, ValidationSource.QUERY),
    asyncHandler(async (req: Request, res: Response) => {
      const filter = req.query;
      const results = await this.service.list(filter);
      res.json(results);
    }),
  ];
}
