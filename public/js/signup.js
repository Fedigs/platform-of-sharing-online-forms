/* eslint-disable */
const signup = async (name, email, role, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/forms/users/signup",
      data: {
        name,
        email,
        role,
        password,
        passwordConfirm
      }
    });
    //console.log(res.data);
    if (res.data.status === "success") {
      alert("Signup successfully!");
      window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
  }
};

document.querySelector(".signup").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const role = "createur";
  //const photo = "default.jpg";
  //console.log(name, email, role, photo, password, passwordConfirm);
  signup(name, email, role, password, passwordConfirm);
});
