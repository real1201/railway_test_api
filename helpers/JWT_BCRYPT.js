const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.signJWT = async (userId) => {
  return await jwt.sign({ userId }, process.env.JWT_SECRET_ME, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verifiedJWT = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET_ME);
};

exports.hashPass = async (plain_password, hass_password) => {
  return await bcrypt.compare(plain_password, hass_password);
};
