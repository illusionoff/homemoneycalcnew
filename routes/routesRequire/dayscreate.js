module.exports = (app, datepickerOptionsConfig, isLoggedIn) => {
  const { validationResult } = require("express-validator");
  const { dayscreateValidators } = require("../../utils/validators");
  const moment = require("moment-timezone");
  app.get(
    ["/dayscreate", "/dayscreate/:incomingnotdays"],
    isLoggedIn,
    (req, res) => {
      try {
        let incomingnotdays = "";
        if (req.params.incomingnotdays) {
          incomingnotdays = "Еще не создано ни одного дня. Создайте день";
        }
        // Создаем массив с датами существующих дней
        const { days } = req.user.calc.costs;
        const enableListDate = [];
        days.forEach((day, index) => (enableListDate[index] = day.date));
        const datepickerOptions = datepickerOptionsConfig; // если напрямую передавать без внутренней переменной, то экранируется слешем
        // let dateTimezone = moment(currentDate).tz("America/Los_Angeles").format();
        // let dateTimezone = moment(currentDate); // если вводим объкт  new Date(); то параметры тайм зоны берутся из него
        res.render("dayscreate", {
          user: req.user.toObject(),
          enableListDate,
          datepickerOptions: JSON.stringify(datepickerOptions),
          message: incomingnotdays,
          errors: req.flash("dayscreateErrMessage"),
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );

  app.post(
    "/dayscreate/createday",
    isLoggedIn,
    dayscreateValidators,
    async (req, res) => {
      // app.post('/dayscreate/createday/:categories/:date/:cost/:coment', isLoggedIn, async function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // eslint-disable-next-line no-console
          console.log(
            "dayscreateErrMessage.validationResult=",
            errors.array()[0].msg
          );
          req.flash("dayscreateErrMessage", errors.array()[0].msg);
          return res.status(422).redirect("/dayscreate");
        }
        const categories = req.body.selected;
        const { cost } = req.body;
        const { coment } = req.body;
        const { date } = req.body;
        const { days } = req.user.calc.costs;
        const dateObj = new Date(date);
        const currentDate = moment(dateObj).format("YYYY-MM-DD");
        const result = days.findIndex(
          (item) => moment(item.date).format("YYYY-MM-DD") === currentDate
        ); // Так работает
        if (result >= 0) {
          req.flash("dayscreateErrMessage", "Сегодня день уже создан.");
          res.redirect("/dayscreate");
          return;
        }
        // создаем новую дату с введенной  пользователем одной категорией
        req.user.calc.costs.days.push({
          date: currentDate, // new Date(),//date
          NameCategories: req.user.calc.costs.categories.name[categories], // req.user.calc.costs.categories.name[7]], //"xnjnj",//user.costs.categories.name[2],
          colorCategories: req.user.calc.costs.categories.color[categories], // req.user.calc.costs.categories.color[7]],//"color ewew",//user.costs.categories.color[2],
          costs: cost,
          allCost: cost,
          coments: coment,
        });
        const { user } = req;
        await user.save((err) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(
              "Ошибка записи mongoose: '/dayscreate/createday  err:'",
              err
            );
            req.flash(
              "dayscreateErrMessage",
              "Ошибка записи mongoose: '/dayscreate/createday'"
            );
            return res.status(422).redirect("/dayscreate");
            // return res.redirect('/incoming')
          }
        });
        return res.redirect("/incoming");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("e=", e);
      }
    }
  );
};
