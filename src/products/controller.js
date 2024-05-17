const pool = require('../../db');
const queries = require('./queries');

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
      if(error) {
          console.error('Error fetching products:', error);
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




const updateProductColumn = async (req, res) => {
  const id = parseInt(req.params.product_id);
  const { product_name, stock_quantity, product_description, price, category_id, image_url } = req.body;

  try {
    // Check if the product exists before attempting to update
    const result = await pool.query(queries.getProductById, [id]);

    // If no product is found with the given ID, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).send("Product does not exist in database!");
    }

    // Update the product columns based on the request body
    const updates = [
      { column: 'product_name', value: product_name },
      { column: 'stock_quantity', value: stock_quantity },
      { column: 'product_description', value: product_description },
      { column: 'price', value: price },
      { column: 'category_id', value: category_id },
      { column: 'image_url', value: image_url },
    ];

    for (const update of updates) {
      if (update.value !== undefined) {
        const updateQuery = queries.generateUpdateQuery(update.column); // Generate update query for the column
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


// REMOVE PRODUCT 
const removeProduct = (req, res) => {
  //id comes in as a string so we need to parse for int
  const id = parseInt(req.params.product_id);
  
  // Check if the product exists before attempting removal
  pool.query(queries.getProductById, [id], (error, results) => {
      if (error) {
          console.error('Error checking if product exists:', error);
          return res.status(500).send("Error checking if product exists.");
      }

      // If no product is found with the given ID, return a 404 response
      if (results.rows.length === 0) {
          return res.status(404).send("Product does not exist in database!");
      }

      // Remove the product
      pool.query(queries.removeProduct, [id], (error, results) => {
          if (error) {
              console.error('Error removing product:', error);
              return res.status(500).send("Error removing product.");
          }
          res.status(200).send("Product Successfully Removed");
      });
  });
};


module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProductColumn,
    removeProduct,
};