const pool = require('../../db');
const queries = require('./queries');

const getCustomers = (req, res) => {
  pool.query(queries.getCustomers, (error, results) => {
      if(error) {
          console.error('Error fetching customers:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(results.rows);
      }
  });
};


const addCustomer = async (req, res) => {
  // Use JS Destructuring
  const { username, password_hash, first_name, last_name, email, phone_number } = req.body;

  try {
    // Check if email exists
    const emailExistsResult = await pool.query(queries.checkEmailExists, [email]);
    if (emailExistsResult.rows.length > 0) {
      console.log("This email address is already in use.");
      return res.send("This email address is already in use.");
    }

    // Add the customer
    await pool.query(queries.addCustomer, [username, password_hash, first_name, last_name, email, phone_number]);
    console.log("Added the Customer!");
    return res.send("Customer Added Successfully!");
  } catch (error) {
    console.error("Error adding customer:", error);
    return res.status(500).send("Error adding customer.");
  }
};


const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getCustomerById, [id], (error, results) => { 
      if(error) {
          console.error('Error fetching customer by ID:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (results.rows.length === 0) {
              res.status(404).json({ error: 'Customer not found' });
          } else {
              res.status(200).json(results.rows);
          }
      }
  });
};


//
const removeCustomer = (req, res) => {
  //id comes in as a string so we need to parse for int
  const id = parseInt(req.params.id);
  
  // Check if the customer exists before attempting removal
  pool.query(queries.getCustomerById, [id], (error, results) => {
      if (error) {
          console.error('Error checking if customer exists:', error);
          return res.status(500).send("Error checking if customer exists.");
      }

      // If no customer is found with the given ID, return a 404 response
      if (results.rows.length === 0) {
          return res.status(404).send("Customer does not exist in database!");
      }

      // Remove the customer
      pool.query(queries.removeCustomer, [id], (error, results) => {
          if (error) {
              console.error('Error removing customer:', error);
              return res.status(500).send("Error removing customer.");
          }
          res.status(200).send("Customer Successfully Removed");
      });
  });
};



const updateCustomerColumn = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password_hash, first_name, last_name, email, phone_number } = req.body;
  
    try {
      // Check if the customer exists before attempting to update
      const result = await pool.query(queries.getCustomerById, [id]);
  
      // If no customer is found with the given ID, return a 404 response
      if (result.rows.length === 0) {
        return res.status(404).send("Customer does not exist in database!");
      }
  
      // Update the customer columns based on the request body
      const updates = [
        { column: 'username', value: username },
        { column: 'password_hash', value: password_hash },
        { column: 'first_name', value: first_name },
        { column: 'last_name', value: last_name },
        { column: 'email', value: email },
        { column: 'phone_number', value: phone_number },
      ];
  
      for (const update of updates) {
        if (update.value !== undefined) {
          const updateQuery = queries.generateCustomerUpdateQuery(update.column); // Generate update query for the column
          await updateColumn(updateQuery, update.value, id); // Update the column
        }
      }
  
      res.status(200).send("Columns updated successfully");
    } catch (error) {
      console.error("Error updating columns:", error);
      res.status(500).send("Error updating columns.");
    }
  };
  
  // Function to update a specific column
  const updateColumn = async (updateQuery, value, id) => { // Pass the generated query as a parameter
    try {
      await pool.query(updateQuery, [value, id]);
      console.log(`Column updated successfully`);
    } catch (error) {
      console.error(`Error updating column:`, error);
      throw error;
    }
  };





module.exports = {
    getCustomers,
    getCustomerById,
    addCustomer,
    removeCustomer,
    updateCustomerColumn,
};