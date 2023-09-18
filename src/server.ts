import app from './app';
import { Config } from './config/index';

const startServer = () => {
    try {
        const PORT = Config.PORT;
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Listening on port ${PORT}`);
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('an error occuerd', err);
        process.exit(1);
    }
};

startServer();
