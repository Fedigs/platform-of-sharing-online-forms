const mongoose = require("mongoose");

//création Schema

const QuestionnaireSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Un questionnaire doit avoir un titre !"],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, "Un questionnaire doit avoir une description !"],
    trim: true
  },
  questions: [{ type: mongoose.Schema.ObjectId, ref: "Question" }],
  difficulty: String,
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});
//création model
const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
module.exports = Questionnaire;
