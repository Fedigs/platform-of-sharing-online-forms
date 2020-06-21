const Réponse = require("./../models/RéponseModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllRéponses = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Réponse, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const réponses = await features.query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: réponses.length,
      data: { réponses }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createRéponse = async (req, res) => {
  try {
    const newRéponse = await Réponse.create(req.body).then();
    res.status(201).json({ status: "success", data: { réponse: newRéponse } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};
exports.getRéponse = async (req, res) => {
  try {
    console.log(req.params.id);
    const réponse = await Réponse.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { réponse }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.updateRéponse = async (req, res) => {
  try {
    const réponse = await Réponse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: { réponse }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
exports.deleteRéponse = async (req, res) => {
  try {
    await Réponse.findByIdAndDelete(req.params.id);
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
