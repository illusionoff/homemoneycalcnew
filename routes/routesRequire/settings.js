module.exports = (app, isLoggedIn) => {
  app.get("/settings", isLoggedIn, (req, res) => {
    try {
      res.render("settings/settings", {
        user: req.user.toObject(),
        isSettings: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
};
