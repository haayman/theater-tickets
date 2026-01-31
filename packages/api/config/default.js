const path = require("path");

console.log('[CONFIG] Loading:', __filename);

module.exports = {
  name: "theater-tickets",
  enableHttpLogging: process.env.ENABLE_HTTP_LOGGING === "true", // default false
  logLevel: process.env.LOG_LEVEL || "info",
  database: {
    client: "mysql",
    connection: {
      host: "localhost",
      database: "tickets",
      user: "tickets",
      password: "CHANGE_ME",
    },
    debug: false,
  },
  redis: {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    port: 6379,
    host: "localhost",
    family: 4,
    db: 0,
  },

  // payment: {
  //   mollie_key: "CHANGE_ME",
  // },

  jwtPrivateKey: "CHANGE_ME",
  server: {
    url: "http://localhost:3000",
    port: 3000,
  },
  mail_transport: {
    // debug: false,
    // logger: true,
    // sendmail: true,
    // path: "/usr/sbin/sendmail",
  },
  email: {
    afzender: "Theater Tickets",
    afzender_email: "noreply@example.com",
    //    alwaysTo: "test@example.com",
    // bcc: 'info@example.com',
    subject_prefix: "[Theater]",
  },

  email_roots: [
    path.resolve(__dirname, "..", "emails", "jatheater"),
    path.resolve(__dirname, "..", "emails"),
  ],

  // aantal dagen
  teruggave_termijn: 14,
};

