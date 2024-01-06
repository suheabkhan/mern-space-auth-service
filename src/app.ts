import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import createError from 'http-errors';
import router from './routes/auth';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
const app = express();

app.use(express.json());
app.use(cookieParser());
const authRoutes = router;
app.get('/', (req: Request, res: Response) => {
    res.send('welcome to auth service');
});
//This is an GEH test
app.get('/error', async (req: Request, res: Response, next: NextFunction) => {
    const error = createError(401, 'you are not allowed to access this page');
    //Here basically, async errors are not caught by the GEH(global error handler), so to catch them
    // we need the next paramter, to return the error
    return next(error);
    res.send('welcome to auth service');
});
// This is an API test
app.get('/test', (req: Request, res: Response) => {
    res.status(200).send('welcome to auth service');
});

app.use('/auth', authRoutes);
/*-- as there is no use of next function, but without using it,
our middleware doesnot work.. as the global error handler always takes 4 parameters
*/

//eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error('global error handler::' + err.message);
    const statusCode = err.statusCode || 500;
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
