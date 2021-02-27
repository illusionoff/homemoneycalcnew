module.exports = {
  NODE_TLS_REJECT_UNAUTHORIZED: "0",
  MONGODB_URI: "",
  SESSION_SECRET: "",
  SESSION_MAXAGE: 24 * 60 * 60 * 1000, // Время жизни сесии 24 * 60 * 60 * 1000 = 1 сутки',
  // BASE_URL: "http://localhost:8080",
  PORT: 8080, // 8080,
  BASE_URL: "", // "http://localhost:8080" http://localhost:5000
  EMAIL_FROM: "",
  GMAIL_SETTINGS: {
    service: "",
    // service: "gmail",
    auth: {
      // type: 'OAuth2',
      user: "",
      pass: "",
    },
  },
  FACEBOOK_AUTH: {
    clientID: "", // your App ID
    clientSecret: "", // your App Secret
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    // callbackURL: "https://funprograms.ru/auth/facebook/callback",
  },
  GOOGLE_AUTH: {
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:8080/auth/google/callback",
  },
  // TWITTER_AUTH : {
  // 	'consumerKey' 		: 'your-consumer-key-here',
  // 	'consumerSecret' 	: 'your-client-secret-here',
  // 	'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
  // },
};
