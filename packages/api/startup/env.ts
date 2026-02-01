import config from "config";
import globalData from "../components/globalData";
import winston from "winston";

async function connect() {
  const useLocaltunnel = config.get("useLocaltunnel");
  
  if (!useLocaltunnel) {
    return;
  }

  const localtunnel = require("localtunnel");
  const port = config.get("server.port") || 3000;
  
  // Use a fixed subdomain if configured, otherwise random
  const subdomain = config.has("localtunnel.subdomain") 
    ? config.get("localtunnel.subdomain") 
    : undefined;

  return new Promise((resolve, reject) => {
    const options: any = { port };
    if (subdomain) {
      options.subdomain = subdomain;
      winston.info(`🌐 Connecting to localtunnel with subdomain: ${subdomain}`);
    }
    
    const tunnel = localtunnel(options, (err: Error, tunnel: any) => {
      if (err) {
        winston.error("Localtunnel error:", err);
        reject(err);
        return;
      }
      
      const url = tunnel.url;
      winston.info(`🌐 Localtunnel active: ${url}`);
      winston.info(`   Mollie webhook: ${url}/api/payment/bank/:id`);
      winston.info(`   Mollie redirect: ${config.get("server.url")}/api/payment/done/:id`);
      globalData.set("localtunnel", url);
      resolve(url);
    });

    tunnel.on("error", (err: Error) => {
      winston.error("Localtunnel error:", err);
    });
  });
}

export async function env() {
  await connect();
}
