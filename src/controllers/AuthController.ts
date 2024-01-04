import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../constants';
import { TokenService } from '../services/TokenService';
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
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

            const payload: JwtPayload = {
                sub: String(user.id),
                role: Roles.CUSTOMER,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });
            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, //1 day
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 * 24 * 365, //1 year
                httpOnly: true,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            return next(err);
        }
    }
}
