// load the things we need
const mongoose = require("mongoose");

// define the schema for our user model
const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    resetToken: String,
    resetTokenExp: Date,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  calc: {
    gender: String,
    date: { type: Date, default: Date.now },
    costs: {
      categories: {
        name: [
          {
            type: String,
            minlength: [1, "Вы не ввели имя категории"],
            maxlength: [40, "Слишком длинное имя категории"],
            unique: true,
          },
        ],
        color: {
          type: [String],
          default: [
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
          ],
        },
        choiceColor: {
          type: [String],
          default: [
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
          ],
        },
      },
      days: [
        {
          date: Date,
          NameCategories: [
            {
              type: String,
              required: true,
            },
          ],
          colorCategories: [
            {
              type: String,
              required: true,
            },
          ],
          costs: [
            {
              type: Number,
              required: true,
            },
          ],
          allCost: {
            type: Number,
            required: true,
          },
          coments: [{ type: String, maxlength: [300, "Comment too long"] }],
        },
      ],
    },
  },
});

userSchema.pre("save", (next) => {
  //  this.__v === undefined значение при создании документа
  // eslint-disable-next-line no-underscore-dangle
  if (this.calc.costs.categories.name.length === 0 && this.__v === undefined) {
    const nameDefault = [
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
    nameDefault.forEach((item) => {
      this.calc.costs.categories.name.push(item);
    });
  }
  next();
});
module.exports = mongoose.model("User", userSchema);
