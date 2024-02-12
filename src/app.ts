import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import createError, { HttpError } from 'http-errors';
import router from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import cors from 'cors';
const app = express();
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
        methods: 'GET,POST,PUT,PATCH,DELETE',
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
const authRoutes = router;
const tenantRoutes = tenantRouter;
app.get('/', (req: Request, res: Response) => {
    res.send('welcome to auth service');
});
//This is an GEH test
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
    const error = createError(401, 'you are not allowed to access this page');
    //Here basically, async errors are not caught by the GEH(global error handler), so to catch them
    // we need the next paramter, to return the error
    return next(error);
});
// This is an API test
app.get('/test', (req: Request, res: Response) => {
    res.status(200).send('welcome to auth service');
});

app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/users', userRouter);
/*-- as there is no use of next function, but without using it,
our middleware doesnot work.. as the global error handler always takes 4 parameters
*/

//eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || err.status || 500;
    logger.error('global error handler:: {}', {
        message: err.message,
        statusCode,
    });
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});

export default app;
