import express, {
    NextFunction,
    Request,
    Response,
    RequestHandler,
} from 'express';
import { User } from '../entity/User';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { UpdateUserRequest, createUserRequest } from '../types/index';
import authenticationMiddleware from '../middleware/authenticationMiddleware';
import { canAccess } from '../middleware/canAccess';
import { Roles } from '../constants/index';
import logger from '../config/logger';
import updateUserValidator from '../validators/update-user-validator';
import createUserValidator from '../validators/createUserValidator';
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);
router.post(
    '/',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(
            req as createUserRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);
router.patch(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
    '/',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        userController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
    '/:id',
    authenticationMiddleware as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        userController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
