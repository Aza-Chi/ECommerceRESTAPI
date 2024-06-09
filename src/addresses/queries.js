const getAddresses = "SELECT * FROM addresses;";
const getAddressById = "SELECT * FROM addresses WHERE address_id = $1;";
const getAddressesByCustomerId =
  "SELECT * FROM addresses WHERE customer_id = $1;";
const addAddress = `INSERT INTO addresses (customer_id, address_type, address_line_1, address_line_2, city, country, postcode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
const removeAddress = "DELETE FROM addresses WHERE address_id = $1;";
const updateAddress = `UPDATE addresses 
                        SET customer_id = COALESCE($1, customer_id), 
                        address_type = COALESCE($2, address_type), 
                        address_line_1 = COALESCE($3, address_line_1), 
                        address_line_2 = COALESCE($4, address_line_2), 
                        city = COALESCE($5, city), 
                        country = COALESCE($6, country), 
                        postcode = COALESCE($7, postcode) 
                        WHERE address_id = $8 
                        RETURNING *;
                        `;
//COALESCE  Only the provided fields are updated, and the rest remain unchanged!!! null will leave things unchanged!!!!!!!!!!
module.exports = {
  getAddresses,
  getAddressById,
  getAddressesByCustomerId,
  addAddress,
  removeAddress,
  updateAddress,
};
