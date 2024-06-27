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
    console.log("auth/auth.js - Register function -Successful Registration");
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



// Token stuffs -  
// function authenticateToken(req, res, next) {
//   const token = req.headers.authorization;

//   if (!token) {
//     console.log("No token provided, proceed with limited or public data");
//     req.user = null;
//     next();
//     return;
//   }
// //Needed token.split(' ')[1] to get rid of Bearer prefix!!!!!!!!
//   jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("Token verification failed:", err);
//       req.user = null;
//       next();
//       return;
//     }
//     console.log("Token is valid, attach user information to req.user");
//     req.user = user;
//     next();
//   });
// }

const authenticateToken = (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  console.log(`auth/auth.js - authenticateToken: Incoming request headers:`);
  console.log(req.headers);
  console.log(`auth/auth.js - authenticateToken: Extracted token:`);
  console.log(token);

  if (!token) {
    console.error("auth/auth.js - authenticateToken: No token provided");
    return res.status(401).json({
      message: 'No token provided',
      jsonData: {
        logged_in: false,
        id: null,
        email_address: null,
        auth_method: null
      }
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("auth/auth.js - authenticateToken: Invalid token", err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Token is valid, attach user information to request object
    req.user = user;
    console.log(`auth/auth.js - authenticateToken: User information attached to request object:`);
    console.log(req.user);
    next();
  });
};

// Token stuff END 

//login without passport ! 
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
        console.log("auth/auth.js - login function - bcrypt compare: Password Matches!");
        const token = jwt.sign(
          { id: user.id, email_address: user.email, auth_method: 'local', username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("Token: ", token);
        console.log(`auth/auth.js login function - res.cookie`);
        console.log(res.cookie);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'Strict' // Adjust sameSite attribute based on your needs
        });


        const jsonData = {
          logged_in: true,
          id: user.id,
          email_address: user.email,
          auth_method: 'local',
          token: token, //errors so sending it here for now 
        };

        res.json({ 
            message: 'auth/auth.js - login function - Login successful',
            jsonData,
         });
        //res.json({ token }); // OLD 
      } else {
        console.log("auth/auth.js - login function - Failed to Login!");
        res.status(401).send("Invalid credentials");
      }
    } else {
      console.log("auth/auth.js - login function - Failed to Login!");
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("auth/auth.js - login function - Server error");
  }
};


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


const logout = async (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  const jsonData = {
    logged_in: false,
    id: null,
    email_address: null,
    auth_method: null,
  };
console.log(`auth/auth.js - logout function - Logout successful`);
  res.json({ 
    message: 'auth/auth.js - logout function - Logout successful',
    jsonData,
  });
};

/*

*/

module.exports = {
  register,
  authenticateToken,
  login,
  logout,
};




/*



*/