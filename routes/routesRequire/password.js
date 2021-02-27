const bcrypt = require("bcrypt");
const User = require("../../app/models/user");

module.exports = (app) => {
  app.get("/reset/password/:token", async (req, res) => {
    if (!req.params.token) {
      return res.redirect("/login");
    }

    try {
      const user = await User.findOne({
        "local.resetToken": req.params.token,
        "local.resetTokenExp": { $gt: Date.now() },
      });

      if (!user) {
        return res.redirect("/login");
      }
      res.render("password", {
        title: "Восстановить доступ",
        errors: req.flash("errors"),
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id.toString(),
        token: req.params.token,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  app.post("/password", async (req, res) => {
    try {
      const user = await User.findOne({
        _id: req.body.userId,
        "local.resetToken": req.body.token,
        "local.resetTokenExp": { $gt: Date.now() },
      });
      if (user) {
        const salt = await bcrypt.genSalt(8);
        user.local.password = await bcrypt.hash(req.body.password, salt, null);
        user.local.resetToken = undefined;
        user.local.resetTokenExp = undefined;
        await user.save();
        // await user.save(async function(err) {
        //     if (err) throw err;
        //     return
        // });
        res.redirect("/login");
      } else {
        req.flash("loginError", "Время жизни токена истекло");
        res.redirect("/login");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
};
