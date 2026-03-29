import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Logger } from './src/logger/logger.js';
import databaseConnection from './src/database/connection.js';
import routes from './src/routes/index.js';
import { errorHandlerMiddleware, notFoundMiddleware } from './src/middleware/error_handler_middleware.js';
import cron from 'node-cron';
import FeeService from './src/service/FeeService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    Logger.log(`${req.method} ${req.path}`, Logger.Level.INFO);
    next();
});

// Routes
app.use(routes);

// 404 handler
app.use(notFoundMiddleware);

// Error handler middleware
app.use(errorHandlerMiddleware);

/**
 * Monthly fee generation job
 * Runs on 27th of every month at 00:00
 */
const scheduleMonthlyFeeGeneration = () => {
    cron.schedule('0 0 27 * *', async () => {
        try {
            Logger.log('Starting monthly fee generation job', Logger.Level.INFO);
            // This can be extended to iterate through all organizations
            // For now, this is a placeholder for the cron job
            Logger.log('Monthly fee generation job completed', Logger.Level.INFO);
        } catch (error) {
            Logger.log(`Error in monthly fee generation: ${error.message}`, Logger.Level.ERROR);
        }
    });
};

/**
 * Initialize application
 */
const initializeApp = async () => {
    try {
        // Connect to database
        await databaseConnection.connect();
        Logger.log('Database connection established', Logger.Level.INFO);

        // Schedule cron jobs
        scheduleMonthlyFeeGeneration();
        Logger.log('Cron jobs scheduled', Logger.Level.INFO);

        // Start server
        app.listen(PORT, () => {
            Logger.log(`Server started on port ${PORT}`, Logger.Level.INFO);
            console.log(`\n✓ Server running at http://localhost:${PORT}`);
            console.log(`✓ API documentation available at see API_DOCUMENTATION.md`);
        });
    } catch (error) {
        Logger.log(`Error initializing app: ${error.message}`, Logger.Level.ERROR);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    Logger.log('Shutting down gracefully...', Logger.Level.INFO);
    await databaseConnection.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.log('Shutting down gracefully...', Logger.Level.INFO);
    await databaseConnection.disconnect();
    process.exit(0);
});

// Start application
initializeApp();

export default app;
