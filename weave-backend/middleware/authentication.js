const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  //check header for the token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Invalid Credentials");
  }

  //split Bearer and Token
  const token = authHeader.split(" ")[1];

  //verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    throw new Error("Invalid Credentials");
  }
};

module.exports = auth;
