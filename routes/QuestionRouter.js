const express = require("express");
const QuestionController = require("./../controllers/QuestionController");
const router = express.Router();

router
  .route("/")
  .get(QuestionController.getAllQuestions)
  .post(QuestionController.createQuestion);
router
  .route("/:id")
  .get(QuestionController.getQuestion)
  .patch(QuestionController.updateQuestion)
  .delete(QuestionController.deleteQuestion);
module.exports = router;
