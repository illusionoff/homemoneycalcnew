<a id="anchor"></a>
#####README.markdown

HomeMoneyCalc
=============
Ваш помощник по учету расходов и доходов
--------

####Сервис HomeMoneyCalc позволяет сохрянять, систематизировать Ваши семейные расходы и доходы

Вы всегда будете в курсе своих финансов

Информация представлена в виде диаграмм и таблиц

Основные функции:
----

* Авторизация через Google, Facebook, по логину
* Отправка письма на Email о регистрации
* Восстановление забытого пароля через Email
* Создание пользовательских категорий расходов и доходов, задание цвета категорий
* Вывод статистики по расходам / доходам за день, месяц, год
* Возможность редактирования уже имеющихся данных
* Выбор способа отображения информации (диаграмма, таблица, диаграмма и таблица)
* Изменение порядка следования категорий



 В ходе разрабоки проекта были задействованы следующие технологии, модули:
 ----

Название | описание
:----|:---------
Node.js| среда выполнения
npm | менеджер пакетов
Express| библиотека
handlebars|	шаблонизатор для страниц Html
bcrypt|	хеширования паролей
crypto|	хеширования строки для изменения забытого пароля
connect-flash|	для хранения и передачи сообщений
connect-mongodb-session|	для хранения сеансов в MongoDB
csurf|	для защиты сеансов сессии от подделки- взлома
express-validator|	валидация форм
winston|	логирование
helmet|	защита приложений express через различные заголовки HTTP
moment-timezone|	поддержка часовых поясов IANA для Moment.js
mongoose|	ODM ждя MongoDB
nodemailer|	отправка почты
passport|	авторизации, решистрации через соцсети и т.д.
underscore|	библиотека функций. Использую для проверки на корректную дату _.isDate(date)
eslint|	выявление ошибок в коде
prettier|	форматирование кода и автоформатирование при сохранении
mocha|	автотесты
nodemon|	автоматического перезапуска проекта при изменении файлов проекта в dev
v1.0.0_materialize.min.js|Frontend библиотека
fontawesomecom | Иконки
https://cdn.jsdelivr.net/npm/chart.js@2.9.4 | диаграммы

Дополнительные модули:
----
express-handlebars
express-session
express-winston
passport-facebook
passport-google-oauth20
passport-local
eslint-config-airbnb-base
eslint-config-prettier
eslint-plugin-html
eslint-plugin-import
eslint-plugin-mocha
eslint-plugin-node
eslint-plugin-prettier

Автотесты:
----
* Проверяем функцию defaultView  изменение цвета категорий в соотвествии с ```default = req.user.calc.costs.categories.name```
[testDefaultView.js](https://github.com/illusionoff/homemoneycalc/blob/main/mochaTesting/thisProject/defaultView/testDefaultView.js)

* Проверяем функцию monthOrYearView  вывода информации по выбранному месяцу или году в виде массивов для отображения в талице на frontend
[testMonthOrYearView.js](https://github.com/illusionoff/homemoneycalc/blob/main/mochaTesting/thisProject/monthOrYearView/testMonthOrYearView.js)


[Вверх](#anchor)
