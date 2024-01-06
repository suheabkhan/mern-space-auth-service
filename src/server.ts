import app from './app';
import { AppDataSource } from './config/data-source';
import { Config } from './config/index';
import logger from './config/logger';

const startServer = async () => {
    try {
        const PORT = Config.PORT;
        await AppDataSource.initialize();
        logger.info('Database connected..');
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

void startServer();
