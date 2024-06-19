const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../db.js"); //
const queries = require("../customers/queries.js");

const register = async (req, res) => {
  const { username, password, firstName, lastName, email, phoneNumber } =
    req.body;
  try {
    console.log("Registering");
    // Check if email exists
    const emailExistsResult = await pool.query(queries.checkEmailExists, [
      email,
    ]);
    if (emailExistsResult.rows.length > 0) {
      console.log("This email address is already in use.");
      return res.status(400).send("This email address is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(queries.addCustomer, [
      username,
      hashedPassword,
      firstName,
      lastName,
      email,
      phoneNumber,
    ]);
    console.log("Successful Registration");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      // Unique violation error code
      res.status(409).send("Username already exists");
    } else {
      res.status(500).send("Server error");
    }
  }
};



// Token stuffs -  passport sessions not working!/session id keep changing no matter what
// so let's do it this way for now!
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    console.log("No token provided, proceed with limited or public data");
    req.user = null;
    next();
    return;
  }
//Needed token.split(' ')[1] to get rid of Bearer prefix!!!!!!!!
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      req.user = null;
      next();
      return;
    }
    console.log("Token is valid, attach user information to req.user");
    req.user = user;
    next();
  });
}

module.exports = {
  register,
  authenticateToken,
  //login, - it became a passport local strategy instead!
};


/* login without passport ! Reworking this to use passport!!
const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  console.log("Server received the following data:");
    console.log(`usernameOrEmail: ${usernameOrEmail} and password: ${password}`);
  try {
    
    // Check if the usernameOrEmail corresponds to a username
    let result = await pool.query(queries.checkUsernameExists, [usernameOrEmail]);
    console.log("Username Query Result:", result.rows);

    let user = result.rows.length > 0 ? parseUser(result.rows[0].c) : null;

    // If no user found, check if the usernameOrEmail corresponds to an email
    if (!user) {
      result = await pool.query(queries.checkEmailExists, [usernameOrEmail]);
      console.log("Email Query Result:", result.rows);
      user = result.rows.length > 0 ? parseUser(result.rows[0].c) : null;
    }

    // Log user information
    console.log("User:", user);

    // If user exists and password matches, generate token
    if (user && user.password) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log("Successful Login!");
        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("Token: ", token);
        res.json({ token });
      } else {
        console.log("Failed to Login!");
        res.status(401).send("Invalid credentials");
      }
    } else {
      console.log("Failed to Login!");
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
*/

/*
//Moved to passportConfig.js
// Parse user string
function parseUser(userString) {
  if (!userString) return null; // userString is null or empty?
  const userData = userString.slice(1, -1).split(","); // Split userString into an array of fields ',' = delimiter
  return {
    id: userData[0], // index is field column
    username: userData[1],
    password: userData[2],
    email: userData[5], // 5th column in table is email etc
  };
}

*/