const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require('googleapis');


const User = require("../models/user");
const transport = require("../emails/transport");

const {
  resetPasswordTemplate,
  emailConfirmationTemplate,
  welcomeTemplate
} = require("../emails/templates");
const M = require("minimatch");

const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const err = new Error(errArray[0].msg);
      err.statusCode = 422;
      err.data = errArray;
      throw err;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const err = new Error("E-Mail address already exists.");
      err.statusCode = 422;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
    const activationToken = (await promisify(randomBytes)(20)).toString("hex");

    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      activationToken: activationToken,
    });
    const savedUser = await user.save();

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: savedUser.email,
      subject: "Confirm Your Email Address",
      html: emailConfirmationTemplate(savedUser.activationToken),
    });

    // Automatically log in user after registration
    const token = jwt.sign(
      { userId: savedUser._id.toString() },
      process.env.JWT_KEY
    );

    // Set cookie in the browser to store authentication state
    const maxAge = 2592000000; // 30 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: process.env.DOMAIN,
    });

    res.status(201).json({
      message: "User successfully created.",
      userId: savedUser._id,
    });
  } catch (err) {
    next(err);
  }
};

const activateTwoFactor = async (req, res, next) => {
  const userId = req.userId;
  const enabledState = req.body.enabledState;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    user.twoFactorEnabled = enabledState;
    const savedUser = await user.save();

    res.status(201).json({
      message: "Two-factor authentication successfully activated.",
      userId: savedUser._id.toString(),
    });

  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("An user with this email could not be found.");
      err.statusCode = 404;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Wrong password.");
      err.statusCode = 401;
      throw err;
    }

    if (!user.twoFactorEnabled) {
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_KEY
      );
  
      // Set cookie in the browser to store authentication state
      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: process.env.DOMAIN,
      });
  
      res.status(201).json({
        message: "User successfully logged in.",
        twoFactorEnabled: false,
        token: token,
        userId: user._id.toString(),
      });
    }
    else {
      const activationToken = (await promisify(randomBytes)(20)).toString("hex");
      user.activationToken = activationToken;
      const savedUser = await user.save();

      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: savedUser.email,
        subject: "Confirm Your Two-Factor Authentication",
        html: emailConfirmationTemplate(savedUser.activationToken),
      });

      res.status(201).json({
        message: "Two-factor required! Check your inbox.",
        twoFactorEnabled: true,
        userId: savedUser._id.toString(),
      });
    }
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    const err = new Error("User is not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  res.clearCookie("token", { domain: process.env.DOMAIN });
  res.status(200).json({
    message: "User successfully logged out.",
    userId: userId,
  });
};

const getUser = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    res.status(200).json({
      message: "User successfully fetched.",
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      pages: user.pages,
      pictureUrl: user.pictureUrl,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.userId;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
      user.password = hashedPassword;
    }

    user.name = name;
    user.email = email;

    const savedUser = await user.save();

    res.status(201).json({
      message: "User successfully updated.",
      userId: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
    });
  } catch (err) {
    next(err);
  }
};

const getResetToken = async (req, res, next) => {
  const email = req.body.email;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("An user with this email could not be found.");
      err.statusCode = 404;
      throw err;
    }

    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    const savedUser = await user.save();

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: savedUser.email,
      subject: "Your Password Reset Token",
      html: resetPasswordTemplate(resetToken),
    });

    res.status(200).json({
      message: "Password Reset successfully requested! Check your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const resetToken = req.body.resetToken;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() - 2592000000 },
    });
    if (!user) {
      const err = new Error("The token is either invalid or expired.");
      err.statusCode = 422;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    const savedUser = await user.save();

    // Automatically sign in user after password reset
    const token = jwt.sign(
      { userId: savedUser._id.toString() },
      process.env.JWT_KEY
    );

    const maxAge = 2592000000; // 30 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: process.env.DOMAIN,
    });

    res.status(201).json({
      message: "Password successfully changed.",
      token: token,
      userId: savedUser._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

const activateAccount = async (req, res, next) => {
  const activationToken = req.params.token;

  try {
    const user = await User.findOne({
      activationToken: activationToken,
    });
    if (!user) {
      const err = new Error("The activation code is invalid.");
      err.statusCode = 422;
      throw err;
    }

    if (!user.active) {
      const payment = new Payment({
        plan: "Basic",
        email: user.email,
  });
  await payment.save();
  
      user.active = true;
      user.activationToken = null;
      const savedUser = await user.save();
  
      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: savedUser.email,
        subject: "Welcome to Krastie AI!",
        html: welcomeTemplate(savedUser.name),
      });
  
      res.status(302).redirect(`${process.env.FRONTEND_URL}/`);
    }
    else {

      user.activationToken = null;
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_KEY
      );
  
      // Set cookie in the browser to store authentication state
      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: process.env.DOMAIN,
      });
  
      res.status(302).redirect(`${process.env.FRONTEND_URL}/`);
    }
  } catch (err) {
    next(err);
  }
};

const googleOAuthCallback = async (req, res, next) => {

  const oauth2Client1 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const code = req.query.code;
  const {tokens} = await oauth2Client1.getToken(code)
   oauth2Client1.setCredentials(tokens);

   let oauth2 = google.oauth2({
    auth: oauth2Client1,
    version: 'v2'
  });
  let { data } = await oauth2.userinfo.get();

  const email = data.email;
  const name = data.name;
  const picture = data.picture;

 try {
  if (email && name) {
    const user = await User.findOne({ email: email });
    if (user) {
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_KEY
      );

      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: process.env.DOMAIN,
      });

      user.pictureUrl = picture;
      await user.save();

      res.status(302).redirect(`${process.env.FRONTEND_URL}/`);
    } else {

      const payment = new Payment({
        plan: "Basic",
        email: email,
  });
  await payment.save();

      const newUser = new User({
        email: email,
        name: name,
        active: true,
        pictureUrl: picture,
      });
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { userId: savedUser._id.toString() },
        process.env.JWT_KEY
      );

      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: process.env.DOMAIN,
      });

      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: savedUser.email,
        subject: "Welcome to Krastie AI!",
        html: welcomeTemplate(savedUser.name),
      });

      res.status(302).redirect(`${process.env.FRONTEND_URL}/`);
    }
  } else {
    const err = new Error("Google login failed.");
    err.statusCode = 401;
    throw err;
  }
}
catch (err) {
  next(err);
}
};

const googleAuth = async (req, res, next) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // generate a url that asks for consent
    const scopes =['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid']
    
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
    
      // If you only need one scope you can pass it as a string
      scope: scopes
    });
    res.status(200).json({
      message: "Google Auth URL successfully created.",
      url: url,
    });
  }
  catch (err) {
    next(err);
  }
};

const unsubscribe = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.unsubscribed = true;
      await user.save();
      res.status(200).json({
        message: "User successfully unsubscribed.",
      });
    }
  }
  catch (err) {
    next(err);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    user.delete();
    res.status(200).json({
      message: "User successfully deleted.",
    });
  }
  catch (err) {
    next(err);
  }
};
  

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.getResetToken = getResetToken;
exports.resetPassword = resetPassword;
exports.activateAccount = activateAccount;
exports.googleOAuthCallback = googleOAuthCallback;
exports.googleAuth = googleAuth;
exports.unsubscribe = unsubscribe;
exports.deleteUser = deleteUser;
exports.activateTwoFactor = activateTwoFactor;