// Проверяем функцию monthOrYearView  вывода информации по выбранному месяцу или году в виде массивов для отображения в талицу на frontend
const assert = require("assert").strict;
const fs = require("fs");
const { monthOrYearView } = require("../../../routes/functions.js");

const fileContentMonth = fs.readFileSync(
  "./mochaTesting/thisProject/monthOrYearView/days_.json",
  "utf8"
);
const fileContentYear = fs.readFileSync(
  "./mochaTesting/thisProject/monthOrYearView/days.json",
  "utf8"
);
const defaultName = [
  "Жилье",
  "Коммунальные услуги",
  "Продукты",
  "Проезд",
  "Интернет",
  "Сотовая связь",
  "Одежда",
  "Медикаменты",
  "Хозяйственные расходы",
  "Техника",
  "Развлечения и отдых",
  "День рождения",
  "Дивиденты",
  "Заработная плата",
  "Прочее",
];
const defaultColor = [
  "aqua",
  "teal",
  "blue",
  "navy",
  "lime",
  "green",
  "fuchsia",
  "purple",
  "red",
  "orange",
  "gray",
  "silver",
  "black",
  "hotpink",
  "lightgreen",
];
/* global describe, it */
describe("monthOrYearView for month test", function () {
  const days = JSON.parse(fileContentMonth);

  it("should view monthOrYearView date = 2020-10", function () {
    const date = "2020-10";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "month",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: ["Развлечения и отдых", "Одежда"],
      arrColor: ["gray", "fuchsia"],
      arrCosts: [4, 5],
      allCost: 9,
      monthView: "октябрь 2020",
      daysAllMonthYYYYDyble: ["2020-10", "2020-12"],
      arrPercent: ["44.44", "55.56"],
    });
  });
  it("should view monthOrYearView date = 2020-12", function () {
    const date = "2020-12";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "month",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: ["Жилье", "Коммунальные услуги", "Продукты", "Проезд"],
      arrColor: ["aqua", "teal", "blue", "navy"],
      arrCosts: [2, 4, 6, 8],
      allCost: 20,
      monthView: "декабрь 2020",
      daysAllMonthYYYYDyble: ["2020-10", "2020-12"],
      arrPercent: ["10.00", "20.00", "30.00", "40.00"],
    });
  });

  it("should view monthOrYearView date = Thu Dec 31 2020 09:38:58 GMT+0300 (Москва, стандартное время)", function () {
    const date =
      "Thu Dec 31 2020 09:38:58 GMT+0300 (Москва, стандартное время)";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "month",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: ["Жилье", "Коммунальные услуги", "Продукты", "Проезд"],
      arrColor: ["aqua", "teal", "blue", "navy"],
      arrCosts: [2, 4, 6, 8],
      allCost: 20,
      monthView: "декабрь 2020",
      daysAllMonthYYYYDyble: ["2020-10", "2020-12"],
      arrPercent: ["10.00", "20.00", "30.00", "40.00"],
    });
  });

  it("should view monthOrYearView date = Thu Oct 20 2020 09:38:58 GMT+0300 (Москва, стандартное время)", function () {
    const date =
      "Thu Oct 20 2020 09:38:58 GMT+0300 (Москва, стандартное время)";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "month",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: ["Развлечения и отдых", "Одежда"],
      arrColor: ["gray", "fuchsia"],
      arrCosts: [4, 5],
      allCost: 9,
      monthView: "октябрь 2020",
      daysAllMonthYYYYDyble: ["2020-10", "2020-12"],
      arrPercent: ["44.44", "55.56"],
    });
  });
});

describe("monthOrYearView for year test", function () {
  const days = JSON.parse(fileContentYear);
  it("should view monthOrYearView date = 2020", function () {
    const date = "2020";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "year",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: [
        "Жилье",
        "Коммунальные услуги",
        "Продукты",
        "Проезд",
        "Развлечения и отдых",
        "Одежда",
      ],
      arrColor: ["aqua", "teal", "blue", "navy", "gray", "fuchsia"],
      arrCosts: [2, 4, 6, 8, 4, 5],
      allCost: 29,
      monthView: "2020",
      daysAllMonthYYYYDyble: ["2020", "2021"],
      arrPercent: ["6.90", "13.79", "20.69", "27.59", "13.79", "17.24"],
    });
  });

  it("should view monthOrYearView date = 2021", function () {
    const date = "2021";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "year",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: ["Одежда", "Интернет", "Сотовая связь"],
      arrColor: ["fuchsia", "lime", "green"],
      arrCosts: [1400, 200, 150],
      allCost: 1750,
      monthView: "2021",
      daysAllMonthYYYYDyble: ["2020", "2021"],
      arrPercent: ["80.00", "11.43", "8.57"],
    });
  });

  it("should view monthOrYearView date = Thu Dec 31 2020 11:45:22 GMT+0300 (Москва, стандартное время)", function () {
    const date =
      "Thu Dec 31 2020 11:45:22 GMT+0300 (Москва, стандартное время)";
    const monthViewFunc = monthOrYearView(
      date,
      days,
      "year",
      defaultName,
      defaultColor
    );
    assert.deepStrictEqual(monthViewFunc, {
      arrName: [
        "Жилье",
        "Коммунальные услуги",
        "Продукты",
        "Проезд",
        "Развлечения и отдых",
        "Одежда",
      ],
      arrColor: ["aqua", "teal", "blue", "navy", "gray", "fuchsia"],
      arrCosts: [2, 4, 6, 8, 4, 5],
      allCost: 29,
      monthView: "2020",
      daysAllMonthYYYYDyble: ["2020", "2021"],
      arrPercent: ["6.90", "13.79", "20.69", "27.59", "13.79", "17.24"],
    });
  });
});
