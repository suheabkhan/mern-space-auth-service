import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Roles } from '../constants';
import fs from 'fs';
import path from 'path';
import createHttpError from 'http-errors';
import { Config } from '../config/index';
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
            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                );
            } catch (err) {
                const error = createHttpError(
                    500,
                    'Error during read of private key',
                );
                return next(error);
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: Roles.CUSTOMER,
            };
            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            });
            const refreshToken = sign(
                payload,
                String(Config.REFRESH_TOKEN_SECRETKEY),
                {
                    algorithm: 'HS256',
                    expiresIn: '1y',
                    issuer: 'auth-service',
                },
            );
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
