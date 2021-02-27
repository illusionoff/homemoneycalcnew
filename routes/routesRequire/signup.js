module.exports = (app, passport, isLoggedInHome) => {
  const { validationResult } = require("express-validator");
  const { registerValidators } = require("../../utils/validators");
  // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // это отключение проверки SSL вроде
  require("nodemailer");
  // 		// SIGNUP =================================
  // 		// show the signup form
  app.get("/signup", isLoggedInHome, (req, res) => {
    res.render("signup", {
      title: "Зарегистрироваться",
      isRegister: true,
      errors: req.flash("signupErrMessage"),
    });
  });

  // 		// process the signup form
  app.post(
    "/signup",
    registerValidators,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          req.flash("signupErrMessage", errors.array()[0].msg);
          // eslint-disable-next-line no-console
          console.log(
            "signupErrMessage.validationResult=",
            errors.array()[0].msg
          );
          return res.status(422).redirect("/signup");
        }

        next();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    passport.authenticate("local-signup", {
      successRedirect: "/settings/categories/:first", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );
};
