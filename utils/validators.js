const { body } = require("express-validator");
require("moment-timezone");
const _ = require("underscore");
// const User = require("../app/models/user");

module.exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .isLength({ min: 5, max: 32 })
    .withMessage("Слишком длинный Email больше 32 знаков!")
    .normalizeEmail(),
  // .custom((value) => {
  //   return User.findOne({ "local.email": value }).then((user) => {
  //     if (user) {
  //       return Promise.reject("Такой email уже существует");
  //     }
  //   });
  // }),
  body("password", "Пароль должен быть минимум 6 символов и не более 32")
    .isLength({ min: 6, max: 32 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли не совпадают!");
      }
      return true;
    })
    .trim(),
];

module.exports.loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .isLength({ min: 5, max: 32 })
    .withMessage("Слишком длинный Email больше 32 знаков!")
    .normalizeEmail(),

  body("password", "Пароль должен быть минимум 6 символов и не более 32")
    .isLength({ min: 6, max: 32 })
    .isAlphanumeric()
    .trim(),
];

module.exports.settingsDelValidators = [
  body("idcategor")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Введите корректный номер категории"),
];

// movecategories

module.exports.settingsMoveValidators = [
  body("current")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный номер текущей категории"),
  body("inputMove")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный номер места вставки категории"),
];

// newсategories

module.exports.settingsNewValidators = [
  body("selected")
    .escape()
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Слишком длинное имя цвета больше 32! Или слишком короткое, меньше 3 символов "
    ),
  body("nameCategories")
    .trim()
    .escape()
    .isLength({ min: 1, max: 128 })
    .withMessage("Слишком длинное имя категории, больше 128! Или пустой")
    .custom((value, { req }) => {
      // Узнаем есть ли уже такое название категории
      const categoriesName = req.user.calc.costs.categories.name;
      const includeCategories = categoriesName.includes(value);
      if (includeCategories) {
        throw new Error("Такое имя уже существует.");
      }
      return true;
    }),
];

// settings/categories/colorCategories

module.exports.settingsСolorValidators = [
  body("idCategories")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Пустое значение idCategories")
    .toInt()
    .isNumeric()
    .withMessage("Неправильный номер категории цвета"),
  body("colorCategories")
    .trim()
    .escape()
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Слишком длинное имя цвета больше 32! Или слишком короткое, короче 3 знаков"
    )
    .custom((value, { req }) => {
      // Узнаем есть ли такое имя цвета в разрешенных вариантах choiceColor
      const categoriesColor = req.user.calc.costs.categories.choiceColor;
      const includeCategories = categoriesColor.includes(value);
      if (!includeCategories) {
        throw new Error("Ошибка имени цвета.");
      }
      return true;
    }),
];

module.exports.editdayValidators = [
  body("idcategor")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный номер idcategor")
    .isLength({ min: 1, max: 2 })
    .withMessage(
      "Слишком длинный идентификатор категории, больше 2! Или пустое"
    ),
  body("idday")
    .trim()
    .escape()
    .isLength({ min: 16, max: 32 })
    .withMessage(
      "Слишком длинный idday, больше 32! Или слишком короткbq, короче 16 знаков"
    ),
  body("cost")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный формат стоимости")
    .isLength({ min: 1, max: 16 })
    .withMessage(
      "Слишком длинное значение цены , больше 16 знаков! Или пустое"
    ),
  body("coment")
    .trim()
    .escape()
    .isLength({ min: 0, max: 300 })
    .withMessage("Слишком длинный комментарий больше 300!"),
];

// editday/newcategor

module.exports.editdayNewValidators = [
  body("selected")
    .trim()
    .escape()
    .isLength({ min: 1, max: 128 })
    .withMessage("Слишком длинное имя категории, больше 128! Или пустой"),
  body("newidday")
    .trim()
    .escape()
    .isLength({ min: 16, max: 32 })
    .withMessage(
      "Слишком длинный idday, больше 32! Или слишком короткий, короче 16 знаков"
    ),
  body("newcost")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный формат стоимости")
    .isLength({ min: 1, max: 16 })
    .withMessage("Слишком длинное значение цены ,больше 16 знаков! Или пустое"),
  body("newcoment")
    .trim()
    .escape()
    .isLength({ min: 0, max: 300 })
    .withMessage("Слишком длинный комментарий больше 300!"),
];

// /dayscreate/createday

module.exports.dayscreateValidators = [
  body("selected")
    .trim()
    .toInt()
    .isNumeric()
    .withMessage("Неправильный id номер категории")
    .isLength({ min: 1, max: 2 })
    .withMessage(
      "Слишком длинное значение id номер категории ,больше 2 знаков! Или пустое"
    ),
  body("date")
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("Слишком длинное значение date ,больше 100 знаков! Или пустое")
    .custom((value) => {
      // Определяем получили мы Date или что-то иное
      // let dateParse ="Thu Nov 12 2020 13:03:01 GMT+0300 (Москва, стандартное время)"; //true
      // let dateParse =  "Sun Nov 08 2020 00:00:00 GMT+0300 (Москва, стандартное время)";
      // let dateParse = "Nov 12 2020 13:03:01 GMTgfgfd+fgdg0300 (Москва, стандартное время)"; //false
      // let dateParseNew =  NaN;//false
      const date = new Date(value);
      // const isValidDate = _.isDate(date) && !isNaN(date.getTime());
      const isValidDate = _.isDate(date) && !Number.isNaN(date.getTime());
      if (!isValidDate) {
        throw new Error("Ошибка представления даты.");
      }
      return true;
    }),
];
