const getProducts = "SELECT * FROM Products";
const getProductById = "SELECT * FROM products WHERE product_id = $1";
const checkProductExists = "SELECT i FROM products i WHERE i.product_id = $1"; // i is the alias 
const addProduct = "INSERT INTO products (product_name, product_description, price, stock_quantity) VALUES ($1, $2, $3, $4)";
//const updateProductName = "UPDATE products SET product_name = $1, updated_at = NOW() WHERE product_id = $2"; // $1 - 1st variable we passed in, $2 2nd variable we passed in
//const updateProductStockQuantity = "UPDATE products SET stock_quantity = $1, stock_quantity_updated_at = NOW() WHERE product_id = $2"; // $1 - 1st variable we passed in, $2 2nd variable we passed in
//const updateQuery = `UPDATE products SET ${column} = $1, updated_at = NOW() WHERE product_id = $2`;
const generateUpdateQuery = (column) => {
    return `UPDATE products SET ${column} = $1, updated_at = NOW() WHERE product_id = $2`;
  };
const removeProduct = "DELETE FROM products WHERE product_id = $1";

module.exports = {
    getProducts,   
    getProductById,
    checkProductExists,
    addProduct,
//    updateProductName,
    //updateProductStockQuantity,
    generateUpdateQuery,
    removeProduct,
};

