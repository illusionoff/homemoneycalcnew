const keys = require("../keys");

module.exports = (email, token) => {
  return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: "Восстановление доступа",
    text:
      "Благодарим Вас за использование нашего програмного продукта HomeMoneyCalc. Надеемся он принесет Вам пользу.",
    html: `
        <h1>Добро пожаловать на проект HomeMoneyCalc</h1>
        <h2>Вы забыли пароль?</h2>
        <p>Если нет, то проигнорируйте данное письмо </p>
        <p>Иначе проследуйте по ссылке ниже</p>
        <p><a href="${keys.BASE_URL}/reset/password/${token}">Восстановление доступа</a></p>
        <hr />
        <a href="${keys.BASE_URL}">Главная страница HomeMoneyCalc</a>
        `,
  };
};
