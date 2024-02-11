import { UserService } from '../services/UserService';
import { AuthController } from '../controllers/AuthController';
import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import loginValidator from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';
import authenticationMiddleware from '../middleware/authenticationMiddleware';
import { AuthRequest } from '../types/index';
import validateRefreshTokenMiddleware from '../middleware/validateRefreshTokenMiddleware';
import parseRefreshToken from '../middleware/parseRefreshToken';
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post('/register', registerValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next);
}) as RequestHandler);

router.post('/login', loginValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.login(req, res, next);
}) as RequestHandler);

router.get(
    '/self',
    authenticationMiddleware as RequestHandler,
    (req: Request, res: Response) => {
        authController.self(
            req as AuthRequest,
            res,
        ) as unknown as RequestHandler;
    },
);

router.post(
    '/refresh',
    validateRefreshTokenMiddleware as RequestHandler,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.refresh(req as AuthRequest, res, next);
    }) as RequestHandler,
);

router.post(
    '/logout',
    authenticationMiddleware as RequestHandler,
    parseRefreshToken as RequestHandler,
    (async (req: Request, res: Response, next: NextFunction) => {
        await authController.logout(req as AuthRequest, res, next);
    }) as RequestHandler,
);

export default router;
