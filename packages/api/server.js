// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

const loadApp = require("./app.ts").default;
const winston = require("winston");
const config = require("config");
const history = require("connect-history-api-fallback");

(async function () {
  const app = await loadApp();
  app.use(history);

  const port = config.get("server.port") || 3000;
  app
    .listen(port, "0.0.0.0", () => {
      winston.info(`listening on port ${port}`);
    })
    .on("error", (e) => {
      winston.error(e);
    });
})();
