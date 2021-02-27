/* eslint-disable eqeqeq */
module.exports.defaultView = (
  defaultName,
  defaultColor,
  day,
  dayIndex,
  days
) => {
  try {
    // изменение цвета категорий в соотвествии с default = req.user.calc.costs.categories.name
    day.NameCategories.forEach((сateg, i2) => {
      // выбираем категорию
      const result = defaultName.findIndex((value) => value === сateg); //
      if (result >= 0) {
        // проверка совпадения цвета
        // return (req.user.calc.costs.days[dayIndex].colorCategories[i2] =
        return (days[dayIndex].colorCategories[i2] = defaultColor[result]); // переписываем цвет в категориях днях как в default
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("e=", e);
  }
};

module.exports.monthOrYearView = (
  date,
  days,
  monthOrYear,
  defaultName,
  defaultColor
) => {
  const moment = require("moment-timezone");
  try {
    // eslint-disable-next-line no-console
    // узнаем текущий день
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    let month;
    let format;
    let monthStart;
    let monthEnd;
    let monthOrYearViewformat;
    if (monthOrYear === "month") {
      format = "YYYY-MM";
      month = newDate.getMonth();
      // eslint-disable-next-line no-multi-assign
      monthStart = monthEnd = month;
      monthOrYearViewformat = "MMMM YYYY";
      moment.locale("ru");
    } else if (monthOrYear === "year") {
      format = "YYYY";
      monthStart = 1;
      monthEnd = 12;
      monthOrYearViewformat = "YYYY";
    } else {
      throw new Error("Неправильный вызов функции  monthOrYearView");
    }
    // Создаем массив объектов дней
    const daysAllMonth = days.map((day) => new Date(day.date));
    //  Сортируем по порядку дни
    const sortDateArr = daysAllMonth.sort((a, b) => a - b);
    // Преобразуем в формат YYYY-DD
    const daysAllMonthYYYY = sortDateArr.map((day) =>
      moment(day).format(format)
    );
    // Удаляем дубликаты
    const daysAllMonthYYYYDyble = [...new Set(daysAllMonthYYYY)];
    // Узнаем TimeZone
    // Вот здесь интересно, если ли зависимость от TimeZone сервера, если объект даты передан с браузера !
    const getTimezoneOffset = 0 - newDate.getTimezoneOffset() / 60; // узнаем часы
    // первый день месяца и учитываем TimeZone
    const firstDayMonthTimezone = new Date(
      year,
      monthStart,
      1,
      getTimezoneOffset
    );
    moment.locale("ru");
    // const monthView = moment(new Date(date)).format("LL");//1 ноября 2020 г.
    const monthView = moment(new Date(date)).format(monthOrYearViewformat);
    //   console.log("getLastDayOfMonth(2020, 9)=", getLastDayOfMonth(2020, 9) ); // 31
    //  С учетом TimeZone

    // определяем последний день месяца
    const getLastDayOfMonth = (year, month) =>
      new Date(year, month + 1, 0).getDate();

    const lastDayMonth = new Date(
      year,
      monthEnd,
      getLastDayOfMonth(year, monthEnd),
      getTimezoneOffset
    );
    // массив имеющихся дней текущего месяца
    const daysMonth = days.filter(
      (el) =>
        new Date(el.date) <= lastDayMonth &&
        new Date(el.date) >= firstDayMonthTimezone
    );
    // Сумма дохода
    let MonthIncome = 0;
    daysMonth.forEach((day) => {
      MonthIncome += day.costs.reduce((accumDay, itemDay) => {
        if (itemDay > 0) accumDay += itemDay;
        if (accumDay === undefined) accumDay = 0;
        return accumDay;
      }, 0);
    });
    // Сумма расхода
    let MonthExpense = 0;
    daysMonth.forEach((day) => {
      MonthExpense += day.costs.reduce((accumDay, itemDay) => {
        if (itemDay < 0) accumDay += itemDay;
        if (accumDay === undefined) accumDay = 0;
        return accumDay;
      }, 0);
    });
    // создаем массив уникальных категорий, цвета категорий и суммы по каждой уникальной категории
    const arrName = [];
    const arrCosts = [];
    const colorMonth = [];
    daysMonth.forEach((day) => {
      day.NameCategories.forEach((name, index) => {
        if (!arrName.includes(name)) {
          arrName.push(name);
          colorMonth.push(day.colorCategories[index]);
          arrCosts.push(day.costs[index]);
        } else {
          const indexName = arrName.indexOf(name);
          arrCosts[indexName] += day.costs[index];
        }
      });
    });
    //  добавим %
    const arrPercent = [];
    arrCosts.forEach((elem, index) => {
      let retuenPercent =
        // eslint-disable-next-line no-nested-ternary
        elem == 0
          ? 0
          : elem < 0
            ? (-elem / MonthExpense) * 100
            : (elem / MonthIncome) * 100;
      retuenPercent = retuenPercent.toFixed(2); // округляем до 2х знаков после запятой
      arrPercent[index] = retuenPercent;
    });
    // изменение цвета категорий в соотвествии с default = req.user.calc.costs.categories.name
    // const defaultName = user.calc.costs.categories.name;
    // const defaultColor = user.calc.costs.categories.color;
    const arrColor = arrName.map((item, index) => {
      const result = defaultName.findIndex((name) => name === item);
      // проверка совпадения цвета
      if (result >= 0) {
        return defaultColor[result];
      } // переписываем цвет в категориях днях как в default
      return colorMonth[index];
    });
    // Если нет дней в месяце
    if (!daysMonth.length) {
      // console.log('Дней еще нет в этом месяце');
      // res.redirect('/incoming');
      return null;
    }
    return {
      arrName,
      arrColor,
      arrCosts,
      allCost: MonthIncome + MonthExpense,
      monthView,
      daysAllMonthYYYYDyble,
      arrPercent,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("e=", e);
  }
};
