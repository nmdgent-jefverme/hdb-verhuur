"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const config_1 = __importStar(require("./server/services/config"));
const logger_1 = __importDefault(require("./server/services/logger"));
const database_1 = __importDefault(require("./server/services/database"));
(async () => {
    // Create a Config service
    const config = new config_1.default();
    // Create a Logger service
    const logger = new logger_1.default();
    try {
        // Create a Database service
        const mongoDBDatabase = new database_1.default(logger, config);
        const connected = await mongoDBDatabase.connect();
        if (config.env === config_1.Environment.development) {
            mongoDBDatabase.seed();
        }
        const rootPath = __dirname;
        console.log(rootPath);
        // Create the Express application
        const app = new server_1.default(rootPath, logger, config);
        app.start();
        // Stop all running processes
        const stopAllProcesses = async () => {
            app.stop();
            await mongoDBDatabase.disconnect();
            logger.info('Stopped all processes for this application', {});
        };
        process.on('SIGINT', () => stopAllProcesses());
        process.on('SIGTERM', () => stopAllProcesses());
    }
    catch (error) {
        logger.error("Can't launch the application", error);
    }
})(); // IIFE
//# sourceMappingURL=index.js.map