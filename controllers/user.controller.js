const db = require("../models");
const NotFound = require("../helpers/not-found");
const AppError = require("../helpers/AppError");
const { signJWT, verifiedJWT, hashPass } = require("../helpers/JWT_BCRYPT");

// Get User by Id
exports.GetUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await db.User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new NotFound(`User not found of the given id: ${userId}.`);
  }
  res.status(200).json({ success: true, user });
};

//Get all Users
exports.GetAllUsers = async (req, res, next) => {
  const users = await db.User.findAll({
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["password"] },
  });
  res.status(200).json({ success: true, data: users });
};

// Signup User
exports.UserSignup = async (req, res, next) => {
  const { name, email, password, comparePassword } = req.body;
  const user = await db.User.create({
    name,
    email,
    password,
    comparePassword,
  });

  //hide password in response
  user.password = undefined;
  user.comparePassword = undefined;

  res
    .status(201)
    .json({ success: true, msg: "User successfully created, please login" });
};

//Update User
exports.UpdateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    throw new AppError("Name and email are required.", 400);
  }

  const user = await db.User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new AppError(`User not found of the given id: ${userId}.`, 404);
  }

  await db.User.update(
    { name, email },
    { where: { id: user.id } },
    { isNewRecord: false }
  );

  res.status(201).json({ success: true, msg: "User Updated successfully." });
};

//Delete User
exports.DeleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await db.User.destroy({ where: { id: userId } });
  if (!user) {
    throw new NotFound(`User not found of the given id: ${userId}.`);
  }
  res.status(200).json({ success: true, msg: "User deleted." });
};

//User Login here
exports.UserLogin = async (req, res, next) => {
  let errors = {};
  const { email, password } = req.body;

  if (!email) {
    errors["email"] = "Email is required.";
    // throw new AppError("Email is required.", 400);
  }
  if (!password) {
    errors["password"] = "Password is required.";
    // throw new AppError("Password is required.", 400);
  }
  const user = await db.User.findOne({ where: { email } });
  if (!user || !(await hashPass(password, user.password))) {
    errors["email_pass"] = "Incorrect email and password.";
  } else {
    user.password = undefined;
    const token = await signJWT(user.id);
    return res.json({ success: true, token, data: user });
  }
  if (errors) {
    return res.status(401).json({ success: false, errors });
  }
};

// Authentication Middleware
exports.isLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("Your not logged in", 401);
  }
  const decode = await verifiedJWT(token);
  const user = await db.User.findOne({
    where: { id: decode.userId },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new AppError("The token is not belong to this user.", 401);
  }

  req.user = user;
  next();
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You dont have permission to perform this action.");
    }
    next();
  };
};
