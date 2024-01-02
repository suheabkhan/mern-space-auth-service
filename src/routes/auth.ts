import { UserService } from '../services/UserService';
import { AuthController } from '../controllers/AuthController';
import express, { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post('/register', async (req: Request, res: Response) => {
    await authController.register(req, res);
});

export default router;
