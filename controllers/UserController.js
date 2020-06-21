const User = require("./../models/UserModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: users.length,
      data: { users }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined !"
  });
};
exports.getUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined !"
  });
};
exports.updateUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined !"
  });
};
exports.deleteUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined !"
  });
};
