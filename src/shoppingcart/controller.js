const pool = require('../../db');
const queries = require('./queries');



const getCarts = (req, res) => {
    console.log("Fetching shopping cart...");
    pool.query(queries.getCarts, (error, results) => {
        if (error) {
            console.error('Error fetching shopping cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
                console.log("Shopping cart fetched successfully.");
                res.status(200).json(results.rows);
            
        }
    });
};

const getCartByCustomerId = (req, res) => {
    const customerId = parseInt(req.params.customer_id);
    pool.query(queries.getCartByCustomerId, [customerId], (error, results) => {
        if (error) {
            console.error('Error fetching shopping carts for customer ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(results.rows);
        }
    });
};

const addCart = async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;

    try {
        await pool.query(queries.addCart, [customer_id, product_id, quantity]);
        console.log("Shopping cart added successfully!");
        res.status(201).send("Shopping cart added successfully!");
    } catch (error) {
        console.error("Error adding shopping cart:", error);
        res.status(500).send("Error adding shopping cart.");
    }
};

const removeCart = (req, res) => {
    const cart_id = parseInt(req.params.cart_id);
    
    // Check if the cart entry exists before attempting removal
    pool.query(queries.checkCartExists, [cart_id], (error, results) => {
        if (error) {
            console.error('Error checking if cart entry exists:', error);
            return res.status(500).send("Error checking if cart entry exists.");
        }

        // If no cart entry is found with the given ID, return a 404 response
        if (results.rows.length === 0) {
            return res.status(404).send("Cart entry does not exist in database!");
        }

        // Remove the cart entry
        pool.query(queries.removeCart, [cart_id], (error, results) => {
            if (error) {
                console.error('Error removing cart entry:', error);
                return res.status(500).send("Error removing cart entry.");
            }
            res.status(200).send("Cart Entry Successfully Removed");
        });
    });
};

//////////
   


//////////



const updateCartColumn = async (req, res) => { //CHANGE TO COALESCE?
    const { customer_id, product_id, quantity } = req.body;

    try {
        // Check if the cart entry exists before attempting to update
        const result = await pool.query(queries.getCartByCustomerId, [customer_id]);

        // If no cart entry is found with the given IDs, return a 404 response
        if (result.rows.length === 0) {
            return res.status(404).send("Cart entry does not exist in database!");
        }

        // Update the cart entry columns based on the request body
        const updates = [
            { column: 'customer_id', value: customer_id },
            { column: 'product_id', value: product_id },
            { column: 'quantity', value: quantity }
        ];

        for (const update of updates) {
            if (update.value !== undefined) {
                const updateQuery = queries.generateUpdateQuery(update.column); // Generate update query for the column
                await updateColumn(updateQuery, update.value, result.rows[0].cart_id); // Update the column (Changed the parameters passed to updateColumn)
            }
        }

        res.status(200).send("Columns updated successfully");
    } catch (error) {
        console.error("Error updating columns:", error);
        res.status(500).send("Error updating columns.");
    }
};


// Function to update a specific column
const updateColumn = async (updateQuery, value, customer_id) => { // Pass the generated query as a parameter
    try {
        await pool.query(updateQuery, [value, customer_id]);
        console.log(`Column updated successfully`);
    } catch (error) {
        console.error(`Error updating column:`, error);
        throw error;
    }
};

module.exports = {
    getCarts,
    getCartByCustomerId,
    addCart,
    removeCart,
    updateCartColumn,
};