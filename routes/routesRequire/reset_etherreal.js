const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../app/models/user");
const resetEmail = require("../../emails/reset");
// const keys = require("../../keys"); // use this one for testing

// const transporter = nodemailer.createTransport(keys.GMAIL_SETTINGS);
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
          // await transporter.sendMail(resetEmail(candidate.local.email, token));
          // eslint-disable-next-line no-unused-vars
          // transporter.verify((error, success) => {
          //   if (error) {
          //     // eslint-disable-next-line no-console
          //     console.log(error);
          //     req.flash("errors", "Ошибка, попробуйте еще раз позже");
          //     res.redirect("/reset");
          //   } else {
          //     // eslint-disable-next-line no-console
          //     console.log("Server is ready to take our messages gmail.com");
          //     req.flash(
          //       "message",
          //       "На вашу почту было отправлено письмо со ссылкой на страницу изменения пароля."
          //     );
          //     res.redirect("/reset");
          //   }
          // });
          // eslint-disable-next-line no-console
          console.log("test files=test4");
          const main = async () => {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            const testAccount = await nodemailer.createTestAccount();
            // eslint-disable-next-line no-console
            console.log(" const testAccount");
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              // requireTLS: true,
              secure: false, // true for 465, false for other ports
              // tls: {
              //   rejectUnauthorized: false,
              // },
              auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
              },
            });
            // eslint-disable-next-line no-console
            console.log(" const transporter");
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Fred Foo 👻" <foo@example.com>', // sender address
              to: "bar@example.com, baz@example.com", // list of receivers
              subject: "Hello ✔", // Subject line
              text: "Hello world?", // plain text body
              html: "<b>Hello world?</b>", // html body
            });
            // eslint-disable-next-line no-console
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // eslint-disable-next-line no-console
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          };
          // eslint-disable-next-line no-console
          main().catch(console.error);
          res.redirect("/reset");
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
