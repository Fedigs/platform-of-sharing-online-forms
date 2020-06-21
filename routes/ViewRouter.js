const express = require("express");
const ViewController = require("../controllers/ViewController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.isLoggedIn);
router.get("/base", (req, res) => {
  res.status(200).render("base", {
    tour: "the forest heiker",
    user: "fedi"
  });
});
router.get("/overview", ViewController.getOverview);

router.get(
  "/questionnaires/:id",
  //authController.protect,
  ViewController.getQuestionnaire
);
router.get("/login", ViewController.getLoginForm);
router.get("/signup", ViewController.getSignupForm);
router.get("/repondre/:id", ViewController.postQuestionnaire);
router.get(
  "/newForm",
  authController.protect,
  authController.restrictTo("admin", "createur"),
  ViewController.postForm
);
router.get(
  "/questions",
  authController.protect,
  authController.restrictTo("admin", "createur"),
  ViewController.getQuestion
);
router.get(
  "/newQuestion",
  authController.protect,
  authController.restrictTo("admin", "createur"),
  ViewController.postQuestion
);
router.get(
  "/reponses/:id",
  authController.protect,
  authController.restrictTo("admin", "createur"),
  ViewController.getResponses
);
router.get(
  "/statistiques",
  authController.protect,
  authController.restrictTo("admin", "createur"),
  ViewController.getStatistiques
);

module.exports = router;
