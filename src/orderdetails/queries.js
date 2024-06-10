const getOrderDetails = "SELECT * FROM orderdetails";
const getOrderDetailsById =
  "SELECT * FROM orderdetails WHERE order_detail_id = $1";
const checkOrderDetailsExist =
  "SELECT i FROM orderdetails i WHERE i.order_detail_id = $1"; // i is the alias
const addOrderDetails =
  "INSERT INTO orderdetails (order_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)";
const removeOrderDetails =
  "DELETE FROM orderdetails WHERE order_detail_id = $1";

const generateUpdateQuery = (column) => {
  return `UPDATE orderdetails SET ${column} = $1 WHERE order_id = $2`;
};

//Subtotal calculated as quantity*product_id(price) in products

module.exports = {
  getOrderDetails,
  getOrderDetailsById,
  checkOrderDetailsExist,
  addOrderDetails,
  removeOrderDetails,
  generateUpdateQuery,
};
