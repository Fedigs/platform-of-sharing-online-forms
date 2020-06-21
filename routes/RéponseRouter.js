const express = require("express");
const RéponseController = require("./../controllers/RéponseController");
const router = express.Router();

router
  .route("/")
  .get(RéponseController.getAllRéponses)
  .post(RéponseController.createRéponse);
router
  .route("/:id")
  .get(RéponseController.getRéponse)
  .patch(RéponseController.updateRéponse)
  .delete(RéponseController.deleteRéponse);
module.exports = router;
