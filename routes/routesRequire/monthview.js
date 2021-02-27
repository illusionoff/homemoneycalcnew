module.exports = (app, monthOrYearView, isLoggedIn) => {
  app.get(
    ["/monthview/:date", "/monthview/month/:month"],
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
        if (req.params.month) {
          date = req.params.month;
          // eslint-disable-next-line no-console
          console.log(`это: /monthview/month/:${date}`);
          // console.log('/monthview/month/:date', date);
        } else {
          // eslint-disable-next-line no-console
          console.log(" это: /montview/:date", date);
          date = req.params.date;
        }
        // function.js большая универальная функция для yearview и monthview
        const defaultName = req.user.calc.costs.categories.name;
        const defaultColor = req.user.calc.costs.categories.color;
        const monthViewFunc = monthOrYearView(
          date,
          days,
          "month",
          defaultName,
          defaultColor
        );
        // Если ошибка в функции ( например нет дней)
        // const monthViewMonth = undefined;// null
        if (!monthViewFunc) {
          // eslint-disable-next-line no-console
          console.log("monthViewMonth Error!");
          return res.redirect("/incoming");
        }
        res.render("monthview", {
          ...monthViewFunc,
          // daysMonth: daysMonth.toObject()
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("e=", e);
      }
    }
  );
};
