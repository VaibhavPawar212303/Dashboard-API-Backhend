const jwt = require("jsonwebtoken");
const client = require("../config/db");
  
const loginUser = async (req, res) => {
  const { EmailId, Password } = req.body;
  if (!EmailId) {
    res.status(200).json({ message: "Please Add Email" });
  } else if (!Password) {
    res.status(200).json({ message: "Please Add Password" });
  } else {
    try {
      var query = `SELECT * FROM userdata 
           WHERE email = '${EmailId}';`;
      client  .query(query, function (err, result) {
        if (err) throw err;
        const password = result.rows[0].password;
        if (Password === password) {
          res
            .status(200)
            .json({ user: result.rows[0], token: generateToken() });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};

//JWT Token Creation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { loginUser };
