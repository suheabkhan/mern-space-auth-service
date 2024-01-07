import { Request } from 'express';
import { Config } from '../config/index';
import { expressjwt } from 'express-jwt';
import { AuthCookie } from '../types/index';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRETKEY!,
    algorithms: ['HS256'],
    //if not found in auth headers, check in cookies
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
});
