// we can use a library called express-jwt to validate our middleware,which is well-tested
import { Request } from 'express';
import { Config } from '../config/index';
import { GetVerificationKey, expressjwt } from 'express-jwt';
import jwksClient from 'jwks-rsa';
//since we are using rsa algorithm to create accessToken, we use jwks-rsa library to read the public secretkey

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: String(Config.JWKS_URI),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        //By default, this will fetch the data from the authorization header
        // we will override it by also to get the token from cookie as well
        const authHeader = req.headers.authorization;
        //Bearer ejuybhjavZAahdkhskhkhus
        if (authHeader && authHeader.split(' ')[1] !== undefined) {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }
        //if not found in auth headers, check in cookies
        type Token = {
            accessToken: string;
        };
        const { accessToken } = req.cookies as Token;

        return accessToken;
    },
});
