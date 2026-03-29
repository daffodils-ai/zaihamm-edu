import mongoose from 'mongoose';
import { Logger } from '../logger/logger.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection module with connection pooling
 */
class DatabaseConnection {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    /**
     * Initialize database connection with pooling
     */
    async connect() {
        if (this.isConnected) {
            Logger.log('Already connected to database', Logger.Level.INFO);
            return this.connection;
        }

        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
            
            const options = {
                maxPoolSize: 10,
                minPoolSize: 5,
                maxIdleTimeMS: 45000,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                retryWrites: true,
                w: 'majority'
            };

            this.connection = await mongoose.connect(mongoUri, options);
            this.isConnected = true;
            
            Logger.log('Database connected successfully', Logger.Level.INFO);
            
            // Connection event handlers
            mongoose.connection.on('disconnected', () => {
                Logger.log('Database disconnected', Logger.Level.WARN);
                this.isConnected = false;
            });

            mongoose.connection.on('error', (err) => {
                Logger.log(`Database error: ${err.message}`, Logger.Level.ERROR);
            });

            return this.connection;
        } catch (error) {
            Logger.log(`Database connection error: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Disconnect from database
     */
    async disconnect() {
        if (!this.isConnected) {
            Logger.log('Database not connected', Logger.Level.INFO);
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            Logger.log('Database disconnected', Logger.Level.INFO);
        } catch (error) {
            Logger.log(`Database disconnection error: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return this.isConnected;
    }
}

export default new DatabaseConnection();
