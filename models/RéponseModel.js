const mongoose = require("mongoose");
//création Schema
const RéponseChoixSchema = new mongoose.Schema({
  titre: String,
  valeur: String
});
const RéponseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["libre", "multiple"],
    default: "libre"
  },
  réponseChoix: [RéponseChoixSchema],
  réponseLibre: String,
  question: {
    type: mongoose.Schema.ObjectId,
    ref: "Question",
    required: [true, "Une réponse doit avoir une question !"]
  },
  questionnaire: {
    type: mongoose.Schema.ObjectId,
    ref: "Questionnaire",
    required: [true, "Une réponse doit avoir un questionnaire !"]
  }
});

//création model
const Réponse = mongoose.model("Réponse", RéponseSchema);
module.exports = Réponse;
