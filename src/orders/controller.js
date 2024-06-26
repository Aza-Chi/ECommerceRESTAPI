const pool = require("../../db");
const queries = require("./queries");
const queriesOrderDetails = require('../orderdetails/queries');

const getOrders = (req, res) => {
  console.log("Fetching orders...");
  pool.query(queries.getOrders, (error, results) => {
    if (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Orders fetched successfully.");
      res.status(200).json(results.rows);
    }
  });
};

const getOrderById = (req, res) => {
  const id = parseInt(req.params.order_id);
  pool.query(queries.getOrderById, [id], (error, results) => {
    if (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: "Order not found" });
      } else {
        res.status(200).json(results.rows);
      }
    }
  });
};

const getOrderByOrderReference = (req, res) => {
  const ref = req.params.order_reference;

  if (typeof ref !== 'string' || ref.length !== 16) {
    console.log(`orders/controller.js getOrderByOrderReference - "Invalid order reference format - numbers(4), letters(4), numbers(4), letters(4) "`);
    return res.status(400).json({ error: "Invalid order reference format" });
  }

  pool.query(queries.getOrderByOrderReference, [ref], (error, results) => {
    if (error) {
      console.error("Error fetching order by reference:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.rows.length === 0) {
      return res.status(204).json({ error: "Order not found" });
    }

    return res.status(200).json(results.rows);
  });
};

const getOrderByCustomerId = (req, res) => {
  const customerId = parseInt(req.params.customer_id);
  pool.query(
    queries.getOrderByCustomerId,
    [customerId],
    (error, results) => {
      if (error) {
        console.error("Error fetching addresses for customer ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

const getOrderSummaryByOrderId = (req, res) => {
  const id = parseInt(req.params.order_id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  pool.query(queries.getOrderSummaryByOrderId, [id], (error, results) => {
    if (error) {
      console.error("Error fetching order by ID:", error); 
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(results.rows);
  });
};


const addOrder = async (req, res) => {
  // Use JS Destructuring to extract data from request body
  const { customer_id, total_amount, address_id, status_id, order_reference } = req.body;
console.log(`orders/controller.js attempting to add order with order_reference: ${order_reference}`);
  try {
    // Add the order
    await pool.query(queries.addOrder, [
      customer_id,
      total_amount,
      address_id,
      status_id,
      order_reference,
    ]);
    console.log("Order added successfully!");
    return res.status(201).send("Order added successfully!");
  } catch (error) {
    console.error("Error adding order:", error);
    return res.status(500).send("Error adding order.");
  }
};

const removeOrder = (req, res) => {
  //id comes in as a string so we need to parse for int
  const id = parseInt(req.params.order_id);

  // Check if the order exists before attempting removal
  pool.query(queries.getOrderById, [id], (error, results) => {
    if (error) {
      console.error("Error checking if order exists:", error);
      return res.status(500).send("Error checking if order exists.");
    }

    // If no order is found with the given ID, return a 404 response
    if (results.rows.length === 0) {
      return res.status(404).send("Order does not exist in database!");
    }

    // Remove the order
    pool.query(queries.removeOrder, [id], (error, results) => {
      if (error) {
        console.error("Error removing order:", error);
        return res.status(500).send("Error removing order.");
      }
      res.status(200).send("Order Successfully Removed");
    });
    pool.query(queriesOrderDetails.removeOrderDetailsByOrderId, [id], (error, results) => {
      if (error) {
        console.error("Error removing order:", error);
        return res.status(500).send("Error removing order.");
      }
      res.status(200).send("Order Successfully Removed");
    });
  });
};

const updateOrderColumn = async (req, res) => {
  const id = parseInt(req.params.order_id);
  const { customer_id, total_amount, address_id, status_id } = req.body;

  try {
    // Check if the order exists before attempting to update
    const result = await pool.query(queries.getOrderById, [id]);

    // If no order is found with the given ID, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).send("Order does not exist in database!");
    }

    // Update the order columns based on the request body
    const updates = [
      { column: "customer_id", value: customer_id },
      { column: "total_amount", value: total_amount },
      { column: "address_id", value: address_id },
      { column: "status_id", value: status_id },
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
const updateColumn = async (updateQuery, value, id) => {
  // Pass the generated query as a parameter
  try {
    await pool.query(updateQuery, [value, id]);
    console.log(`Column updated successfully`);
  } catch (error) {
    console.error(`Error updating column:`, error);
    throw error;
  }
};



module.exports = {
  getOrders,
  getOrderById,
  getOrderByCustomerId,
  getOrderByOrderReference,
  getOrderSummaryByOrderId,
  addOrder,
  removeOrder,
  updateOrderColumn,
};
