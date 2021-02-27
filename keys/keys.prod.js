module.exports = {
  // // GOOGLE_AUTH:  process.env.PORT,
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  PORT: 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_MAXAGE: Number(process.env.SESSION_MAXAGE), // 24 * 60 * 60 * 1000
  BASE_URL: process.env.BASE_URL,
  EMAIL_FROM: process.env.EMAIL_FROM,
  // // TWITTER_AUTH: process.env.TWITTER_AUTH,
  MY_TEST_ENV: process.env.MY_TEST_ENV,
  GMAIL_SETTINGS: {
    service: process.env.GMAIL_SETTINGS_SERVICE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_SETTINGS_USER,
      pass: process.env.GMAIL_SETTINGS_PASS,
    },
  },
  FACEBOOK_AUTH: {
    clientID: process.env.FACEBOOK_AUTH_CLIENT_ID, // your App ID
    clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET, // your App Secret
    callbackURL: process.env.FACEBOOK_AUTH_CALLBACK_URL,
  },
  GOOGLE_AUTH: {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  },
  // TWITTER_AUTH : {
  // 	'consumerKey' 		: 'your-consumer-key-here',
  // 	'consumerSecret' 	: 'your-client-secret-here',
  // 	'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
  // },
};
