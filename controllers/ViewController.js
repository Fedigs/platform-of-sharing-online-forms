const Questionnaire = require("../models/QuestionnaireModel");
const Question = require("../models/QuestionModel");
const Réponse = require("../models/RéponseModel");
var mongoose = require("mongoose");
exports.getOverview = async (req, res, next) => {
  try {
    //1) Get questionnaires data from collection
    const questionnaires = await Questionnaire.find();
    res.status(200).render("overview", {
      title: "allQuestionnaires",
      questionnaires
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
    next();
  }

  //2) Build template
  //3) Render that template using questionnaires data from step 1
};

exports.getQuestionnaire = async (req, res, next) => {
  try {
    //Get questionnaires data from collection
    const questionnaire = await Questionnaire.findById(req.params.id);
    res.status(200).render("questionnaire", {
      title: questionnaire.titre,
      questionnaire
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.getLoginForm = async (req, res, next) => {
  try {
    res.status(200).render("login", {
      title: "Log into your account"
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.getSignupForm = async (req, res, next) => {
  try {
    res.status(200).render("signup", {
      title: "Signup into your account"
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.postQuestionnaire = async (req, res, next) => {
  try {
    //Get questionnaires data from collection
    const questionnaire = await Questionnaire.findById(req.params.id);
    const Myarray = [];
    if (questionnaire) {
      const idQuestions = questionnaire.questions;
      for (let i = 0; i < idQuestions.length; i++) {
        const question = await Question.findById(idQuestions[i]);
        Myarray.push(question);
      }
    }
    res.status(200).render("repondre", {
      title: questionnaire.titre,
      questionnaire,
      questions: Myarray
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.postForm = async (req, res, next) => {
  const questions = await Question.find();
  try {
    res.status(200).render("newForm", {
      title: "create a new form",
      questions
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.getQuestion = async (req, res, next) => {
  const questions = await Question.find();
  try {
    res.status(200).render("questions", {
      title: "Questions",
      questions
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};

exports.postQuestion = async (req, res, next) => {
  try {
    res.status(200).render("newQuestion", {
      title: "create a new Question"
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
exports.getResponses = async (req, res, next) => {
  const réponses = await Réponse.find();

  try {
    //Get questionnaires data from collection
    const questionnaire = await Questionnaire.findById(req.params.id);
    const Myarray = [];
    const QuestionEtReponse = [];
    if (questionnaire) {
      const idQuestions = questionnaire.questions;
      for (let i = 0; i < idQuestions.length; i++) {
        const question = await Question.findById(idQuestions[i]);
        Myarray.push(question);
      }
    }

    if (réponses) {
      for (let i = 0; i < réponses.length; i++) {
        for (let j = 0; j < Myarray.length; j++) {
          if (
            réponses[i].question.equals(Myarray[j]._id) &&
            réponses[i].questionnaire.equals(req.params.id)
          ) {
            QuestionEtReponse.push({
              question: Myarray[j],
              réponse: réponses[i]
            });
          }
        }
      }
    }
    //console.log(QuestionEtReponse);
    tab = [];
    for (let i = 0; i < QuestionEtReponse.length; i++) {
      if (QuestionEtReponse[i].question.type == "multiple") {
        const aggregatorOpts = [
          {
            $match: {
              question: mongoose.Types.ObjectId(
                QuestionEtReponse[i].question._id
              ),
              questionnaire: mongoose.Types.ObjectId(
                QuestionEtReponse[i].réponse.questionnaire
              )
            }
          },
          {
            $unwind: "$réponseChoix"
          },

          {
            $group: {
              _id: "$réponseChoix.valeur",
              count: { $sum: 1 }
            }
          }
        ];

        const tab2 = await Réponse.aggregate(aggregatorOpts);
        tab.push({
          contenu: QuestionEtReponse[i].question.contenu,
          stat: tab2
        });
      }
    }
    //console.log(tab);
    label = [];
    data = [];
    contenu = [];
    finalTab = [];
    for (let i = 0; i < tab.length; i++) {
      for (let j = 0; j < tab[i].stat.length; j++) {
        label.push(tab[i].stat[j]._id);
        data.push(tab[i].stat[j].count);
      }
      finalTab.push({ contenu: tab[i].contenu, label: label, data: data });
      contenu = [];
      label = [];
      data = [];
    }

    //console.log(finalTab);
    var tab = JSON.stringify(finalTab);

    res.status(200).render("reponses", {
      title: "Show responses",
      QuestionEtReponse,
      tab
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};

exports.getStatistiques = async (req, res, next) => {
  const réponses = await Réponse.find();
  const questionnaires = await Questionnaire.find();
  const questions = await Question.find();
  try {
    const nbQuestionnaires = questionnaires.length;
    const nbQuestions = questions.length;
    const nbRéponses = réponses.length;
    //console.log(nbQuestionnaires, " ", nbQuestions, " ", nbRéponses);
    const nbQestionsParQuestionnaires = [];
    let nb = 0;

    for (let i = 0; i < nbQuestionnaires; i++) {
      nbQestionsParQuestionnaires.push({
        titre: questionnaires[i].titre,
        nbquest: questionnaires[i].questions.length
      });
    }

    /*for(let i=0;i<réponses.length; i++){

      if(réponses[i].type=="multiple"){

      }
    }*/
    res.status(200).render("statistiques", {
      title: "statistiques",
      nbQuestionnaires,
      nbQuestions,
      nbRéponses,
      nbQestionsParQuestionnaires
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  next();
};
