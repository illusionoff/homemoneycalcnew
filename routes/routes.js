// eslint-disable eslint linebreak-style
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("isAuthenticated");
    res.locals.isAuth = req.isAuthenticated(); // ключ для отображение кнопки Выйти вместо Войти
    // console.log("isAuth=", isAuth)
    return next();
  }
  // eslint-disable-next-line no-console
  console.log("NOT isAuthenticated");
  return res.redirect("/");
}

// замена функции проверки аутентификации для главной страницы
function isLoggedInHome(req, res, next) {
  if (req.isAuthenticated()) {
    // eslint-disable-next-line no-console
    console.log("isAuthenticated");
    res.locals.isAuth = req.isAuthenticated(); // ключ для отображение кнопки Выйти вместо Войти
    // console.log("isAuth=", isAuth)
    return next();
  }
  // eslint-disable-next-line no-console
  console.log("NOT isAuthenticated");
  return next();
}

module.exports = (app, passport) => {
  try {
    // const {registerValidators} = require('../utils/validators')
    const { defaultView } = require("./functions.js");
    const datepickerOptionsConfig = require("../config/datepickerOptions.js");
    const { monthOrYearView } = require("./functions.js");
    require("./routesRequire/settings.js")(app, isLoggedIn);
    require("./routesRequire/settingsProfile.js")(app, isLoggedIn);
    require("./routesRequire/settingsCategories.js")(app, isLoggedIn);
    require("./routesRequire/incoming.js")(
      app,
      defaultView,
      datepickerOptionsConfig,
      isLoggedIn
    );
    require("./routesRequire/dayscreate.js")(
      app,
      datepickerOptionsConfig,
      isLoggedIn
    );
    require("./routesRequire/login.js")(app, passport, isLoggedInHome);
    require("./routesRequire/signup.js")(app, passport, isLoggedInHome); // validMailPass
    require("./routesRequire/auth.js")(app, passport);
    require("./routesRequire/connectLocal.js")(app, passport, isLoggedIn);
    require("./routesRequire/unlink.js")(app);
    require("./routesRequire/editday.js")(app, defaultView, isLoggedIn);
    require("./routesRequire/monthview.js")(app, monthOrYearView, isLoggedIn);
    require("./routesRequire/yearview.js")(app, monthOrYearView, isLoggedIn);
    require("./routesRequire/about.js")(app, isLoggedInHome);
    require("./routesRequire/reset.js")(app);
    require("./routesRequire/password.js")(app);
    // normal routes ===============================================================
    // Проверка примера другого layouts
    app.get("/othertest", (req, res) => {
      res.render("othertest", {
        layout: "other",
        title: "Другой layout ",
      });
    });
    //
    // show the home page (will also have our login links)
    app.get("/", isLoggedInHome, (req, res) => {
      res.render("index", {
        title: "HomeMoneyCalc",
        isHome: true,
      });
    });

    // // // LOGOUT ==============================
    app.get("/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });

    app.get("/error", (req, res) => {
      res.render("error", {
        title: "ТЕСТ страницы error ",
      });
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
