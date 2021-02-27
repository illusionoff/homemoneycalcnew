module.exports.options = {
  file: {
    level: "info",
    filename: "./logs/app.log",
    handleRejections: true,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    // level: "debug",
    // level: "info",
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  errors: {
    level: "error",
    filename: "./logs/errors.log",
    handleRejections: true,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
};
