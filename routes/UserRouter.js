const express = require("express");
const authController = require("./../controllers/authController");
const UserController = require("./../controllers/UserController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").post(authController.resetPassword);

router
  .route("/")
  .get(UserController.getAllUsers)
  .post(UserController.createUser);
router
  .route("/:id")
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);
module.exports = router;
