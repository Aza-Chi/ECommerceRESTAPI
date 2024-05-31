const pool = require('../../db');
const queries = require('./queries');
const controllerProducts = require('../products/controller');


const getOrderDetails = (req, res) => {
    console.log("Fetching orders...");
    pool.query(queries.getOrderDetails, (error, results) => {
        if(error) {
            console.error('Error fetching order details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log("Order details fetched successfully.");
            res.status(200).json(results.rows);
        }
    });
  };

  const getOrderDetailsById = (req, res) => {
    const id = parseInt(req.params.order_detail_id);
    pool.query(queries.getOrderDetailsById, [id], (error, results) => { 
        if(error) {
            console.error('Error fetching order details by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.rows.length === 0) {
                res.status(404).json({ error: 'Order details not found' });
            } else {
                console.log("Order details fetched successfully.");
                res.status(200).json(results.rows);
            }
        }
    });
};

const addOrderDetails = async (req, res) => {
    // Use JS Destructuring to extract data from request body
    const { order_id, product_id, quantity} = req.body; 
    
    try {
      //Self explanatory stuff!
      const price = await controllerProducts.getProductPriceById(product_id);
      const subtotal = price * quantity;
      // Add the order details
        await pool.query(queries.addOrderDetails, [order_id, product_id, quantity, subtotal]);
        console.log("Order details added successfully!");
        return res.status(201).send("Order details added successfully!");
    } catch (error) {
        console.error("Error adding order details:", error);
        return res.status(500).send(`Error adding order details: ${error.message}`);
    }
};

const removeOrderDetails = (req, res) => {
    //id comes in as a string so we need to parse for int
    const id = parseInt(req.params.order_detail_id);

    // Check if the order details exists before attempting removal
    pool.query(queries.getOrderDetailsById, [id], (error, results) => {
        if (error) {
            console.error('Error checking if order details exists:', error);
            return res.status(500).send("Error checking if order details exists.");
        }

        // If no order details are found with the given ID, return a 404 response
        if (results.rows.length === 0) {
            return res.status(404).send("Order details do not exist in database!");
        }

        // Remove the order details
        pool.query(queries.removeOrderDetails, [id], (error, results) => {
            if (error) {
                console.error('Error removing order details:', error);
                return res.status(500).send("Error removing order details.");
            }
            res.status(200).send("Order details successfully removed");
        });
    });
  };


  //After purchase don't really need this, should only be allowed to cancel the order or update the address, so we need 'delete' from orders and 'update' from order details!
  const updateOrderDetails = async (req, res) => {
    const id = parseInt(req.params.order_detail_id);
    const { order_id, product_id, quantity, subtotal } = req.body;

    try {
      // Check if the order details exist before attempting to update
      const result = await pool.query(queries.getOrderDetailsById, [id]);

      // If no order details are found with the given ID, return a 404 response
      if (result.rows.length === 0) {
        return res.status(404).send("Requested order details do not exist in database!");
      }

      // Update the order columns based on the request body
      const updates = [
        { column: 'order_id', value: order_id },
        { column: 'product_id', value: product_id },
        { column: 'quantity', value: quantity },
        { column: 'subtotal', value: subtotal },
      ];

      for (const update of updates) {
        if (update.value !== undefined) {
          const updateQuery = queries.generateUpdateQuery(update.column); 
          await updateColumn(updateQuery, update.value, id); 
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
    getOrderDetails,
    getOrderDetailsById,
    addOrderDetails,
    removeOrderDetails,
    updateOrderDetails,
  };