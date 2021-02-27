module.exports = (app, isLoggedIn) => {
  app.get("/settings/profile", isLoggedIn, (req, res) => {
    // user.stringify = JSON.stringify(req.user);
    res.render("settings/profile", {
      user: req.user.toObject(),
      isProfile: true,
    });
  });
};
