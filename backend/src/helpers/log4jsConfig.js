import log4js from "log4js";

const logConfiguration = log4js.configure({
  appenders: {
    console: {
      type: "console",
    },
    debugConsole: {
      type: "file",
      filename: "./loggers.log",
    },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "ALL",
    },
    DEV: {
      appenders: ["console"],
      level: "ALL",
    },
    PROD: {
      appenders: ["debugConsole"],
      level: "ALL",
    },
  },
});

export default logConfiguration;