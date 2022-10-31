const model = require("../models/user.model");

exports.renderIndex = async (req, res) => {
  if (req.session.loggedin) {
    res.render("index", {
      login: true,
      name: req.session.name,
      tipoPersona: req.session.tipoPersona,
    });
  } else {
    res.render("index", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
};

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.renderPassword = async (req, res) => {
  if (req.session.loggedin) {
    res.render("password", {
      login: true,
      tipoPersona: req.session.tipoPersona,
      name: req.session.name,
      password: req.session.password,
    });
  } else {
    res.render("password", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
};

exports.delete = async (req, res) => {
  model.deleteUser(req,res,req.params.id)
};

exports.renderUserTable = async (req, res) => {
  model.listUsers(req, res);
};

exports.renderNewUserForm = async (req, res) => {
  model.listCvPerson(req, res);
};

exports.renderEditUserForm = async (req, res) => {
  model.selectUserToUpdate(req, res);
};

exports.login = async (req, res) => {
  try {
    const user = req.body.user,
      password = req.body.pass;
    if (user && password) {
      model.login(user, password, req, res);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const newPassword = req.body.newPass,
      confirmNewPassword = req.body.confirmNewPass,
      oldPassword = req.body.oldPass;
    if (newPassword === confirmNewPassword) {
      if (oldPassword === confirmNewPassword) {
        res.render("password", {
          alert: true,
          alertTitle: "Error",
          alertMessage:
            "La nueva contraseña y la anterior contraseña coinciden, debe elegir una contraseña nueva",
          alertIcon: "Error",
          showConfirmButton: true,
          timer: false,
          ruta: "password",
          login: true,
          tipoPersona: req.session.tipoPersona,
          password: req.session.password,
          name: req.session.user,
        });
      } else {
        model.updatePassword(
          req,
          res,
          req.session.name,
          req.session.password,
          newPassword
        );
      }
    } else {
      res.render("password", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "La nueva contraseña y la confirmación no coinciden",
        alertIcon: "Error",
        showConfirmButton: true,
        timer: false,
        ruta: "password",
        login: true,
        tipoPersona: req.session.tipoPersona,
        password: req.session.password,
        name: req.session.user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = async (req, res) => {
  let newUserEdoCta = 0;
  if (req.body.stateNewUser === "on") newUserEdoCta = 1;

  if (
    !req.body.CvPersonNewUser ||
    !req.body.loginNewUser ||
    !req.body.passwordNewUser ||
    !req.body.inicioNewUser ||
    !req.body.finNewUser
  ) {
    res.render("new", {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Por favor llene todos los campos",
      alertIcon: "Error",
      showConfirmButton: true,
      timer: false,
      ruta: "new",
      login: true,
      tipoPersona: req.session.tipoPersona,
      password: req.session.password,
      name: req.session.user,
      cvperso: req.session.cvperso,
    });
  } else {
    const data = [
      req.body.CvPersonNewUser,
      req.body.loginNewUser,
      req.body.passwordNewUser,
      req.body.inicioNewUser,
      req.body.finNewUser,
      newUserEdoCta,
    ];
    model.createNewUser(req, res, data);
  }
};

exports.updateUser = async (req, res) => {
  let userUpdateEdoCta = 0;
  if (req.body.stateUserUpdate === "on") userUpdateEdoCta = 1;

  if (
    !req.body.CvPersonUserUpdate ||
    !req.body.loginUserUpdate ||
    !req.body.passwordUserUpdate ||
    !req.body.inicioUserUpdate ||
    !req.body.finUserUpdate
  ) {
    res.render("edit", {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Por favor llene todos los campos",
      alertIcon: "Error",
      showConfirmButton: true,
      timer: false,
      ruta: `edit/${req.body.CvUserUpdate}`,
      login: true,
      tipoPersona: req.session.tipoPersona,
      password: req.session.password,
      name: req.session.user,
      userToUpdate: req.session.userToUpdate,
    });
  } else {
    const data = [
      req.body.CvUserUpdate,
      req.body.CvPersonUserUpdate,
      req.body.loginUserUpdate,
      req.body.passwordUserUpdate,
      req.body.inicioUserUpdate,
      req.body.finUserUpdate,
      userUpdateEdoCta,
    ];
    model.updateUser(req, res, data);
  }
};
