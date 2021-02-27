module.exports = (app, isLoggedInHome) => {
  app.get("/about", isLoggedInHome, (req, res) => {
    res.render("about", {
      // user : req.user.toObject(),
      isAbout: true,
    });
  });
};
