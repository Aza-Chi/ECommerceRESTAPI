const pool = require('../../db');
const queries = require('./queries');

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
      if(error) {
          console.error('Error fetching productss:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(results.rows);
      }
  });
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.product_id);
    pool.query(queries.getProductById, [id], (error, results) => { 
        if(error) {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.rows.length === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(200).json(results.rows);
            }
        }
    });
  };


const addProduct = async (req, res) => {
    // Use JS Destructuring to extract data from request body
    const { product_name, product_description, price, stock_quantity } = req.body;
  
    try {
        // Add the product
        await pool.query(queries.addProduct, [product_name, product_description, price, stock_quantity]);
        console.log("Product added successfully!");
        return res.status(201).send("Product added successfully!");
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).send("Error adding product.");
    }
};

const updateProductColumn = (req, res) => {
  const id = parseInt(req.params.product_id);
  const { product_name, stock_quantity } = req.body;

  let column;
  let value;

  // Determine the column and value based on the request body
  if (product_name !== undefined) {
    column = 'product_name';
    value = product_name;
  } else if (stock_quantity !== undefined) {
    column = 'stock_quantity';
    value = stock_quantity;
  } else {
    return res.status(400).send("No valid column specified for update.");
  }

  // Check if the product exists before attempting to update
  pool.query(queries.getProductById, [id], (error, results) => {
      if (error) {
          console.error('Error checking if product exists:', error);
          return res.status(500).send("Error checking if product exists.");
      }

      // If no product is found with the given ID, return a 404 response
      if (results.rows.length === 0) {
          return res.status(404).send("Product does not exist in database!");
      }

      // Update the specified column and updatedAt timestamp
      const updateQuery = `UPDATE products SET ${column} = $1, updated_at = NOW() WHERE product_id = $2`;
      pool.query(updateQuery, [value, id], (error, results) => {
          if (error) {
              console.error(`Error updating ${column}:`, error);
              return res.status(500).send(`Error updating ${column}.`);
          }
          res.status(200).send(`${column} updated successfully`);
      });
  });
};


module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProductColumn,
};