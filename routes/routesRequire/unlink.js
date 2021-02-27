module.exports = (app) => {
  // 	// local -----------------------------------
  app.get("/unlink/local", async (req, res) => {
    const { user } = req;
    user.local.email = undefined;
    user.local.password = undefined;
    await user.save((err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log("err");
      }
      res.redirect("/settings/profile");
    });
  });

  // 	// facebook -------------------------------
  app.get("/unlink/facebook", async (req, res) => {
    const { user } = req;
    user.facebook.token = undefined;
    await user.save((err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log("err");
      }
      res.redirect("/settings/profile");
    });
  });

  // 	// twitter --------------------------------
  // 	app.get('/unlink/twitter', async function(req, res) {
  // 		let user           = req.user;
  // 		user.twitter.token = undefined;
  // 		await user.save(function(err) {
  // 			res.redirect('/profile');
  // 		});
  // 	});

  // 	// google ---------------------------------
  app.get("/unlink/google", async (req, res) => {
    const { user } = req;
    user.google.token = undefined;
    await user.save((err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log("err");
      }
      res.redirect("/settings/profile");
    });
  });
};
