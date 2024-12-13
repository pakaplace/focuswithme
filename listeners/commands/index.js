const { scheduleCommandCallback } = require("./scheduleCommand");

module.exports.register = (app) => {
  app.command("/schedule", scheduleCommandCallback);
};
