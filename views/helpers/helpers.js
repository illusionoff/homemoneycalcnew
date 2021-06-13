const Helpers = () => {
  const moment = require("moment-timezone");
  const helper = {
    dateView: (date) => {
      const newDate = moment(new Date(date)).locale("ru").format("LL");
      // const newDate = date.toLocaleDateString('ru', {
      //     year: 'numeric',
      //     month: 'long',
      //     day: 'numeric',
      //     timezone: 'UTC'
      // });
      return newDate;
    },
    dateViewBrowser: () => {
      const newDate = moment(new Date()).locale("ru").format("LL");
      return newDate;
    },
    dateNew: () => new Date(),
    arrlength: (array) => array.length - 1,
    isSelected: (value, selectedValue) => selectedValue === value,
    indexPlusOne: (index) => index + 1,
  };
  return helper;
};

module.exports = Helpers();
