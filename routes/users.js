const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const usersController = require("../controllers/users");

const router = express.Router();

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.");

// POST /users/signup
router.post(
  "/signup",
  [emailValidator, passwordValidator, nameValidator],
  usersController.signup
);

// POST /users/login
router.post(
  "/login",
  [emailValidator, passwordValidator],
  usersController.login
);

// POST /users/logout
router.post("/logout", isAuth, usersController.logout);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

// PUT /users/account
router.put("/account", isAuth, usersController.updateUser);

// POST /users/resetToken
router.post("/resetToken", [emailValidator], usersController.getResetToken);

// POST /users/resetPassword
router.post(
  "/resetPassword",
  [passwordValidator],
  usersController.resetPassword
);

// POST /users/activate
router.get("/activate/:token", usersController.activateAccount);

// Google OAuth
router.get("/google", usersController.googleAuth);

// Google OAuth Callback
router.get("/googleCallback", usersController.googleOAuthCallback);

// Unsubscribe from emails
router.get("/unsubscribe/:email", usersController.unsubscribe);

// POST /users/delete
router.post("/delete", isAuth, usersController.deleteUser);

// POST /users/activateTwoFactor
router.post("/activateTwoFactor", isAuth, usersController.activateTwoFactor);

module.exports = router;