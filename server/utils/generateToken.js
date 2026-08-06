const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwt");

const generateToken = (id, type = 'Reader') => {
  return jwt.sign({ id, type }, getJwtSecret(), {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
