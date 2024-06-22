const getCarts = `
  SELECT sc.cart_id, sc.customer_id, sc.product_id, sc.quantity, p.product_name, p.price
  FROM shoppingcart sc
  JOIN products p ON sc.product_id = p.product_id
`;
// const getCarts = "SELECT * FROM shoppingcart"; // OLD!
const getCartByCustomerId = `
  SELECT sc.cart_id, sc.customer_id, sc.product_id, sc.quantity, p.product_name, p.price
  FROM shoppingcart sc
  JOIN products p ON sc.product_id = p.product_id
  WHERE sc.customer_id = $1
`;// JOIN with products table so we can get the product name too!!!
//const getCartByCustomerId = "SELECT * FROM shoppingcart WHERE customer_id = $1";// OLD  //Customer id //Limit customers so they can only see their carts !!!
const checkCartExists = "SELECT i FROM shoppingcart i WHERE i.cart_id = $1"; // i is the alias
const addCart =
  "INSERT INTO shoppingcart (customer_id, product_id, quantity) VALUES ($1, $2, $3)"; //1. Add products to cart !!!
const removeCart = "DELETE FROM shoppingcart WHERE cart_id = $1";
const removeCartByCustomerId =
  "DELETE FROM shoppingcart WHERE customer_id = $1";

const generateUpdateQuery = (column) => {
  return `UPDATE shoppingcart SET ${column} = $1, updated_at = NOW() WHERE cart_id = $2`;
};

module.exports = {
  getCarts,
  getCartByCustomerId,
  checkCartExists,
  addCart,
  removeCart,
  removeCartByCustomerId,
  generateUpdateQuery,
};
