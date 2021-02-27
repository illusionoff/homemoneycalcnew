const keys = require("../keys");

module.exports = (email) => {
  return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: "Аккаунт создан",
    text:
      "Благодарим Вас за использование нашего програмного продукта HomeMoneyCalc. Надеемся он принесет Вам пользу.",
    html: `
    <h1>Добро пожаловать на проект HomeMoneyCalc</h1>
    <p>Вы успешно создали аккаунт  с email: ${email}</p>
    <hr />
    <a href="${keys.BASE_URL}">Главная страница HomeMoneyCalc</a>
    `,
  };
};
