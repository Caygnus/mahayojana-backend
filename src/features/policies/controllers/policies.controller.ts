import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { PoliciesService } from '../services/policies.service';
import { BadRequestError } from '../../../core/ApiError';

export class PoliciesController {
  constructor(private policiesService: PoliciesService) { }

  /**
   * Create a new policy with dynamic fields
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policy = await this.policiesService.create(req.body);
      new SuccessResponse('Policy created successfully', policy).send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a policy by ID
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policy = await this.policiesService.findById(req.params.id);
      new SuccessResponse('Policy retrieved successfully', policy).send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a policy by ID
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policy = await this.policiesService.update(req.params.id, req.body);
      new SuccessResponse('Policy updated successfully', policy).send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a policy by ID
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.policiesService.delete(req.params.id);
      new SuccessResponse('Policy deleted successfully').send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all policies with pagination and filtering
   */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Extract dynamic field queries
      const dynamicFields: Record<string, any> = {};
      for (const key in req.query) {
        if (key.startsWith('dynamic.')) {
          const fieldName = key.substring(8); // Remove 'dynamic.' prefix
          dynamicFields[fieldName] = req.query[key];
        }
      }

      // Prepare query
      const query: Record<string, any> = {
        ...req.query,
        dynamicFields: Object.keys(dynamicFields).length > 0 ? dynamicFields : undefined
      };

      const result = await this.policiesService.findAll(query, page, limit);
      new SuccessResponse('Policies retrieved successfully', result).send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update policy schema definition
   */
  async updateSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body.schemaDefinition) {
        throw new BadRequestError('Schema definition is required');
      }

      const policy = await this.policiesService.updateSchema(
        req.params.id,
        req.body.schemaDefinition
      );

      new SuccessResponse('Policy schema updated successfully', policy).send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update policy dynamic fields
   */
  async updateDynamicFields(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body.dynamicFields) {
        throw new BadRequestError('Dynamic fields are required');
      }

      const policy = await this.policiesService.updateDynamicFields(
        req.params.id,
        req.body.dynamicFields
      );

      new SuccessResponse('Policy dynamic fields updated successfully', policy).send(res);
    } catch (error) {
      next(error);
    }
  }
}