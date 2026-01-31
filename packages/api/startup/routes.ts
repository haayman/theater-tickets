import express from "express";
import cors from "cors";
import morgan from "morgan";
import winston from "winston";
import config from "config";
import auth from "../routes/auth";
import users from "../routes/users";
import voorstelling from "../routes/voorstelling";
import reservering from "../routes/reservering";
import uitvoering from "../routes/uitvoering";
import log from "../routes/log";
import payment from "../routes/payment";
import iframe from "../routes/iframe";
import mail from "../routes/mail";
import errorHandler from "../middleware/error";
import setUser from "../middleware/user";
import { RequestContext, EntityManager } from "@mikro-orm/core";
import Container from "typedi";

export function routes(app) {
  app.set("view engine", "ejs");
  app.use(cors());

  // app.all('*', servername);
  app.all("*", setUser);

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  // HTTP request logging with Morgan (after body-parser so we can access req.body)
  const enableHttpLogging =
    config.has("enableHttpLogging") && config.get("enableHttpLogging");
  winston.info(`HTTP logging is ${enableHttpLogging ? "enabled" : "disabled"}`);

  if (enableHttpLogging) {
    const stream = {
      write: (message: string) => {
        winston.info(message.trim());
      },
    };

    // Add custom token for request body (sanitized)
    morgan.token("body", (req: any) => {
      if (req.method === "GET") return "";
      const body = req.body;
      if (!body || Object.keys(body).length === 0) return "";
      // Don't log passwords
      const sanitized = { ...body };
      if (sanitized.password) sanitized.password = "***";
      return JSON.stringify(sanitized);
    });

    app.use(
      morgan(
        ":method :url :status :response-time ms - :res[content-length] :body",
        { stream },
      ),
    );
  }

  // create a new request context for every request
  // https://mikro-orm.io/docs/identity-map#requestcontext-helper-for-di-containers
  // use RequestContext.getRepository() to retrieve it
  const em: EntityManager = Container.get("em");
  app.use((_req, _res, next) => {
    RequestContext.create(em, next);
  });

  // routes
  app.use("/api/auth", auth);
  app.use("/api/user", users);
  app.use("/api/voorstelling", voorstelling);
  app.use("/api/uitvoering", uitvoering);
  app.use("/api/reservering", reservering);
  app.use("/api/log", log);
  app.use("/api/payment", payment);
  app.use("/api/mail", mail);

  app.use("/iframe*", iframe);

  // error handler last
  app.use(errorHandler);
}
