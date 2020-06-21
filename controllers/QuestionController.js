const Question = require("./../models/QuestionModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAllQuestions = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Question, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const questions = await features.query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: questions.length,
      data: { questions }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body).then();
    res
      .status(201)
      .json({ status: "success", data: { question: newQuestion } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};
exports.getQuestion = async (req, res) => {
  try {
    console.log(req.params.id);
    const question = await Question.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { question }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: { question }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
