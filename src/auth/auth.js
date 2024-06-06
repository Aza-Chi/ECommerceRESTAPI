const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db.js');  //
const queries = require('../customers/queries.js');

const register = async (req, res) => {
    
    const { username, password, firstName, lastName, email, phoneNumber } = req.body;
    try {
        console.log("Registering");
        // Check if email exists
        const emailExistsResult = await pool.query(queries.checkEmailExists, [email]);
        if (emailExistsResult.rows.length > 0) {
            console.log("This email address is already in use.");
            return res.status(400).send("This email address is already in use.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            queries.addCustomer,
            [username, hashedPassword, firstName, lastName, email, phoneNumber]
        );
        console.log("Successful Registration");
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation error code
            res.status(409).send('Username already exists');
        } else {
            res.status(500).send('Server error');
        }
    }
};


const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Check if the usernameOrEmail corresponds to a username
        let result = await pool.query(queries.checkUsernameExists, [usernameOrEmail]);
        console.log('Username Query Result:', result.rows);
        let user = parseUser(result.rows[0].c);

        // If no user found, check if the usernameOrEmail corresponds to an email
        if (!user) {
            result = await pool.query(queries.checkEmailExists, [usernameOrEmail]);
            console.log('Email Query Result:', result.rows);
            user = parseUser(result.rows[0].c);
        }

        // Log user information
        console.log('User:', user);

        // If user exists and password matches, generate token
        if (user && user.password) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                console.log("Successful Login!");
                const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("Token: " + { token });
                res.json({ token });
            } else {
                console.log("Failed to Login!");
                res.status(401).send('Invalid credentials');
            }
        } else {
            console.log("Failed to Login!");
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Parse user string
function parseUser(userString) {
    if (!userString) return null; //userString is null or empty?
    const userData = userString.slice(1, -1).split(','); // Split userString into an array of fields ',' = delimiter
    return {
        id: userData[0], //index is field column
        username: userData[1],
        password: userData[2],
        email: userData[5], //5th column in table is email etc
        
    };
}

module.exports = { register, login };