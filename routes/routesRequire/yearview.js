module.exports = (app, monthOrYearView, isLoggedIn) => {
  app.get(
    ["/yearview/:date", "/yearview/year/:year"],
    isLoggedIn,
    (req, res) => {
      try {
        const { days } = req.user.calc.costs;
        if (!days.length) {
          // eslint-disable-next-line no-console
          console.log("Дней еще нет");
          res.redirect("/dayscreate/incomingnotdays");
          return;
        }

        let date;
        if (req.params.year) {
          date = req.params.year;
          // eslint-disable-next-line no-console
          console.log(`это: /yearview/year/:${date}`);
          // console.log('/monthview/month/:date', date);
        } else {
          // eslint-disable-next-line no-console
          console.log(" это: /yearview/:date", date);
          date = req.params.date;
        }
        // function.js большая универальная функция для yearview и monthview
        // const yearViewFunc = monthOrYearView(date, days, "year", req.user);
        const defaultName = req.user.calc.costs.categories.name;
        const defaultColor = req.user.calc.costs.categories.color;
        const yearViewFunc = monthOrYearView(
          date,
          days,
          "year",
          defaultName,
          defaultColor
        );
        // Если ошибка в функции ( например нет дней)
        if (!yearViewFunc) {
          // eslint-disable-next-line no-console
          console.log("yearViewFunc Error!");
          return res.redirect("/incoming");
        }

        res.render("yearview", {
          ...yearViewFunc,
          // daysMonth: daysMonth.toObject()
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("e=", e);
      }
    }
  );
};
