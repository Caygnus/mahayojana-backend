import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDTO } from '../dtos/create-application.dto';
import { UpdateApplicationDTO } from '../dtos/update-application.dto';
import { ApplicationValidation } from '../validations/application.validation';

export class ApplicationController {
  private service: ApplicationService;

  constructor() {
    this.service = new ApplicationService();
  }

  create = [
    validator(ApplicationValidation.auth, ValidationSource.HEADER),
    validator(ApplicationValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateApplicationDTO(req.body);
      const result = await this.service.createApplication(data);
      res.status(201).json(result);
    }),
  ];

  update = [
    validator(ApplicationValidation.auth, ValidationSource.HEADER),
    validator(ApplicationValidation.id, ValidationSource.PARAM),
    validator(ApplicationValidation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = new UpdateApplicationDTO(req.body);
      const result = await this.service.updateApplication(id, data);
      if (!result) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.json(result);
    }),
  ];

  delete = [
    validator(ApplicationValidation.auth, ValidationSource.HEADER),
    validator(ApplicationValidation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.deleteApplication(id);
      if (!result) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.status(204).send();
    }),
  ];

  list = [
    validator(ApplicationValidation.auth, ValidationSource.HEADER),
    validator(ApplicationValidation.query, ValidationSource.QUERY),
    asyncHandler(async (req: Request, res: Response) => {
      const filter = req.query;
      const results = await this.service.listApplications(filter);
      res.json(results);
    }),
  ];
}
