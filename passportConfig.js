const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// User serialization and deserialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Retrieve user from the database using the id
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Google Strategy 1st Try
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
// }, (token, tokenSecret, profile, done) => {
//     console.log("Google profile:", profile); // Log please help me!
//     console.log("Tried google strat");
//     // Find or create user in your database
//     User.findOrCreate({ googleId: profile.id }, (err, user) => {
//         return done(err, user);
//     });
// }));

// //Google Strategy 2nd Try 
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
// },  async (token, tokenSecret, profile, done) => {
//     try {
//         console.log("Google profile:", profile); // Detailed log
//     } catch (err) {
//         console.error("Error during Google authentication:", err);
//         return done(err, null);
//     }
// }));

// Google strat 3rd try
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log("Using Google Passport Strategy");
    console.log("Google profile:", profile);

    // Here, you can process the profile data as needed
    // For example, you can check if the email is verified and proceed accordingly

    // If you need to store some data, you can save it in session or return it
    const userData = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        emailVerified: profile.emails[0].verified
    };

    // Pass the user data to the callback
    return done(null, userData);
}));

// // Facebook Strategy BAD !! 
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback"
// }, (accessToken, refreshToken, profile, done) => {
//     console.log("FB profile:", profile); // Log please help me!
//     console.log("Tried FB strat");
//     // Find or create user in your database
//     User.findOrCreate({ facebookId: profile.id }, (err, user) => {
//         return done(err, user);
//     });
// }));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)'] // Specify the fields you want to retrieve
}, (accessToken, refreshToken, profile, done) => {
    console.log("Using Facebook Passport Strategy");
    console.log("Facebook profile:", profile);

    // Here, you can process the profile data as needed
    // For example, you can check if the email is verified and proceed accordingly

    // If you need to store some data, you can save it in session or return it
    const userData = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        picture: profile.photos ? profile.photos[0].value : null,
    };

    // Pass the user data to the callback
    return done(null, userData);
}));

module.exports = passport;