import config from "config";
import globalData from "../components/globalData";

async function connect() {
  // ngrok is commented out - only needed for local tunnel during development
  // const ngrok = require("ngrok");
  // const port = config.get("server.port") || 3000;
  // const url = await ngrok.connect(port);
  // global.localtunnel = url;
  // globalData.set('localtunnel', url);
}

export function env() {
  if (process.env.COMPUTERNAME === "DEVCOM") {
    connect();
  }
}
