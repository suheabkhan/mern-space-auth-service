import { TenantService } from '../services/TenantService';
import { TenantController } from '../controllers/TenantController';
import express, { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { createTenantRequest } from '../types/index';
import logger from '../config/logger';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post('/', async (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req as createTenantRequest, res, next),
);

export default router;
