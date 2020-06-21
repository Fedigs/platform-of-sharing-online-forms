const express = require("express");
const QuestionnaireController = require("./../controllers/QuestionnaireController");
const router = express.Router();
const authController = require("./../controllers/authController");
router
  .route("/")
  .get(
    /*authController.protect,
    authController.restrictTo("admin", "createur"),*/
    QuestionnaireController.getAllQuestionnaires
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "createur"),
    QuestionnaireController.createQuestionnaire
  );

router
  .route("/:id")
  .get(
    /*authController.protect,
    authController.restrictTo("admin", "createur"),*/
    QuestionnaireController.getQuestionnaire
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "createur"),
    QuestionnaireController.updateQuestionnaire
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "createur"),
    QuestionnaireController.deleteQuestionnaire
  );
module.exports = router;
