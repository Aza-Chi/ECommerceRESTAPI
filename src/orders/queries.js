const getOrders = "SELECT * FROM orders";
const getOrderById = "SELECT * FROM orders WHERE order_id = $1";
const getOrderByCustomerId = "SELECT * FROM orders WHERE customer_id = $1";
const getOrderByOrderReference = "SELECT * FROM orders WHERE order_reference = $1";
const getOrderSummaryByOrderId = `SELECT o.*, od.product_id, od.quantity, od.subtotal 
                                  FROM orders o 
                                  JOIN orderdetails od ON o.order_id = od.order_id 
                                  WHERE o.order_id = $1`;
const checkOrderExists = "SELECT i FROM orders i WHERE i.order_id = $1"; // i is the alias
const addOrder = `
  INSERT INTO orders (customer_id, total_amount, address_id, status_id)
  VALUES ($1, $2, $3, $4)
  RETURNING order_id;
`;
const removeOrder = "DELETE FROM orders WHERE order_id = $1";

const generateUpdateQuery = (column) => {
  return `UPDATE orders SET ${column} = $1, updated_at = NOW() WHERE order_id = $2`;
};

module.exports = {
  getOrders,
  getOrderById,
  getOrderByCustomerId,
  getOrderByOrderReference,
  getOrderSummaryByOrderId,
  checkOrderExists,
  addOrder,
  removeOrder,
  generateUpdateQuery,
};
