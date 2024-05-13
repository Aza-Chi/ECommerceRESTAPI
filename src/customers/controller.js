// Need to fix 'ERR_HTTP_HEADERS_SENT'

const pool = require('../../db');
const queries = require('./queries');

const getCustomers = (req, res) => {
    pool.query(queries.getCustomers, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const addCustomer = async (req, res) => {
    // Use JS Destructuring !
    const { username, password_hash, first_name, last_name, email, phone_number, } = await req.body;
    // Check if email exists !
    pool.query(queries.checkEmailExists, [email], (error, results) => {
      console.log("Checking if email is in use!");
      if (results.rows.length > 0) {
        console.log("This email address is already in use.");
        return res.send("This email address is already in use.");
      } else if (results.rows.length === 0) {
        // length 0, falsy so we can add the customer/email!
        pool.query(queries.addCustomer, [username, password_hash, first_name, last_name, email, phone_number]
        ).then(() => {
              res.send("Customer Added Successfully!");
            console.log("Added the Customer!");
        }).catch(() => {
              res.send("Error!");
        });
      }
    });
  };

const getCustomerById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getCustomerById, [id], (error, results) => { // If multiple then [id, name] etc
        if(error) throw error;
        res.status(200).json(results.rows);
    })
}

const removeCustomer = (req, res) => {
    //id comes in as a string so we need to parse for int
    const id = parseInt(req.params.id);
    
    pool.query(queries.getCustomerById, [id], (error, results) => {
        const noCustomerFound = !results.rows.length; //If length of results === 0
        if (noCustomerFound) {
            if (error) throw error; // Unnecessary - doesn't fix ERR HTTP HEADERS_SENT /  [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
            res.send("Customer does not exist in database!");
        } 
            pool.query(queries.removeCustomer, [id], (error, results) => {
                if (error) throw error;
                res.status(200).send("Customer Successfully Removed");
            });
    });
};

const updateCustomerFirstName = (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name } = req.body; //Not name ! first_name etc!!
    pool.query(queries.getCustomerById, [id], (error, results) => {
        const noCustomerFound = !results.rows.length;
        if (noCustomerFound) {
            res.send("Customer does not exist in database!");
        }
       pool.query(queries.updateCustomerFirstName, [first_name, id], (error, results) => { // Not name !!
        if (error) throw error;
        res.status(200).send("Customer updated successfully")
       }) 
    });
    //res.send("Everything is ok");
};


module.exports = {
    getCustomers,
    getCustomerById,
    addCustomer,
    removeCustomer,
    updateCustomerFirstName,
};