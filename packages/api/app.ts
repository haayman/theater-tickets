import "reflect-metadata";
import express, { Application } from "express";
import { logging } from "./startup/logging";
import { database } from "./startup/database";
import { routes } from "./startup/routes";
import { queue } from "./startup/queue";
import { di } from "./startup/di";

export async function createApp(): Promise<Application> {
  const app = express();

  logging();
  di();
  await database();
  await queue();
  routes(app);

  return app;
}
