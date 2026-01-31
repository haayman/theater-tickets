import "dotenv/config";
import winston from "winston";
import config from "config";
import createApp from "./app.js";

(async function () {
  const app = await createApp();

  const port = (config.get("server.port") as number) || 3000;

  console.log(`\n✓ Sempre Crescendo API listening on port ${port}\n`);

  app.listen(port, "0.0.0.0").on("error", (e: Error) => {
    winston.error(e);
  });
})();
