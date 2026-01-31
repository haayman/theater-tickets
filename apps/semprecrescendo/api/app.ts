import "reflect-metadata";
import express from "express";
import * as api from "@theater-tickets/api";

export default async function createApp() {
  const app = express();

  await api.logging();
  api.di();
  await api.database();
  await api.queue();
  api.routes(app);

  return app;
}
