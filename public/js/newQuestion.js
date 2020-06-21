/* eslint-disable */
function ajouterOption() {
  const opt = document.getElementById("ajouterOpt").value;
  document.getElementById("opt").innerHTML +=
    "<input class='form__input option' type='checkbox' name='option' value='" +
    opt +
    "' /><label class='form__label' for='" +
    opt +
    "'</label>" +
    opt;
}
function myFunction(type) {
  //const type = document.getElementById("type");
  const Elquestion = document.getElementById("qt");
  if (type == "libre") {
    Elquestion.innerHTML = "";
  } else {
    Elquestion.innerHTML =
      "<label class='form__label' for='option'>Option" +
      "<input class='form__input' id='ajouterOpt' type='text' placeholder='valeur de l option ' required='required'/>" +
      "</label>" +
      "<input type='button' value='Ajouter une option' onclick='ajouterOption()'></input>";
  }
}
const newQuestion = async (titre, type, contenu, choix) => {
  //console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/forms/questions",
      data: {
        titre,
        type,
        contenu,
        choix
      }
    });
    //console.log(res.data);
    if (res.data.status === "success") {
      console.log("creé par succés");

      window.setTimeout(() => {
        location.assign("/questions");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};
document.querySelector(".newQuestion").addEventListener("submit", e => {
  e.preventDefault();
  let choix = [];
  const titre = document.getElementById("titre").value;
  const contenu = document.getElementById("contenu").value;
  let type = "";
  const typeLibre = document.getElementById("libre");
  if (typeLibre.checked == true) {
    type = "libre";
  } else {
    type = "multiple";
  }
  const options = document.getElementsByClassName("option");

  for (let i = 0; i < options.length; i++) {
    choix.push({
      titre: options[i].attributes.value.value,
      valeur: options[i].attributes.value.value
    });
  }
  //console.log(titre, type, contenu, choix);
  newQuestion(titre, type, contenu, choix);
});
