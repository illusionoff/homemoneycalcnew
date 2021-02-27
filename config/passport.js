// load all the things we need
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const TwitterStrategy = require("passport-twitter").Strategy;
// var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// load up the user model
const User = require("../app/models/user");
// load the auth varikeysables
const keys = require("../keys");
const regEmail = require("../emails/registration");
// !!!! далее отключена для тестов проверка сертификации
process.env.NODE_TLS_REJECT_UNAUTHORIZED = keys.NODE_TLS_REJECT_UNAUTHORIZED;
// eslint-disable-next-line no-console
console.log(
  "process.env.NODE_TLS_REJECT_UNAUTHORIZED=",
  process.env.NODE_TLS_REJECT_UNAUTHORIZED
);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // это отключение проверки SSL вроде без этого не работает с nodemailer test s

const transporter = nodemailer.createTransport(keys.GMAIL_SETTINGS);

async function RegisterSendMail(transporter, email, req, user, done) {
  try {
    await transporter.sendMail(regEmail(email));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("await transporter.sendMail  catch (e):", e);
    //  отключаем local-login вход
    user.local.email = undefined;
    user.local.password = undefined;
    await user.save((err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log("err save 1", err);
      }
    });
    return done(
      null,
      false,
      req.flash(
        "signupErrMessage",
        "Email письмо не доставлено, попробуйте позже."
      )
    );
  }
}

//     transporter.verify(function(error, success) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Server is ready to take our messages gmail.com");
//         }

module.exports = (passport) => {
  // использование объекта заполнения БД раздела calc  в User
  // TestCalcObj = {
  //   calc: {
  //     gender: "male",
  //     costs: {
  //       days: {
  //         date: new Date(),
  //         NameCategories: "Коммунальны услуги",
  //         colorCategories: "green",
  //         costs: 68,
  //       },
  //     },
  //   },
  // };

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      async (req, email, password, done) => {
        try {
          await User.findOne({ "local.email": email }, async (err, user) => {
            // if there are any errors, return the error
            if (err) return done(err);
            // if no user is found, return the message
            if (!user)
              return done(
                null,
                false,
                req.flash("loginErrMessage", "Такого логина не существует.")
              );
            const areSame = await bcrypt.compare(password, user.local.password); //
            if (!areSame)
              return done(
                null,
                false,
                req.flash("loginErrMessage", "Неверный пароль!")
              );
            // all is well, return user
            return done(null, user);
          });
          // });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }
    )
  );

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      async (req, email, password, done) => {
        try {
          //  Whether we're signing up or connecting an account, we'll need
          //  to know if the email address is in use.
          await User.findOne(
            { "local.email": email },
            async (err, existingUser) => {
              // if there are any errors, return the error
              if (err) return done(err);

              if (existingUser)
                return done(
                  null,
                  false,
                  req.flash("signupErrMessage", "Такой email уже существует.")
                );

              //  If we're logged in, we're connecting a new local account.
              if (req.user) {
                const { user } = req;
                user.local.email = email;
                const salt = await bcrypt.genSalt(8);
                user.local.password = await bcrypt.hash(password, salt, null);
                // user.local.password = user.generateHash(password);
                await user.save(async (err) => {
                  if (err) throw err;

                  await RegisterSendMail(transporter, email, req, user, done);

                  return done(null, user);
                });
              }
              //  We're not logged in, so we're creating a brand new user.
              else {
                // create the user
                const user = new User();
                user.local.email = email;
                // newUser.local.password = newUser.generateHash(password);
                const salt = await bcrypt.genSalt(8);
                user.local.password = await bcrypt.hash(password, salt, null);
                // Object.assign(newUser, TestCalcObj); // Заполнение данных calc
                await user.save(async (err) => {
                  if (err) throw err;

                  await RegisterSendMail(transporter, email, req, user, done);

                  return done(null, user);
                });
              }
            }
          );
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("local-signup catch (e) ", e);
        }
      }
    )
  );

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.FACEBOOK_AUTH.clientID,
        clientSecret: keys.FACEBOOK_AUTH.clientSecret,
        callbackURL: keys.FACEBOOK_AUTH.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      async (req, token, refreshToken, profile, done) => {
        try {
          // console.info(`profile = ${JSON.parse(profile)}`);

          // const l = (...params) =>
          //   console.log(
          //     ...params.map((param) => JSON.stringify(param, null, 10))
          //   ); // 1. Вывод объекта
          // l(profile); // 2. Вывод объекта

          // check if the user is already logged in
          if (!req.user) {
            await User.findOne(
              { "facebook.id": profile.id },
              async (err, user) => {
                if (err) return done(err);

                if (user) {
                  // if there is a user id already but no token (user was linked at one point and then removed)
                  if (!user.facebook.token) {
                    user.facebook.token = token;
                    // user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.name = profile.displayName;
                    // user.facebook.email = profile.emails[0].value;
                    user.facebook.email = profile.email;

                    await user.save((err) => {
                      if (err) throw err;
                      return done(null, user);
                    });
                  }
                  return done(null, user); // user found, return that user
                }
                // if there is no user, create them
                const newUser = new User();

                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                // newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.name = profile.displayName;
                newUser.facebook.email = profile.email;
                // newUser.facebook.email = profile.emails[0].value;

                await newUser.save((err) => {
                  if (err) throw err;
                  return done(null, newUser);
                });
              }
            );
          } else {
            // user already exists and is logged in, we have to link accounts
            const { user } = req; // pull the user out of the session

            user.facebook.id = profile.id;
            user.facebook.token = token;
            // user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.name = profile.displayName;
            // user.facebook.email = profile.emails[0].value;
            user.facebook.email = profile.email;

            await user.save((err) => {
              if (err) throw err;
              return done(null, user);
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }

        // });
      }
    )
  );

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  // passport.use(new TwitterStrategy({

  //     consumerKey     : keys.TWITTER_AUTH.consumerKey,
  //     consumerSecret  : keys.TWITTER_AUTH.consumerSecret,
  //     callbackURL     : keys.TWITTER_AUTH.callbackURL,
  //     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  // },
  // function(req, token, tokenSecret, profile, done) {

  //     // asynchronous
  //     process.nextTick(function() {

  //         // check if the user is already logged in
  //         if (!req.user) {

  //             User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
  //                 if (err)
  //                     return done(err);

  //                 if (user) {
  //                     // if there is a user id already but no token (user was linked at one point and then removed)
  //                     if (!user.twitter.token) {
  //                         user.twitter.token       = token;
  //                         user.twitter.username    = profile.username;
  //                         user.twitter.displayName = profile.displayName;

  //                         user.save(function(err) {
  //                             if (err)
  //                                 throw err;
  //                             return done(null, user);
  //                         });
  //                     }

  //                     return done(null, user); // user found, return that user
  //                 } else {
  //                     // if there is no user, create them
  //                     var newUser                 = new User();

  //                     newUser.twitter.id          = profile.id;
  //                     newUser.twitter.token       = token;
  //                     newUser.twitter.username    = profile.username;
  //                     newUser.twitter.displayName = profile.displayName;

  //                     // Object.assign(newUser, TestCalcObj); // Заполнение данных calc

  //                     newUser.save(function(err) {
  //                         if (err)
  //                             throw err;
  //                         return done(null, newUser);
  //                     });
  //                 }
  //             });

  //         } else {
  //             // user already exists and is logged in, we have to link accounts
  //             var user                 = req.user; // pull the user out of the session

  //             user.twitter.id          = profile.id;
  //             user.twitter.token       = token;
  //             user.twitter.username    = profile.username;
  //             user.twitter.displayName = profile.displayName;

  //             user.save(function(err) {
  //                 if (err)
  //                     throw err;
  //                 return done(null, user);
  //             });
  //         }

  //     });

  // }));

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.GOOGLE_AUTH.clientID,
        clientSecret: keys.GOOGLE_AUTH.clientSecret,
        callbackURL: keys.GOOGLE_AUTH.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      async (req, token, refreshToken, profile, done) => {
        try {
          // check if the user is already logged in
          if (!req.user) {
            await User.findOne(
              { "google.id": profile.id },
              async (err, user) => {
                if (err) {
                  // eslint-disable-next-line no-console
                  console.log(`error await User.findOne({ 'google.id'`);
                  return done(err);
                }

                if (user) {
                  // if there is a user id already but no token (user was linked at one point and then removed)
                  if (!user.google.token) {
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = profile.emails[0].value; // pull the first email
                    // console.log("user.google.email 1=", user.google.email);
                    // console.log(`profile.emails: ${profile.emails}`);
                    await user.save((err) => {
                      if (err) {
                        // eslint-disable-next-line no-console
                        console.log(`await user.save(function(err)`);
                        throw err;
                      }
                      return done(null, user);
                    });
                  }

                  return done(null, user);
                }
                const newUser = new User();

                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email

                await newUser.save((err) => {
                  if (err) {
                    // eslint-disable-next-line no-console
                    console.log(` await newUser.save(function(err)`);
                    throw err;
                  }
                  return done(null, newUser);
                });
              }
            );
          } else {
            // user already exists and is logged in, we have to link accounts
            const { user } = req; // pull the user out of the session

            user.google.id = profile.id;
            user.google.token = token;
            user.google.name = profile.displayName;
            user.google.email = profile.emails[0].value; // pull the first email
            await user.save((err) => {
              if (err) throw err;
              return done(null, user);
            });
          }

          // let testing = !user.google.email ? newUser.google.email: user.google.email;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }
    )
  );
};
