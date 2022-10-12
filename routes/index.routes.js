const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/authController");

// Router para las vistas
router.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("index", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

// Router para controlador
router.post("/auth", authController.login);

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
