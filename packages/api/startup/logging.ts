import winston from "winston";
import config from "config";
import "express-async-errors";

export function logging() {
  // Custom format for better readability
  const customFormat = winston.format.printf(
    ({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    },
  );

  // Error replacer for JSON serialization
  function replaceErrors(key: string, value: any) {
    if (value instanceof Buffer) {
      return value.toString("base64");
    } else if (value instanceof Error) {
      const error: Record<string, any> = {};
      Object.getOwnPropertyNames(value).forEach(function (key) {
        error[key] = (value as any)[key];
      });
      return error;
    }
    return value;
  }

  // Define transports based on environment
  const transports: winston.transport[] = [
    // Console transport with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        customFormat,
      ),
      level: config.get("logLevel"),
    }),
  ];

  // Configure winston
  winston.configure({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json({ replacer: replaceErrors }),
    ),
    transports,
    exitOnError: false,
  });

  // Verify transports are configured
  winston.info("Winston logging initialized");

  // Handle uncaught exceptions
  process.on("unhandledRejection", (ex: Error) => {
    winston.error("Unhandled Rejection:", ex);
  });

  process.on("uncaughtException", (ex: Error) => {
    winston.error("Uncaught Exception:", ex);
    // process.exit(1);
  });
}
