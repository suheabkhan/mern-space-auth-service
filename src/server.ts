import app from './app';
import { Config } from './config/index';
import logger from './config/logger';

const startServer = () => {
    try {
        const PORT = Config.PORT;
        app.listen(PORT, () => {
            logger.info(`Listening on port ${PORT}`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error('an error occured', err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();
