const Questionnaire = require("./../models/QuestionnaireModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAllQuestionnaires = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Questionnaire, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const questionnaires = await features.query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: questionnaires.length,
      data: { questionnaires }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createQuestionnaire = async (req, res) => {
  try {
    const newQuestionnaire = await Questionnaire.create(req.body).then();
    res
      .status(201)
      .json({ status: "success", data: { questionnaire: newQuestionnaire } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};
exports.getQuestionnaire = async (req, res) => {
  try {
    console.log(req.params.id);
    const questionnaire = await Questionnaire.findById(req.params.id)
      .populate
      // "questions"
      ();
    if (!questionnaire) {
      return next(new AppError("There is no form with that id.", 404));
    }
    res.status(200).json({
      status: "success",
      data: { questionnaire }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.updateQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    res.status(200).json({
      status: "success",
      data: { questionnaire }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.deleteQuestionnaire = async (req, res) => {
  try {
    await Questionnaire.findByIdAndDelete(req.params.id);
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
