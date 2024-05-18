const getCustomers = "SELECT * FROM Customers";
const getCustomerById = "SELECT * FROM customers WHERE id = $1";
const checkEmailExists = "SELECT c FROM customers c WHERE c.email = $1"; // c is the alias 
const addCustomer = "INSERT INTO customers (username, password_hash, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6)";
const removeCustomer = "DELETE FROM customers WHERE id = $1";
//const updateCustomerFirstName = "UPDATE customers SET first_name = $1, updated_at = NOW() WHERE id = $2"; // $1 - 1st variable we passed in, $2 2nd variable we passed in

const generateCustomerUpdateQuery = (column) => {
    return `UPDATE customers SET ${column} = $1, updated_at = NOW() WHERE id = $2`;
  };


module.exports = {
    getCustomers,
    getCustomerById,
    checkEmailExists,
    addCustomer,
    removeCustomer,
    generateCustomerUpdateQuery,
    //updateCustomerFirstName,
};