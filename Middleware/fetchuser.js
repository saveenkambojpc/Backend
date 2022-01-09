var jwt = require("jsonwebtoken");
const JWT_SECRET = "harryisagoodboy";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object

  const token = req.header("auth-token");

  try {
    if (token) {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data;
      next();
    } else {
      return res.status(500).send({ error: "Please enter a valid token" });
    }
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = fetchuser;
