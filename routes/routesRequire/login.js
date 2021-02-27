module.exports = (app, passport, isLoggedInHome) => {
  const { validationResult } = require("express-validator");
  const { loginValidators } = require("../../utils/validators");
  // 	// locally --------------------------------
  // 		// LOGIN ===============================
  // 		// show the login form
  app.get("/login", isLoggedInHome, (req, res) => {
    res.render("login", {
      title: "Войти",
      isLogin: true,
      // message: req.flash('loginMessage'),
      errors: req.flash("loginErrMessage"),
    });
  });

  // process the login form
  app.post(
    "/login",
    loginValidators,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          req.flash("loginErrMessage", errors.array()[0].msg);
          // eslint-disable-next-line no-console
          console.log(
            "loginErrMessage.validationResult=",
            errors.array()[0].msg
          );
          return res.status(422).redirect("/login");
        }
        next();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    passport.authenticate("local-login", {
      successRedirect: "/incoming", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );
};
