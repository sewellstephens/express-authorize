const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const usersController = require("../controllers/users");

const router = express.Router();

// POST /users/logout
router.post("/logout", isAuth, usersController.logout);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

// PUT /users/account
router.put("/account", isAuth, usersController.updateUser);

// Google OAuth
router.get("/google", usersController.googleAuth);

// Google OAuth Callback
router.get("/googleCallback", usersController.googleOAuthCallback);

module.exports = router;