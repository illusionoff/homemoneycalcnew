module.exports = (app, defaultView, datepickerOptionsConfig, isLoggedIn) => {
  const moment = require("moment-timezone");
  app.get(["/incoming", "/incoming/dayview/:date"], isLoggedIn, (req, res) => {
    try {
      const { days } = req.user.calc.costs;
      if (!req.user.calc.costs.days.length) {
        // eslint-disable-next-line no-console
        console.log("Дней еще нет");
        res.redirect("/dayscreate/incomingnotdays");
        // res.flash = 'Поздравляем! Вы зарегистрированы. Создайте необходимые категории расходов/доходов';
        // res.redirect('/settings/categories');
        // res.render('incoming_first');
        return;
      }
      let dayIndex;
      let day;
      if (req.params.date) {
        // eslint-disable-next-line no-console
        console.log(" это: /incoming/dayview/:date");
        const { date } = req.params;
        const currentDate = moment(new Date(date)).format("YYYY-MM-DD");
        dayIndex = days.findIndex(
          (item) => moment(item.date).format("YYYY-MM-DD") === currentDate
        ); // Так работает
        day = days[dayIndex];
      } else {
        // eslint-disable-next-line no-console
        console.log(" это: /incoming");
        const arrayGetTime = [];
        let getTime;
        // создаем массив getTime timestamp числовых значений времени
        days.forEach((day, index) => {
          getTime = day.date.getTime();
          arrayGetTime[index] = getTime;
        });
        const arrayGetTimeClone = arrayGetTime.slice().sort();
        const newDate = new Date();
        const getTimezoneOffset = newDate.getTimezoneOffset() * 60 * 1000;
        newDate.setHours(0, 0, 0, 0); // удаляем данные о часах минутах и так далее
        const timestampserverGetTime = newDate.getTime() - getTimezoneOffset; // добавляем Time зону к UNC значению getTime
        // рабочий вариант нахождения индекса ближайшего меньшего либо равного значения
        dayIndex = arrayGetTime.indexOf(
          arrayGetTimeClone.reverse().find((e) => e <= timestampserverGetTime)
        );
        day = days[dayIndex];
      }

      const categoriesname = req.user.calc.costs.categories.name;
      const categoriescolor = req.user.calc.costs.categories.color;
      defaultView(categoriesname, categoriescolor, day, dayIndex, days);
      // Создаем массив с датами существующих дней
      const enableListDate = [];
      days.forEach((day, index) => (enableListDate[index] = day.date));
      let datepickerOptions = datepickerOptionsConfig; // если напрямую передавать, то экранируется слешем
      datepickerOptions = JSON.stringify(datepickerOptions);
      const newDateView = moment(new Date(day.date)).locale("ru").format("LL");
      // throw new Error("incoming Error!");
      // expwewewnston.wewew();
      res.render("incoming", {
        day: day.toObject(),
        isIncoming: true,
        enableListDate,
        datepickerOptions,
        newDateView,
        // user : user.toObject()
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
  // Вывод всех дней для тестов
  // eslint-disable-next-line func-names
  app.get("/incoming/viewdays/all", isLoggedIn, function (req, res) {
    try {
      const { days } = req.user.calc.costs;
      if (!req.user.calc.costs.days.length) {
        // eslint-disable-next-line no-console
        console.log("Дней еще нет");
        res.redirect("/dayscreate/incomingnotdays");
        return;
      }
      const categoriesname = req.user.calc.costs.categories.name;
      const categoriescolor = req.user.calc.costs.categories.color;
      // // для вывода информации по всем дням
      // days.forEach(function(day, i) { // выбираем день
      //     // console.log(`item[${i}].NameCategories=`, item.NameCategories);  // выбираем внутри дня категорию
      //     day.NameCategories.forEach(function(сateg, i2) { // выбираем категорию
      //     let result = defaultName.findIndex(value => value === сateg); //
      //     if (result >= 0 ) {
      //         // проверка совпадения цвета
      //       return req.user.calc.costs.days[i].colorCategories[i2] = defaultColor[result]; // переписываем цвет в категориях днях как в default
      //       }
      //   });
      // });

      // для вывода информации по одному дню
      const dayIndex = days.length - 1;
      const day = days[dayIndex];

      defaultView(categoriesname, categoriescolor, day, dayIndex, days);
      const { user } = req;
      res.render("viewdays_2", {
        day: day.toObject(),
        user: user.toObject(),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  app.get("/incoming/delday/:index", isLoggedIn, async (req, res) => {
    try {
      const { index } = req.params;
      // req.user.calc.costs.days.id(req.user.calc.costs.days[index].id).remove(); // работает удаление объекта в массиве объектов по index _id
      req.user.calc.costs.days.id(index).remove(); //
      await req.user.save((err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log("Ошибка удаления из массива 1");
        }
      });
      res.redirect("/incoming");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
};
