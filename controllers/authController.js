const jwt = require("jsonwebtoken");
const User = require("./../models/UserModel");
const { promisify } = require("util");
const fs = require("fs");

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //store token on the cookie browser
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    //envoyer le token au client
    token,
    data: {
      user: user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    var imagedata = req.body.photo;
    fs.writeFile(
      "/img/users/" + req.body.name + ".png",
      imagedata,
      "binary",
      function(err) {
        console.log("The file was saved!");
      }
    );
    const newUser = await User.create(req.body);
    //create a new token
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //1)check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password !"
      });
    }
    //2)check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "error",
        message: "incorrect email or password !"
      });
    }

    //3)if everything is ok ,send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: "success" });
};
exports.protect = async (req, res, next) => {
  try {
    let token;
    //console.log(req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      //console.log(token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in ! Please log in to get access"
      });
    }

    //2)verfication token valide ou pas
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decode);

    //3) check if user still exists
    const currentUser = await User.findById(decode.id);

    if (currentUser == null) {
      return res.status(401).json({
        status: "error",
        message: "The User belonging to this token does no longer exist"
      });
    }
    //4)check if user changed password after the token issued
    /*console.log(currentUser.changePasswordAfter(decode.iat));
    if (currentUser.changePasswordAfter(decode.iat)) {
      return res.status(401).json({
        status: "error",
        message: "User recently changed password ! Please log in again"
      });
    }*/

    //Access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.status(401).json({
        status: "fail",
        message: "Your token has expired! Please log in again"
      });
    } else if (err.name == "JsonWebTokenError") {
      /*res.status(401).json({
        status: "fail",
        message: "Invalid token, please login again"
      });*/
      return next();
    } else {
      res.status(401).json({ status: "fail", message: err });
    }
  }
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      /*// 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }*/
      //console.log(currentUser);

      // THERE IS A LOGGED IN USER
      //passing data to any pug template
      res.locals.user = currentUser;

      //return currentUser;
      //console.log(res.locals.user);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "you do not permission to perform this"
      });
    }
    next();
  };
};
exports.forgotPassword = async (req, res, next) => {
  try {
    //1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with email address."
      });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
  next();
};
exports.getCurrentUser = (req, res, next) => {
  //console.log(res.locals.user)
  console.log("getCurrent");
};

exports.resetPassword = (req, res, next) => {};
