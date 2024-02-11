import { TenantService } from '../services/TenantService';
import { TenantController } from '../controllers/TenantController';
import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
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
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(
            req as createTenantRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.patch(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: createTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next) as unknown as RequestHandler,
);
router.get(
    '/',
    (req, res, next) =>
        tenantController.getAll(req, res, next) as unknown as RequestHandler,
);
router.get(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.getOne(req, res, next) as unknown as RequestHandler,
);
router.delete(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
