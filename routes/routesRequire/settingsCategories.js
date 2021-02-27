module.exports = (app, isLoggedIn) => {
  const { validationResult } = require("express-validator");
  const {
    settingsDelValidators,
    settingsMoveValidators,
    settingsNewValidators,
    settingsСolorValidators,
  } = require("../../utils/validators");
  // ['/settings/categories', '/settings/categories/:first' ]
  app.get(
    ["/settings/categories", "/settings/categories/:first"],
    isLoggedIn,
    (req, res) => {
      try {
        if (req.params.first) {
          res.render("settings/categories", {
            user: req.user.toObject(),
            message: `Поздравляем! Вы зарегистрированы. Создайте необходимые категории расходов/доходов, а затем создайте первый день в разделе "Основная".
            На Ваш email отправлено письмо.
            `,
          });
          return;
        }
        res.render("settings/categories", {
          user: req.user.toObject(),
          message: req.flash("settingsNewcategoriesMessage"),
          errors: req.flash("settingsCategoriesErrMessage"),
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );
  app.post(
    "/settings/categories/del",
    settingsDelValidators,
    isLoggedIn,
    async (req, res) => {
      try {
        const { idcategor } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // eslint-disable-next-line no-console
          console.log(
            "settingsCategoriesDelMessage.validationResult=",
            errors.array()[0].msg
          );
          req.flash("settingsCategoriesErrMessage", errors.array()[0].msg);
          return res.status(422).redirect("/settings/categories");
        }
        req.user.calc.costs.categories.name.splice(idcategor, 1);
        req.user.calc.costs.categories.color.splice(idcategor, 1);
        const { user } = req;
        await user.save((err) => {
          // eslint-disable-next-line no-console
          if (err) return console.log("err");
          return res.redirect("/settings/categories");
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );

  app.post(
    "/settings/categories/colorCategories",
    isLoggedIn,
    settingsСolorValidators,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // eslint-disable-next-line no-console
          console.log(
            "settingsCategoriesDelMessage.validationResult=",
            errors.array()[0].msg
          );
          req.flash("settingsCategoriesErrMessage", errors.array()[0].msg);
          return res.status(422).redirect("/settings/categories");
        }
        const { idCategories } = req.body;
        const { colorCategories } = req.body;
        const { user } = req;
        await user.updateOne(
          {
            $set: {
              [`calc.costs.categories.color.${idCategories}`]: colorCategories,
            },
          },
          (err) => {
            // eslint-disable-next-line no-console
            if (err) return console.log(err);
            res.redirect("/settings/categories");
          }
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );

  app.post(
    "/settings/categories/newcategories",
    isLoggedIn,
    settingsNewValidators,
    async (req, res) => {
      try {
        const colorCategories = req.body.selected;
        const { nameCategories } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // console.log('settingsCategoriesMoveMessage.validationResult=', errors.array()[0].msg);
          req.flash("settingsCategoriesErrMessage", errors.array()[0].msg);
          return res.status(422).redirect("/settings/categories");
        }
        req.user.calc.costs.categories.name.push(nameCategories);
        req.user.calc.costs.categories.color.push(colorCategories);
        const { user } = req;
        await user.save((err) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log("err=", err);
            // eslint-disable-next-line no-console
            console.log("err /settings/categories/newcategories");
            return res.redirect("/settings/categories");
          }
          res.redirect("/settings/categories");
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );

  // Меняем местами категории в Setting dafault настройках вместе с цветом
  app.post(
    "/settings/categories/movecategories",
    isLoggedIn,
    settingsMoveValidators,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // eslint-disable-next-line no-console
          console.log(
            "settingsCategoriesMoveMessage.validationResult=",
            errors.array()[0].msg
          );
          req.flash("settingsCategoriesErrMessage", errors.array()[0].msg);
          return res.status(422).redirect("/settings/categories");
        }
        const { current } = req.body;
        const { inputMove } = req.body;
        const { user } = req;
        await user.updateOne(
          {
            $set: {
              [`calc.costs.categories.name.${inputMove}`]: user.calc.costs
                .categories.name[current],
              [`calc.costs.categories.name.${current}`]: user.calc.costs
                .categories.name[inputMove],
              [`calc.costs.categories.color.${inputMove}`]: user.calc.costs
                .categories.color[current],
              [`calc.costs.categories.color.${current}`]: user.calc.costs
                .categories.color[inputMove],
            },
          },
          (err) => {
            // eslint-disable-next-line no-console
            if (err) return console.log(err);
            res.redirect("/settings/categories");
          }
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );
  // 	// LOGOUT ==============================
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
