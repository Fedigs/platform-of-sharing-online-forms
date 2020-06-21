const mongoose = require("mongoose");
//création Schema
const QuestionChoixSchema = new mongoose.Schema({
  titre: String,
  valeur: String
});
const QuestionSchema = new mongoose.Schema({
  titre: String,
  type: {
    type: String,
    enum: ["libre", "multiple"],
    default: "libre"
  },
  contenu: String,
  choix: [QuestionChoixSchema]
  /*réponse: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Réponse"
    }
  ]*/
});

//création model
const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
