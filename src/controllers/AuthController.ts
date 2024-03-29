import { NextFunction, Response } from 'express';
import { AuthRequest, RegisterUserRequest } from '../types/index';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../constants';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';
import { User } from '../entity/User';
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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
                role: Roles.CUSTOMER,
            });
            this.logger.info('User is registered with id ' + user.id);

            // const payload: JwtPayload = {
            //     sub: String(user.id),
            //     role: Roles.CUSTOMER,
            // };

            // const accessToken = this.tokenService.generateAccessToken(payload);

            // // Persist the refresh token
            // const newRefreshToken =
            //     await this.tokenService.persistRefreshToken(user);

            // const refreshToken = this.tokenService.generateRefreshToken({
            //     ...payload,
            //     id: String(newRefreshToken.id),
            // });
            // res.cookie('accessToken', accessToken, {
            //     domain: 'localhost',
            //     sameSite: 'none',
            //     maxAge: 60 * 60 * 1000, //1 day
            //     httpOnly: true,
            //     secure: true,
            // });
            // res.cookie('refreshToken', refreshToken, {
            //     domain: 'localhost',
            //     sameSite: 'none',
            //     maxAge: 60 * 60 * 1000 * 24 * 365, //1 year
            //     httpOnly: true,
            //     secure: true,
            // });
            await this.setCookies(res, user);
            res.status(201).json({ id: user.id });
        } catch (err) {
            return next(err);
        }
    }

    async setCookies(res: Response, user: User) {
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
            secure: true,
        });
        res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 * 24 * 365, //1 year
            httpOnly: true,
            secure: true,
        });
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        //validate the email field
        const result = validationResult(req);
        if (!result.isEmpty()) {
            //This error format is to maintain the consistency between the GEH
            return res.status(400).json({ errors: result.array() });
        }
        const { email, password } = req.body;
        this.logger.debug('New request has received for user login', {
            email,
            password: '******',
        });
        try {
            const user = await this.userService.findByEmailWithPassword(email);
            if (!user) {
                const emailDoesNotExist = createHttpError(
                    400,
                    'Email or Password Does not match',
                );
                return next(emailDoesNotExist);
            }

            const passwordMatch = await this.credentialService.checkPassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const emailDoesNotExist = createHttpError(
                    400,
                    'Email or Password Does not match',
                );
                return next(emailDoesNotExist);
            }

            // const payload: JwtPayload = {
            //     sub: String(user.id),
            //     role: Roles.CUSTOMER,
            // };

            // const accessToken = this.tokenService.generateAccessToken(payload);

            // // Persist the refresh token
            // const newRefreshToken =
            //     await this.tokenService.persistRefreshToken(user);

            // const refreshToken = this.tokenService.generateRefreshToken({
            //     ...payload,
            //     id: String(newRefreshToken.id),
            // });
            // res.cookie('accessToken', accessToken, {
            //     domain: 'localhost',
            //     sameSite: 'strict',
            //     maxAge: 60 * 60 * 1000, //1 day
            //     httpOnly: true,
            //     // secure: true,
            // });
            // res.cookie('refreshToken', refreshToken, {
            //     domain: 'localhost',
            //     sameSite: 'strict',
            //     maxAge: 60 * 60 * 1000 * 24 * 365, //1 year
            //     httpOnly: true,
            //     // secure: true,
            // });
            await this.setCookies(res, user);
            res.status(200).json({ id: user.id });
        } catch (err) {
            return next(err);
        }
    }

    async self(req: AuthRequest, res: Response) {
        //middleware injects a property called as auth inside request , by decoding all parameters
        //so create a type of what is encoded while creating jwt
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    400,
                    'User with the token could not find',
                );
                return next(error);
            }

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                secure: true,
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true,
            });

            this.logger.info('User has been logged in', { id: user.id });
            res.json({ id: user.id });
        } catch (err) {
            return next(err);
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info('Refresh token has been deleted', req.auth.id);
            this.logger.info('User has been logged out', { id: req.auth.sub });

            res.clearCookie('accessToken', {
                sameSite: 'strict',
                secure: true,
            });
            res.clearCookie('refreshToken', {
                sameSite: 'strict',
                secure: true,
            });
            res.json({});
        } catch (err) {
            return next(err);
        }
    }
}
