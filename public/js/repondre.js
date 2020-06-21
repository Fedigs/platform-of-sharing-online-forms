/* eslint-disable */
const repondre = async (
  type,
  réponseLibre,
  réponseChoix,
  question,
  questionnaire
) => {
  //console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/forms/reponses",
      data: {
        type,
        réponseChoix,
        réponseLibre,
        question,
        questionnaire
      }
    });
    //console.log(res.data);
    //if (res.data.status === "success") {

    /*window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);*/
    //}
  } catch (err) {
    console.log(err.response.data);
  }
};

document.querySelector(".repondre").addEventListener("submit", e => {
  e.preventDefault();
  const questionnaire = JSON.parse(
    document.getElementById("questionnaire").value
  );
  let questionnaireId = questionnaire._id;
  console.log(questionnaireId);
  const questions = JSON.parse(document.getElementById("questions").value);

  let réponseLibre = "";
  let réponseChoix = [];
  let questionId = "";
  let type = "";

  for (let i = 0; i < questions.length; i++) {
    questionId = questions[i]._id;
    if (questions[i].type == "libre") {
      type = "libre";
      réponseLibre = document.getElementById(questions[i]._id).value;
      réponseChoix = [];
    } else if (questions[i].type == "multiple") {
      //console.log("multiple");
      type = "multiple";
      for (let j = 0; j < questions[i].choix.length; j++) {
        var check = document.getElementById(questions[i].choix[j]._id);
        if (check.checked == true) {
          //console.log(check.value);
          réponseChoix.push({ titre: check.value, valeur: check.value });
          réponseLibre = "";
        }
      }
    }
    repondre(
      type,
      réponseLibre,
      réponseChoix,
      questionId,
      questionnaireId,
      questions.length
    );
  }
  alert("envoyé par succés!");
});
