import { LoadStrategy, MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import config from "config";
import Container from "typedi";
import path from "path";
import {
  Log,
  Payment,
  Prijs,
  Reservering,
  StatusUpdate,
  Ticket,
  Uitvoering,
  User,
  Voorstelling,
} from "../models";
import winston from "winston";

export async function database(): Promise<void> {
  try {
    const type: string = config.get("database.client");
    const {
      host,
      user,
      database: dbName,
      password,
      debug,
    } = config.get("database.connection") as {
      host: string;
      user: string;
      database: string;
      password: string;
      debug: boolean;
    };
    const orm = await MikroORM.init({
      entities: [
        Log,
        Payment,
        Prijs,
        Reservering,
        StatusUpdate,
        Ticket,
        Uitvoering,
        User,
        Voorstelling,
      ],
      discovery: {
        warnWhenNoEntities: false,
        requireEntitiesArray: true,
        alwaysAnalyseProperties: false,
      },
      host,
      user,
      password,
      dbName,
      type: "mysql",
      highlighter: new SqlHighlighter(),
      loadStrategy: LoadStrategy.SELECT_IN,
      cache: {
        enabled: true,
        options: { cacheDir: path.join(__dirname, "../../.mikro-orm-cache") },
      },
      validate: true,
      debug,
    });
    winston.info(`db set ${dbName}`);
    Container.set("em", orm.em);
  } catch (e) {
    throw e;
  }
}
