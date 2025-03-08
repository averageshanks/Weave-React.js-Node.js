const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(
    { userId: payload.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

module.exports = { createToken };
