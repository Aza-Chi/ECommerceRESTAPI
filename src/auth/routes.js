const express = require("express");
const { register, authenticateToken, login, logout} = require("./auth");
const passport = require("../../passportConfig");
const bodyParser = require("body-parser");
const pool = require("../../db"); 
const jwt = require("jsonwebtoken");
const router = express.Router();
const jsonParser = bodyParser.json();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", register);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *               - password
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */


router.post("/login", login); // Current!! 


// Login test 
// router.post(
//   "/login",
//   jsonParser,
//   passport.authenticate("local", { failureMessage: true }),
//   (req, res) => {

//     console.log("Creating token!");
//     const token = jwt.sign(
//       { username: req.user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     console.log("Token: " + { token });
//     req.user.token = token;
//     console.log(`auth/routes.js /login-req.user.token: ${req.user.token}`);
//     console.log(`${req.user.token}`);
//     //console.log(`auth/routes.js /login sessionId: ${req.sessionID}`);
//     //console.log(`auth/routes.js /login-req.user: ${req.user}`); // object Object
//     console.log(`auth/routes.js /login-req.user STRINGIFIED: ${JSON.stringify(req.user)}`); // object stringified
//     //console.log(`auth/routes.js /login-req.user: ${req.user.id}`);
//     //console.log(`auth/routes.js /login-req.user: ${req.user.email}`);
//     //console.log(`auth/routes.js /login-req.user: ${req.user.username}`);
// //    console.log(`auth/routes.js /login req.session: ${JSON.stringify(req.session)}`);
//     //console.log(`auth/routes.js /login req.session.passport.user: ${req.session.passport.user}`); // this gives a number at least 
//         // Set session data //Despite this, status still req.session is different.. interesting..
//         req.session.user = {

//       }; 
//       console.log("auth/routes.js /login printing req.session.user after set session data");
//       console.log(req.session.user); // empty 
//       //data has been set..  
//       req.session.user = { //saved in cookie, sess column under "user" but this data doesn't saved to the session it disappears!!! :/
//         id: req.user.id,
//         username: req.user.username,
//         email: req.user.email,
//         email_address: req.user.email,
//         logged_in: true,
//         auth_method: "local",
//         session_id: req.sessionID,
//         isAuthenticated: true,
//         token: {token},
        
//       }
//       console.log(`auth/routes.js /login - req.session.user: ${req.session.user}`); // after set gives an object
//       console.log(`auth/routes.js /login - req.session.user: ${JSON.stringify(req.session.user)}`); 
 
//     res.status(200).json({ // This doesn't set the data in client 
//       id: req.user.id,
//       username: req.user.username,
//       email: req.user.email,
//       email_address: req.user.email,
//       logged_in: true,
//       auth_method: "local",
//       session_id: req.sessionID,
//       isAuthenticated: true,
//       token: token,
//     });
//     console.log(`auth/routes.js /login - calling res.end()`); 
//     res.end(); // important to update session
    
//     req.session.passport.user.updatedfield= 'updatedvalue';
//     req.session.save(function(err) {console.log(err);});

//   }
// );
// LOGIN END 

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", logout);

// router.post("/logout", (req, res) => {
//   req.logout(); // Passport.js function to clear session data
//   console.log("req.logout() session data should be clear");
//   // for JWT, the client needs to clear the token from its storage
//   res.status(200).send("Logged out successfully");
// });

// router.use((req, res, next) => {
//   if(!req.session.userID)
//     return res.status(403).send("not logged in");
//  next();
// });


router.get("/status", authenticateToken, (req, res) => {
  // If token is valid, req.user will contain the decoded JWT payload
  // You can use req.user to access user information or perform additional actions
  console.log(`auth/routes.js - /status attempted`);

  //console.log(`auth/routes.js req.cookies.token: ${req.cookies.token}`)
  // console.log(`auth/routes.js - /status req.user.token`);
  //console.log(req.user.token); undefined 
  //console.log(`auth/routes.js - /status req.session:`);
//  console.log(req.session);
  //console.log("auth/routes.js - /status - Authenticated");
  
  jsonData = {
          logged_in: true,
          id: req.user.id,
          email_address: req.user.email_address,
          auth_method: req.user.auth_method,
        };

  res.status(200).json({ jsonData });
});


// router.get('/status', (req, res) => {
//   console.log(`auth/routes.js - /status req.session.user: ${req.session.user}`); // undefined!! 
//   console.log(`auth/routes.js - /status req.passport: ${req.passport}`); // undefined
//   console.log(`auth/routes.js - /status req.passport: ${req.session.passport}`); // 
//   console.log(`auth/routes.js - /status req.session: ${req.session}`); //object
//   console.log(`auth/routes.js - /status stringified req.session: ${JSON.stringify(req.session)}`);// just tells me there's a cookie

//   // console.log(`auth/routes.js - /status req.session.cookie: ${req.session.cookie}`); //gives object
//   // console.log(`auth/routes.js - /status req.session.cookie: ${JSON.stringify(req.session.cookie)}`); //gives cookie data
//   // console.log(`auth/routes.js - /status req.headers: ${req.headers}`); // object
//   // console.log(`auth/routes.js - /status req.headers: ${JSON.stringify(req.headers)}`); // 
//   // console.log(`auth/routes.js - /status req.params: ${req.params}`); // object
//   // console.log(`auth/routes.js - /status req.params: ${JSON.stringify(req.params)}`); // object
  
//   //console.log(`auth/routes.js - /status req.username: ${req.username}`); // undefined
//   //console.log(`auth/routes.js - /status req.signedcookies: ${req.signedCookies}`); // crash 
//   // req.user nothing, req.session.user nothing for now,  req.passport nothing, 
  
//   //console.log(`auth/routes.js - /status req.passport: ${JSON.stringify(req)}`); 
//   //console.log(`auth/routes.js - /status session: ${session}`); // this breaks the route
//   //console.log(`auth/routes.js - Here is the req`);
//   //console.log(req); //not helpful
//   //  console.log(JSON.stringify(req));
//   let jsonData;
  
//    const sessionId = req.sessionID; //Not helpful
//    console.log(`auth/routes.js - /status sessionId: ${sessionId}`); // not helpful
//   console.log("auth/routes.js /status - get status attempted");

//   //req.session.user 
//   if (!req.isAuthenticated()) {
//     console.log(
//       "auth/routes.js /status- req is not authenticated! Below is result of isAuthenticated()"
//     );
//     console.log(req.isAuthenticated()); // Returns false
//     jsonData = {
//       logged_in: false,
//       id: null,
//       email_address: null,
//       auth_method: null,
//     };
//   } else {
//     console.log("auth/routes.js - You have been authenticated!");
//     jsonData = {
//       logged_in: true,
//       id: req.user.id,
//       email_address: req.user.email_address,
//       auth_method: req.user.auth_method,
//     };
//   }
//   res.status(200).json(jsonData);
//   console.log(jsonData);
// });

// /STATUS END 

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */

// Route to initiate Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to the dashboard after successful authentication
 *       401:
 *         description: Unauthorized
 */
// Route to handle the callback and generate JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3001/login" }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, auth_method: 'google' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in the cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    // Create the JSON data
    const jsonData = {
      logged_in: true,
      id: req.user.id,
      email_address: req.user.email,
      auth_method: 'google'
    };

    //res.json({ message: 'Login successful', jsonData }); //This sends you to backend with json!
        // Redirect to the client /account page with the token
    res.redirect(`http://localhost:3001/account?token=${token}`);
  }
);



/**
 * @swagger
 * /api/v1/auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Facebook for authentication
 */

router.get(
  "/facebook", //don't write /auth/facebook it doesn't work! rookie mistake!!
  passport.authenticate("facebook", { scope: ["email"] })
);
/**
 * @swagger
 * /api/v1/auth/facebook/callback:
 *   get:
 *     summary: Facebook authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to the dashboard after successful authentication
 *       401:
 *         description: Unauthorized
 */
// Facebook Callback route
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "http://localhost:3001/login" }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, auth_method: 'facebook' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in the cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    // Create the JSON data
    const jsonData = {
      logged_in: true,
      id: req.user.id,
      email_address: req.user.email,
      auth_method: 'facebook'
    };

    // Redirect to the client /account page with the token
    res.redirect(`http://localhost:3001/account?token=${token}`);
  }
);

module.exports = router;
