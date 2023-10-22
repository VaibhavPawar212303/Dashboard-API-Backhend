const sql = require("../config/db");

const getTests = async (req, res) => {
  const buildId = req.params.id;
  try {
    var query = `SELECT * FROM testdata 
     WHERE buildid = '${buildId}';`;
    sql.client.query(query, function (err, result) {
      if (err) throw err;
      res.status(200).json({ tests: result.rows });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTests };
