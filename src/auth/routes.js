const express = require("express");
const { register, login } = require("./auth");
const passport = require('../../passportConfig');
const router = express.Router();

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
router.post("/login", login);

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
router.post("/logout", (req, res) => {
  req.logout(); // Passport.js function to clear session data
  console.log("req.logout() session data should be clear");
  // for JWT, the client needs to clear the token from its storage
  res.status(200).send("Logged out successfully");
});


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


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
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
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
      console.log("Google authentication successful, user:", req.user);
      res.redirect('http://localhost:3001/?loginSuccess=true');
  });

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Log request and user details
    console.log("Inside Google callback");
    console.log("Request query:", req.query);
    console.log("Authenticated user:", req.user);

    // Redirect to the frontend application
    res.redirect('http://localhost:3001/?loginSuccess=true');
});

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


router.get('/facebook', // '/auth/facebook' DOES NOT WORK!!
  passport.authenticate('facebook'));
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
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Log request and user details
    console.log("Inside Facebook callback");
    console.log("Authenticated user:", req.user);

    // Redirect to the frontend application
    res.redirect('http://localhost:3001/?loginSuccess=true');
  }
);
module.exports = router;