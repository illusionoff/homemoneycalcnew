// Проверяем функцию defaultView  изменение цвета категорий в соотвествии с default = req.user.calc.costs.categories.name
const assert = require("assert").strict;
const fs = require("fs");
const { defaultView } = require("../../../routes/functions.js");

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
const day0 = {
  NameCategories: [
    "Категория 1",
    "Коммунальные услуги",
    "Продукты",
    "Категория 2",
  ],
  colorCategories: ["green", "green", "green", "green"],
  costs: [1, 2, 3, 4],
  coments: ["hj", "", "", ""],
  _id: "5fec79a51dff313080f745ab",
  date: "2020-12-30T00:00:00.000Z",
  allCost: 10,
};

const day1 = {
  NameCategories: ["Жилье", "Категория 3", "Категория 4", "Проезд"],
  colorCategories: ["green", "teal", "blue", "green"],
  costs: [1, 2, 3, 4],
  coments: ["", "", "", ""],
  _id: "5fec79fe1dff313080f745ac",
  date: "2020-12-02T00:00:00.000Z",
  allCost: 10,
};

const fileContent = fs.readFileSync(
  "./mochaTesting/thisProject/defaultView/days.json",
  "utf8"
);
const days = JSON.parse(fileContent);

/* global describe, it */
describe("defaultView test", function () {
  it("should view day0", function () {
    const dayIndex = 0;
    defaultView(defaultName, defaultColor, day0, dayIndex, days);
    assert.deepStrictEqual(days[0].colorCategories, [
      "green",
      "teal",
      "blue",
      "green",
    ]);
  });

  it("should view day1", function () {
    const dayIndex = 1;
    defaultView(defaultName, defaultColor, day1, dayIndex, days);
    assert.deepStrictEqual(days[1].colorCategories, [
      "aqua",
      "teal",
      "blue",
      "navy",
    ]);
  });
});
