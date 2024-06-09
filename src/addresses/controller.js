const pool = require("../../db");
const queries = require("./queries");

const getAddresses = (req, res) => {
  pool.query(queries.getAddresses, (error, results) => {
    if (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getAddressById = (req, res) => {
  const id = parseInt(req.params.address_id);
  pool.query(queries.getAddressById, [id], (error, results) => {
    if (error) {
      console.error("Error fetching address by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: "Address not found" });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
};

const getAddressesByCustomerId = (req, res) => {
  const customerId = parseInt(req.params.customer_id);
  pool.query(
    queries.getAddressesByCustomerId,
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

const addAddress = (req, res) => {
  const {
    customer_id,
    address_type,
    address_line_1,
    address_line_2,
    city,
    country,
    postcode,
  } = req.body;
  pool.query(
    queries.addAddress,
    [
      customer_id,
      address_type,
      address_line_1,
      address_line_2,
      city,
      country,
      postcode,
    ],
    (error, results) => {
      if (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
};

const removeAddress = (req, res) => {
  const id = parseInt(req.params.address_id);
  pool.query(queries.removeAddress, [id], (error, results) => {
    if (error) {
      console.error("Error removing address:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Address removed successfully" });
    }
  });
};

const updateAddress = (req, res) => {
  const id = parseInt(req.params.address_id);
  const {
    customer_id,
    address_type,
    address_line_1,
    address_line_2,
    city,
    country,
    postcode,
  } = req.body;
  pool.query(
    queries.updateAddress,
    [
      customer_id,
      address_type,
      address_line_1,
      address_line_2,
      city,
      country,
      postcode,
      id,
    ],
    (error, results) => {
      if (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.rows.length === 0) {
        res.status(404).json({ error: "Address not found" });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
};

module.exports = {
  getAddresses,
  getAddressById,
  getAddressesByCustomerId,
  addAddress,
  removeAddress,
  updateAddress,
};
