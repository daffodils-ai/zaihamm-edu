// logger.js
import fs from "fs";
import path from "path";
 
export class Logger {
    static Level = {
        INFO: { name: "INFO", value: 0 },
        WARN: { name: "WARN", value: 1 },
        ERROR: { name: "ERROR", value: 2 },
        DEBUG: { name: "DEBUG", value: 3 }
    };
 
    static _levelSet = false;
    static _currentLevel = Logger.Level.INFO;
 
    static setLevel(newLevel) {
        Logger._currentLevel = newLevel;
        Logger._levelSet = true;
    }
 
    static getLogLevel(level) {
        level = level.toUpperCase();
        switch (level) {
            case "INFO":
                return Logger.Level.INFO;
            case "WARN":
                return Logger.Level.WARN;
            case "ERROR":
                return Logger.Level.ERROR;
            case "DEBUG":
                return Logger.Level.DEBUG;
            default:
                return Logger.Level.INFO;
        }
    }
 
    static log(message, level = Logger.Level.INFO) {
        if (!Logger._shouldLog(level)) return;
 
        const timestamp = Logger._getTimestamp();
        const logEntry = {
            timestamp,
            level: level.name,
            message: Logger._escapeJson(message)
        };
 
        console.log(JSON.stringify(logEntry));
    }
 
    static logToFile(message, level = Logger.Level.INFO, filePath = "output.log") {
        if (!Logger._shouldLog(level)) return;
 
        const timestamp = Logger._getTimestamp();
        const logEntry = {
            timestamp,
            level: level.name,
            message: Logger._escapeJson(message)
        };
 
        const dir = path.dirname(filePath);
        if (dir && dir !== ".") {
            fs.mkdirSync(dir, { recursive: true });
        }
 
        fs.appendFileSync(filePath, JSON.stringify(logEntry) + "\n", "utf-8");
    }
 
    static _shouldLog(level) {
        if (!Logger._levelSet) {
            return level === Logger.Level.INFO;
        }
        return level.value <= Logger._currentLevel.value;
    }
 
    static _escapeJson(message) {
        return String(message)
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\f/g, "\\f")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
    }
 
    static _getTimestamp() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
 
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
               `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
}