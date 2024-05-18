const pool = require('../../db');
const queries = require('./queries');

const getCarts = (req, res) => {
    console.log("Fetching shopping cart...");
    pool.query(queries.getCart, (error, results) => {
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
    const id = parseInt(req.params.cart_id);

    pool.query(queries.getCartById, [id], (error, results) => {
        if (error) {
            console.error('Error checking if shopping cart exists:', error);
            return res.status(500).send("Error checking if shopping cart exists.");
        }

        if (results.rows.length === 0) {
            return res.status(404).send("Shopping cart does not exist in database!");
        }

        pool.query(queries.removeCart, [id], (error, results) => {
            if (error) {
                console.error('Error removing shopping cart:', error);
                return res.status(500).send("Error removing shopping cart.");
            }
            res.status(200).send("Shopping cart successfully removed");
        });
    });
};

const updateCartColumn = async (req, res) => {
    const id = parseInt(req.params.cart_id);
    const { customer_id, product_id, quantity } = req.body;

    try {
        const result = await pool.query(queries.getCartById, [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Shopping cart does not exist in database!");
        }

        const updates = [
            { column: 'customer_id', value: customer_id },
            { column: 'product_id', value: product_id },
            { column: 'quantity', value: quantity },
        ];

        for (const update of updates) {
            if (update.value !== undefined) {
                const updateQuery = queries.generateCartUpdateQuery(update.column);
                await updateColumn(updateQuery, update.value, id);
            }
        }

        res.status(200).send("Columns updated successfully");
    } catch (error) {
        console.error("Error updating columns:", error);
        res.status(500).send("Error updating columns.");
    }
};

const updateColumn = async (updateQuery, value, id) => {
    try {
        await pool.query(updateQuery, [value, id]);
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