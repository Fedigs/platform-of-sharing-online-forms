/* eslint-disable */

const newForm = async (titre, description, questions, difficulty, user) => {
  //console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/forms/questionnaires",
      data: {
        titre,
        description,
        questions,
        difficulty,
        user
      }
    });
    //console.log(res.data);
    if (res.data.status === "success") {
      console.log("envoyé par succés");
      

      window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data);
  }
};
document.querySelector(".newForm").addEventListener("submit", e => {
  e.preventDefault();
  const questions = JSON.parse(document.getElementById("questions").value);
  const user = JSON.parse(document.getElementById("user").value);
  const titre = document.getElementById("titre").value;
  const description = document.getElementById("description").value;
  const difficultyEasy = document.getElementById("easy");
  const difficultyHard = document.getElementById("hard");
  let difficulty = "";
  if (difficultyEasy.checked == true) {
    difficulty = difficultyEasy.value;
  } else if (difficultyHard.checked == true) {
    difficulty = difficultyHard.value;
  }

  let SelectedQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var check = document.getElementById(questions[i]._id);
    if (check.checked == true) {
      //console.log(questions[i]._id);
      SelectedQuestions.push(questions[i]._id);
    }
  }
  newForm(titre, description, SelectedQuestions, difficulty, user._id);
});
