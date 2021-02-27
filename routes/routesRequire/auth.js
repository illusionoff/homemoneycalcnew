module.exports = (app, passport) => {
  // // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  // facebook -------------------------------

  // 		// send to facebook to do the authentication

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );
  // 		// handle the callback after facebook has authenticated the user
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/incoming",
      failureRedirect: "/",
    })
  );

  // 	// twitter --------------------------------

  // 		// send to twitter to do the authentication
  // 		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

  // 		// handle the callback after twitter has authenticated the user
  // 		app.get('/auth/twitter/callback',
  // 			passport.authenticate('twitter', {
  // 				successRedirect : '/profile',
  // 				failureRedirect : '/'
  // 			}));

  // 	// google ---------------------------------

  // 		// send to google to do the authentication
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // 		// the callback after google has authenticated the user
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/incoming",
      failureRedirect: "/",
    })
  );
};
