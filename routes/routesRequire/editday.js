module.exports = (app, defaultView, isLoggedIn) => {
  const { validationResult } = require("express-validator");
  const {
    editdayValidators,
    editdayNewValidators,
  } = require("../../utils/validators");

  function defaultIndex(arrayDefault, arrayCurrent) {
    const arrayResult = [];
    arrayCurrent.forEach((elem1, index1) => {
      arrayDefault.forEach((elem2, index2) => {
        if (elem1 === elem2) arrayResult[index1] = index2;
      });
    });
    return arrayResult;
  }

  app.get("/editday/:id", isLoggedIn, (req, res) => {
    try {
      const { id } = req.params;
      const { days } = req.user.calc.costs;
      // Находим индекс этого конкретного дня
      const dayIndex = days.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (value) => value._id.toString() === id.toString()
      );
      if (dayIndex >= 0) {
        const day = days[dayIndex];

        // // для вывода информации по одному дню
        // function defaultView(defaultName, defaultColor) {
        //   // console.log(`item[${i}].NameCategories=`, item.NameCategories);  // выбираем внутри дня категорию
        //   day.NameCategories.forEach(function(сateg, i2) { // выбираем категорию
        //   let result = defaultName.findIndex(value => value === сateg); //
        //   if (result >= 0 ) {
        //       // проверка совпадения цвета
        //     return req.user.calc.costs.days[dayIndex].colorCategories[i2] = defaultColor[result]; // переписываем цвет в категориях днях как в default
        //     }
        //   });
        // }

        const categoriesname = req.user.calc.costs.categories.name;
        const categoriescolor = req.user.calc.costs.categories.color;

        defaultView(categoriesname, categoriescolor, day, dayIndex, days);
        // находим категории расходов, которых еще нет в спике дня
        // let difference = arrA.filter(x => !arrB.includes(x)).concat(arrB.filter(x => !arrA.includes(x)));
        const arrA = categoriesname;
        const arrB = day.NameCategories.slice();
        // удалить из arrB массива те элементы которых нет в categoriesname это пересечение масивов
        const intersection = arrA.filter((x) => arrB.includes(x));
        // можно использовать так, как не предпологается дублирование значений это симметричная разность массивов
        // let selectName = arrA.filter(x => !arrB.includes(x)).concat(arrB.filter(x => !arrA.includes(x)));
        const selectName = arrA
          .filter((x) => !intersection.includes(x))
          .concat(intersection.filter((x) => !arrA.includes(x)));
        // создаем функцию для создания массива соответствия индексам из categoriesname в select массиве

        const selectSave = defaultIndex(categoriesname, selectName);
        // создаем результирующий массив цвет категории
        const selectColor = [];
        selectSave.forEach(
          (elem, index) => (selectColor[index] = categoriescolor[elem])
        );

        res.render("editday", {
          day: day.toObject(),
          categoriesname,
          categoriescolor,
          selectName,
          selectColor,
          // message: req.flash('editdayMessageMaxCost'),
          errors: req.flash("editdayErrMessage"),
        });
        return;
      }
      // eslint-disable-next-line no-console
      console.log("res.redirect('/error') не нашли id дня");
      res.redirect("/error");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  app.post("/editday", isLoggedIn, editdayValidators, async (req, res) => {
    try {
      const { idday } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // eslint-disable-next-line no-console
        console.log(
          "editdayErrMessage.validationResult=",
          errors.array()[0].msg
        );
        req.flash("editdayErrMessage", errors.array()[0].msg);
        return res.status(422).redirect(`/editday/${idday}`);
      }
      const { idcategor } = req.body;
      const { cost } = req.body;
      const { coment } = req.body;
      const { days } = req.user.calc.costs;
      // Находим индекс этого конкретного дня по _id
      const dayIndex = days.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (value) => value._id.toString() === idday.toString()
      );

      if (dayIndex >= 0 && idcategor >= 0) {
        const { user } = req;
        const day = days[dayIndex];
        // Рассчет allCost
        const costs = day.costs.slice();
        costs.splice(idcategor, 1); // удаляем редактрируемый элемент из массива
        let allCost = costs.reduce((sum, current) => sum + current, 0);

        allCost += Number(cost); // Добавляем стоимость изменяемой категории
        await user.updateOne(
          {
            $set: {
              [`calc.costs.days.${dayIndex}.costs.${idcategor}`]: +cost,
              [`calc.costs.days.${dayIndex}.allCost`]: allCost,
              [`calc.costs.days.${dayIndex}.coments.${idcategor}`]: coment,
            },
          },
          (err) => {
            // eslint-disable-next-line no-console
            if (err) return console.log(err);
            res.redirect(`/editday/${idday}`);
          }
        );
        return;
      }
      // eslint-disable-next-line no-console
      console.log("res.redirect('/error')");
      res.redirect("/error");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });

  app.post(
    "/editday/newcategor",
    isLoggedIn,
    editdayNewValidators,
    async (req, res) => {
      try {
        const idday = req.body.newidday;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // console.log('settingsCategoriesMoveMessage.validationResult=', errors.array()[0].msg);
          req.flash("editdayErrMessage", errors.array()[0].msg);
          return res.status(422).redirect(`/editday/${idday}`);
        }
        const nameCaterories = req.body.selected;
        const cost = req.body.newcost;
        const coment = req.body.newcoment;

        // console.log("id=", id);
        const { days } = req.user.calc.costs;
        // Находим индекс этого конкретного дня по _id
        const dayIndex = days.findIndex(
          // eslint-disable-next-line no-underscore-dangle
          (value) => value._id.toString() === idday.toString()
        );
        // находим индекс категории в глобальном default массиве
        const idcategor = req.user.calc.costs.categories.name.findIndex(
          (value) => value === nameCaterories
        );

        if (dayIndex >= 0 && idcategor >= 0) {
          const day = days[dayIndex];
          day.NameCategories.push(
            req.user.calc.costs.categories.name[idcategor]
          );
          day.colorCategories.push(
            req.user.calc.costs.categories.color[idcategor]
          );
          day.costs.push(+cost);
          // Рассчет allCost
          const { costs } = day;
          const allCost = costs.reduce((sum, current) => sum + current, 0);
          // allCost += Number(cost);// Добавляем стоимость добавляемой категории
          day.allCost = allCost;
          day.coments.push(coment);
          const { user } = req;
          await user.save((err) => {
            if (err) {
              // eslint-disable-next-line no-console
              return console.log("err /editday/newcategor");
            }
            res.redirect(`/editday/${idday}`);
          });
          return;
        }
        // eslint-disable-next-line no-console
        console.log("err dayIndex или idcategor < 0");
        // throw new Error('err dayIndex < 0 ')
        res.redirect("/error");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  );

  app.get("/editday/del/:idcategor/:idday", isLoggedIn, async (req, res) => {
    try {
      const idcategor = +req.params.idcategor;
      const { idday } = req.params;
      const { days } = req.user.calc.costs;
      // Находим индекс этого конкретного дня по _id
      const dayIndex = days.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        (value) => value._id.toString() === idday.toString()
      );
      if (dayIndex >= 0 && idcategor >= 0) {
        const day = days[dayIndex];
        day.NameCategories.splice(idcategor, 1);
        day.colorCategories.splice(idcategor, 1);
        day.costs.splice(idcategor, 1);
        day.coments.splice(idcategor, 1);
        // Рассчет allCost
        const allCost = day.costs.reduce((sum, current) => sum + current, 0);
        day.allCost = allCost;
        const { user } = req;
        await user.save((err) => {
          // eslint-disable-next-line no-console
          if (err) return console.log("err");
          res.redirect(`/editday/${idday}`);
        });
        return;
      }
      // eslint-disable-next-line no-console
      console.log("err dayIndex < 0");
      // throw new Error('err dayIndex < 0 ')
      res.redirect("/error");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
};
