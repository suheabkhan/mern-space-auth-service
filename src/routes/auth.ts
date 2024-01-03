import { UserService } from '../services/UserService';
import { AuthController } from '../controllers/AuthController';
import express, { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

router.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

export default router;
