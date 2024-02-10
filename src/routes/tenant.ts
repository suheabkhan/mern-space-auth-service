import { TenantService } from '../services/TenantService';
import { TenantController } from '../controllers/TenantController';
import express, { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { createTenantRequest } from '../types/index';
import logger from '../config/logger';
import authenticationMiddleware from '../middleware/authenticationMiddleware';
import { canAccess } from '../middleware/canAccess';
import { Roles } from '../constants/index';
import tenantValidator from '../validators/tenantValidator';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
    '/',
    authenticationMiddleware,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req as createTenantRequest, res, next),
);

router.patch(
    '/:id',
    authenticationMiddleware,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: createTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
);
router.get('/', (req, res, next) => tenantController.getAll(req, res, next));
router.get(
    '/:id',
    authenticationMiddleware,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.getOne(req, res, next),
);
router.delete(
    '/:id',
    authenticationMiddleware,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;
