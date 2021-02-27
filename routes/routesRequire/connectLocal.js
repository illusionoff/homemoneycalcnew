module.exports = (app, passport, isLoggedIn) => {
  // // =============================================================================
  // // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // // =============================================================================

  // 	// locally --------------------------------
  app.get("/connect/local", isLoggedIn, (req, res) => {
    res.render("connectLocal", { errors: req.flash("signupErrMessage") });
  });
  app.post(
    "/connect/local",
    passport.authenticate("local-signup", {
      successRedirect: "/settings/profile", // redirect to the secure profile section
      failureRedirect: "/connect/local", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // 	// facebook -------------------------------

  // 		// send to facebook to do the authentication
  // 		// app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
  app.get(
    "/connect/facebook",
    isLoggedIn,
    passport.authorize("facebook", { scope: ["public_profile", "email"] })
  );

  // 		// handle the callback after facebook has authorized the user
  app.get(
    "/connect/facebook/callback",
    passport.authorize("facebook", {
      successRedirect: "/settings/profile",
      failureRedirect: "/",
    })
  );

  // 	// twitter --------------------------------

  // 		// send to twitter to do the authentication
  // 		app.get('/connect/twitter', isLoggedIn, passport.authorize('twitter', { scope : 'email' }));

  // 		// handle the callback after twitter has authorized the user
  // 		app.get('/connect/twitter/callback',
  // 			passport.authorize('twitter', {
  // 				successRedirect : '/profile',
  // 				failureRedirect : '/'
  // 			}));

  // 	// google ---------------------------------

  // 		// send to google to do the authentication
  app.get(
    "/connect/google",
    isLoggedIn,
    passport.authorize("google", { scope: ["profile", "email"] })
  );

  // 		// the callback after google has authorized the user
  app.get(
    "/connect/google/callback",
    passport.authorize("google", {
      successRedirect: "", // эта ссылка почемуто не на что не влияет
      failureRedirect: "/",
    })
  );

  // // =============================================================================
  // // UNLINK ACCOUNTS =============================================================
  // // =============================================================================
  // // used to unlink accounts. for social accounts, just remove the token
  // // for local account, remove email and password
  // // user account will stay active in case they want to reconnect in the future
};
