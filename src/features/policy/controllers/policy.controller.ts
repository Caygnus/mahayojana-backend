import { Request, Response } from 'express';
import { PolicyService } from '../services/policy.service';

export class PolicyController {
  private service: PolicyService;

  constructor() {
    this.service = new PolicyService();
  }
}
