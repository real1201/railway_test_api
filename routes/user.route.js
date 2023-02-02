const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.route("/users").get(user.isLoggedIn, user.GetAllUsers);
router
  .route("/users/:id")
  .get(user.isLoggedIn, user.GetUserById)
  .put(user.isLoggedIn, user.UpdateUser)
  .delete(user.isLoggedIn, user.restrictedTo("admin"), user.DeleteUser);

//Auth User
router.route("/users/login").post(user.UserLogin);
router.route("/users/signup").post(user.UserSignup);
// router.route("/users/logout").post(user.loggedOutUser);
module.exports = router;
