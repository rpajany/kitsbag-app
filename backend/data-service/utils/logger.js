// Logger configuration
import winston from "winston";
 
const { combine, timestamp, printf, colorize } = winston.format;

// Define log format
const customFormat  = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
 format: combine(
    colorize(),              // color logs in console
    timestamp(),             // add timestamp
    customFormat             // custom output format
  ),
 transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // log only errors to file
    new winston.transports.File({ filename: 'logs/combined.log' })               // log all levels to file
  ],
});

// module.exports = logger;
