import { AuthController } from '../controllers/AuthController';
import express, { Request, Response } from 'express';

const router = express.Router();

const authController = new AuthController();

router.post('/register', (req: Request, res: Response) => {
    authController.register(req, res);
});

export default router;
