const togglePassword = document.querySelector("#togglePassword"),
  password = document.querySelector("#password"),
  togglePassword1 = document.querySelector("#togglePassword1"),
  password1 = document.querySelector("#password1"),
  togglePassword2 = document.querySelector("#togglePassword2"),
  password2 = document.querySelector("#password2");

togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("bi-eye");
});

togglePassword1.addEventListener("click", function (e) {
  const type =
    password1.getAttribute("type") === "password" ? "text" : "password";
  password1.setAttribute("type", type);
  this.classList.toggle("bi-eye");
});

togglePassword2.addEventListener("click", function (e) {
  const type =
    password2.getAttribute("type") === "password" ? "text" : "password";
  password2.setAttribute("type", type);
  this.classList.toggle("bi-eye");
});
