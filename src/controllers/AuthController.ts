import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //validate the email field
        const result = validationResult(req);
        if (!result.isEmpty()) {
            //This error format is to maintain the consistency between the GEH
            return res.status(400).json({ errors: result.array() });
        }
        const { firstName, lastName, email, password } = req.body;
        this.logger.debug('New request has received for user registration', {
            firstName,
            lastName,
            email,
            password: '******',
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info('User is registered with id ' + user.id);
            res.status(201).json({ id: user.id });
        } catch (err) {
            return next(err);
        }
    }
}
