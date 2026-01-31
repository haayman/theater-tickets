const instance_var = "INSTANCE_ID"; // Fixes node-config issue
const env = {
    NODE_ENV: "production",
    API_HOST: "http://localhost",
    API_PORT: "3002",
};

module.exports = {
  apps: [
    {
      name: "crescendo-api-prod",
      script: "./node_modules/ts-node/dist/bin.js",
      args: "./server.js",
      cwd: "./api",
      instance_var,
      env,
      watch: false,
    },
    {
      name: "crescendo-client-prod",
      script: "./node_modules/nuxi/bin/nuxi.mjs",
      args: "start",
      cwd: "./client",
      instance_var,
      env,
    },
  ],
};
