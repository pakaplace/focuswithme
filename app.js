const { App, LogLevel } = require("@slack/bolt");
const { config } = require("dotenv");
const { registerListeners } = require("./listeners");
const { connectDB } = require("./db");
config();

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true, // This enables WebSocket connection
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN, //socket mode: Used to establish connection with local slack app
  logLevel: LogLevel.DEBUG,
  customRoutes: [
    {
      path: "/health-check",
      method: ["GET"],
      handler: (req, res) => {
        res.writeHead(200);
        res.end("Health check information goes here!");
      },
    },
  ],
});

/** Register Listeners */
registerListeners(app);

/** Start the Bolt App */
(async () => {
  try {
    await connectDB();
    await app.start();
    console.log("⚡️ Bolt app and DB are running!");
  } catch (error) {
    console.error("Failed to start the app or connect to DB", error);
  }
})();
