const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../app/models/user");
const resetEmail = require("../../emails/reset");
const keys = require("../../keys"); // use this one for testing

const transporter = nodemailer.createTransport(keys.GMAIL_SETTINGS);
module.exports = (app) => {
  app.get("/reset", (req, res) => {
    res.render("reset", {
      errors: req.flash("errors"),
      message: req.flash("message"),
    });
  });

  app.post("/reset", (req, res) => {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          req.flash("errors", " Ошибка, повторите попытку позже");
          return res.redirect("/reset");
        }

        const token = buffer.toString("hex");
        const candidate = await User.findOne({ "local.email": req.body.email });

        if (candidate) {
          candidate.local.resetToken = token;
          candidate.local.resetTokenExp = Date.now() + 20 * 60 * 1000;
          await candidate.save(async (err) => {
            if (err) throw err;
            return candidate;
          });
          // eslint-disable-next-line no-console
          console.log(
            "resetEmail(candidate.local.email, token)=",
            resetEmail(candidate.local.email, token)
          );
          await transporter.sendMail(
            resetEmail(candidate.local.email, token),
            function (err, info) {
              if (err) console.log("transporter.sendMail err:", err);
              else console.log("transporter.sendMail info:", info);
            }
          );
          // eslint-disable-next-line no-unused-vars
          transporter.verify((error, success) => {
            if (error) {
              // eslint-disable-next-line no-console
              console.log("verify error:", error);
              req.flash("errors", "Ошибка, попробуйте еще раз позже");
              res.redirect("/reset");
            } else {
              // eslint-disable-next-line no-console
              console.log("Server is ready to take our messages gmail.com");
              req.flash(
                "message",
                "На вашу почту было отправлено письмо со ссылкой на страницу изменения пароля."
              );
              res.redirect("/reset");
            }
          });
        } else {
          req.flash("errors", "Такого email нет");
          res.redirect("/reset");
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
};
