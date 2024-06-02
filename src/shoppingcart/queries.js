const getCarts = "SELECT * FROM shoppingcart";
const getCartByCustomerId = "SELECT * FROM shoppingcart WHERE customer_id = $1"; //Customer id //Limit customers so they can only see their carts !!! 
const checkCartExists = "SELECT i FROM shoppingcart i WHERE i.cart_id = $1"; // i is the alias 
const addCart = "INSERT INTO shoppingcart (customer_id, product_id, quantity) VALUES ($1, $2, $3)"; //1. Add products to cart !!!
const removeCart = "DELETE FROM shoppingcart WHERE cart_id = $1";
const removeCartByCustomerId = "DELETE FROM shoppingcart WHERE customer_id = $1";


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


