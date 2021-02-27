// index.js
const express = require("express");
const path = require("path");
const csrf = require("csurf");
const exphbs = require("express-handlebars");

const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const flash = require("connect-flash");
// const morgan = require("morgan");
const winston = require("winston");
const expressWinston = require("express-winston");
const csrfUse = require("./middleware/csrf");
const winstonConfig = require("./config/winston.js");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
const helpers = require("./views/helpers/helpers.js");

const hbs = exphbs.create({
  helpers,
  defaultLayout: "main",
  extname: "hbs", // для упрощения доступа
});
const keys = require("./keys");
const error404 = require("./routes/404");
// var multer  = require('multer'); // Для загрузки файлов в проекте не используется
app.engine("hbs", hbs.engine); // регистрируем в express чтое сть такой движок
app.set("view engine", "hbs"); // используем данный движок
app.set("views", "views"); // указание рабочей папки представлений
app.use(express.static(path.join(__dirname, "public")));

require("./config/passport")(passport); // pass passport for configuration
// set up our express application
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.File(winstonConfig.options.file),
      new winston.transports.Console(winstonConfig.options.console),
      // new winston.transports.File({ filename: "error.log", level: "error" }),
      // new winston.transports.Console({ filename: "combined.log" }),
    ],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY/MM/DD HH:mm:ss:SSSS" }),
      winston.format.colorize({ all: true }),
      winston.format.json(),
      winston.format.simple()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    // eslint-disable-next-line no-unused-vars
    ignoreRoute(req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);
// app.use(morgan("dev")); // log every request to the console
// app.use(morgan("combined")); // log every request to the console
app.use(express.urlencoded({ extended: true })); // Express> = 4.16.0 включает в себя bodyParser

const store = new MongoStore({
  collection: "sessionsCalc",
  uri: keys.MONGODB_URI,
});

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: keys.SESSION_MAXAGE, // 24 * 60 * 60 * 1000, // Время жизни сесии 24 * 60 * 60 * 1000 = 1 сутки
      httpOnly: false,
    },
    store,
  })
);
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(csrfUse);

// routes ======================================================================
// app.use(
//   helmet({
// 		contentSecurityPolicy: false, // не работает с картинками fontawesome
// 		// dnsPrefetchControl: false,
// 		// expectCt: false,
// 		// frameguard: false,
// 		// hidePoweredBy: false,
// 		// hsts: false,
// 		// ieNoOpen: false,
// 		// noSniff: false,
// 		// permittedCrossDomainPolicies: false,
// 		// referrerPolicy: false,
// 		// xssFilter: false
//   })
// );
// return helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: trusted,
//       scriptSrc: [
//         "'unsafe-eval'",
//         "'unsafe-inline'",
//         `nonce-${nonce}`,
//         'https://www.googletagmanager.com',
//         '*.googletagmanager.com',
//       ].concat(trusted),
//       styleSrc: [
//         "'unsafe-inline'",
//         '*.gstatic.com',
//         '*.googleapis.com',
//         'https://*.typography.com',
//       ].concat(trusted),
//       frameSrc: [
//         '*.stripe.com',
//       ].concat(trusted),
//       fontSrc: [
//         '*.cloudflare.com',
//         'https://*.cloudflare.com',
//         '*.bootstrapcdn.com',
//         '*.googleapis.com',
//         '*.gstatic.com',
//         'data',
//       ].concat(trusted),
//       imgSrc: [
//         'www.googletagmanager.com',
//       ].concat(trusted),
//     },
//     // set to true if you only want to report errors
//     reportOnly: false,
//     // set to true if you want to set all headers
//     setAllHeaders: false,
//     // set to true if you want to force buggy CSP in Safari 5
//     safari5: false
//   });
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        "https://ka-f.fontawesome.com",
        "https://fonts.gstatic.com",
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://ka-f.fontawesome.com",
        "https://cdn.jsdelivr.net",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://ka-f.fontawesome.com",
        "https://fonts.googleapis.com",
      ],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
    },
    reportOnly: false, // true for nonblocking mode, just to see violations
    safari5: false,
  })
);

// app.use(helmet());

require("./routes/routes.js")(app, passport);
// load our routes and pass in our app and fully configured passport
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.File(winstonConfig.options.errors)],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.simple()
      // winston.format.errors({ stack: true })
    ),
  })
);
app.use(error404);

async function start() {
  try {
    // configuration ===============================================================
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }); // connect to our database
    // launch ======================================================================
    app.listen(keys.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`The magic happens on port erere ${keys.PORT}`);
      // eslint-disable-next-line no-console
      console.log(`MY_TEST_ENV= ${keys.MY_TEST_ENV}`);
      // const currentDate = new Date();
      // console.log("currentDate =", currentDate);
      // let dateTimezone = moment(currentDate).tz("America/Los_Angeles").format();
      // console.log(`Сегодня: ${currentDate}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

start();
