const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signJWT = async (userId) => {
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

exports.sendTokenToCookie = async (user, statuCode, res) => {
  const token = await signJWT(user.id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  user.password = undefined;
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  res.cookie("jwt", token, cookieOption);

  res.status(statuCode).json({ success: true, token, user });
};
