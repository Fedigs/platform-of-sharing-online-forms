/* eslint-disable */
function closeMessage(close) {
  var i;

  // Loop through all close buttons
  for (i = 0; i < close.length; i++) {
    // When someone clicks on a close button
    close[i].onclick = function() {
      // Get the parent of <span class="closebtn"> (<div class="alert">)
      var div = this.parentElement;

      // Set the opacity of div to 0 (transparent)
      div.style.opacity = "0";

      // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
      setTimeout(function() {
        div.style.display = "none";
      }, 600);
    };
  }
}
const login = async (email, password) => {
  //console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/forms/users/login",
      data: {
        email,
        password
      }
    });
    //console.log(res.data);
    if (res.data.status === "success") {
      let message = "Logged in successfully";
      document.getElementById("message").innerHTML =
        "<div class='alertS'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span> <strong>Success</strong>" +
        message +
        "</div>";
      //alert("Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);
    } else {
    }
  } catch (err) {
    document.getElementById("message").innerHTML =
      "<div class='alertE'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span> <strong>Danger!</strong> Indicates a dangerous or potentially negative action.</div>";
    /* document.getElementById("message").innerHTML = "<span class='red'>" + err.response.data.message + "</span>";
    console.log(err.response);*/
    var close = document.getElementsByClassName("closebtn");
    closeMessage(close);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/forms/users/logout"
    });
    if ((res.data.status = "success"))
      //location.reload(true);
      window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};

document.querySelector(".form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
