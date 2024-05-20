const getCarts = "SELECT * FROM shoppingcart";
const getCartByCustomerId = "SELECT * FROM shoppingcart WHERE customer_id = $1"; //Customer id //Limit customers so they can only see their carts !!! 
const checkCartExists = "SELECT i FROM shoppingcart i WHERE i.cart_id = $1"; // i is the alias 
const addCart = "INSERT INTO shoppingcart (customer_id, product_id, quantity) VALUES ($1, $2, $3)"; //1. Add products to cart !!!
const removeCart = "DELETE FROM shoppingcart WHERE cart_id = $1";

const generateUpdateQuery = (column) => {
    return `UPDATE shoppingcart SET ${column} = $1, updated_at = NOW() WHERE cart_id = $2`;
  };


module.exports = {
    getCarts,   
    getCartByCustomerId,
    checkCartExists,
    addCart,
    removeCart,
    generateUpdateQuery,
};

// CART 
//1. Add products to cart !!!
//2. View Cart - Get card by id where customer id = $1 Get by customer id ! 
//3. update cart - quantity or remove cart item!! 
// ORDERS
//4. Purchase/Place an order? - Add order to orders table 
// +
// ORDER DETAILS
//5. On placing an order - add orderdetails  too ! order_id, product_id, quantity, subtotal etc 
// PRODUCTS 
//6. Update stock quantity in products table,    stock quant = stock quant - order.quantity ?
//7. Remove shopping cart that was ordered!

