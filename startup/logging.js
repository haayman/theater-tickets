"use strict";

const winston = require("winston");
const config = require("config");
const path = require("path");
require("express-async-errors");

module.exports = function () {
  // Custom format for better readability
  const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  });

  // Error replacer for JSON serialization
  function replaceErrors(key, value) {
    if (value instanceof Buffer) {
      return value.toString("base64");
    } else if (value instanceof Error) {
      const error = {};
      Object.getOwnPropertyNames(value).forEach(function (key) {
        error[key] = value[key];
      });
      return error;
    }
    return value;
  }

  // Define transports based on environment
  const transports = [
    // Console transport with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        customFormat
      ),
      level: config.get("logLevel"),
    }),
  ];


  // Configure winston
  winston.configure({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json({ replacer: replaceErrors })
    ),
    transports,
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (ex) => {
    winston.error("Uncaught Exception:", ex);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (ex) => {
    winston.error("Unhandled Rejection:", ex);
    process.exit(1);
  });

  winston.info("Winston logging initialized");
};
