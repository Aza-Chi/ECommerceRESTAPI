const pool = require('../../db');
const queries = require('./queries');

const getCustomers = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
      if(error) {
          console.error('Error fetching productss:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(results.rows);
      }
  });
};


module.exports = {
    getProducts,

};