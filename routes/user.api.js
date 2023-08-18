const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const validators = require("../middlewares/validators.js");
const { body } = require("express-validator");
const authentication = require("../middlewares/authentication.js");

/**
 * @route POST /users
 * @description Create new User
 * @body {name, email, password, phoneNumber}
 * @access public
 */
router.post(
  "/",
  validators.validate([
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("name", "Invalid Name").exists().notEmpty(),
    body("phoneNumber", "Invalid Phone Number").exists().notEmpty(),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route PUT /users/changePassword
 * @description Change Password
 * @body {oldPassword, newPassword}
 * @access Login required
 */

router.put(
  "/changePassword",
  authentication.loginRequired,
  validators.validate([
    body("oldPassword", "Invalid Old Password").exists().notEmpty(),
    body("newPassword", "Invalid New Password").exists().notEmpty(),
  ]),
  userController.changePassword
);

/**
 * @route GET /users/verify-email/:accessToken
 * @description
 * @require
 *
 */
router.get("/verify-email/:token", userController.verifyEmail);

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);
module.exports = router;
