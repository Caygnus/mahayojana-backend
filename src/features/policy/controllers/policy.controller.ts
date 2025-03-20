import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { PolicyService } from '../services/policy.service';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';
import { UpdatePolicyDTO } from '../dtos/update-policy.dto';
import { PolicyValidation } from '../validations/policy.validation';
import Logger from '../../../core/Logger';
import { NotFoundError } from '../../../core/ApiError';
export class PolicyController {
  private service: PolicyService;

  constructor() {
    this.service = new PolicyService();
  }

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

  findById = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.findById(id);
      if (!result) {
        throw new NotFoundError('Policy not found');
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
      const data = new UpdatePolicyDTO({ ...req.body, id });

      const result = await this.service.update(id, data);
      if (!result) {
        throw new NotFoundError('Policy not found');
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

  updateFields = [
    validator(PolicyValidation.auth, ValidationSource.HEADER),
    validator(PolicyValidation.id, ValidationSource.PARAM),
    validator(PolicyValidation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = new UpdatePolicyDTO({ ...req.body, id });
      data.validate();
      Logger.info(data);

      const result = await this.service.updatePolicyFields(id, data);
      if (!result) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      res.json(result);
    }),
  ];
}
