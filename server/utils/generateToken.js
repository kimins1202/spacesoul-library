const jwt = require("jsonwebtoken");

const generateToken = (id, type = 'Reader') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
