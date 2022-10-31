const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/authController");

// Router para las vistas
router.get("/", authController.renderIndex);
router.get("/login", authController.renderLogin);
router.get("/password", authController.renderPassword);
router.get("/users", authController.renderUserTable);
router.get("/new", authController.renderNewUserForm);
router.get("/edit/:id", authController.renderEditUserForm);
router.get("/delete/:id", authController.delete);

// Cerrar sesión
router.get("/logout", authController.logout);

// Router para autenticación de usuarios
router.post("/auth", authController.login);
router.post("/password", authController.updatePassword);
router.post("/new-user", authController.createUser);
router.post("/update-user", authController.updateUser);

module.exports = router;
