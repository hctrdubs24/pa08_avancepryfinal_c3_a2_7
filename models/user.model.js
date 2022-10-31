const connection = require("../database/db");

module.exports = {
  async listUsers(req, res) {
    connection.query(
      "SELECT musuario.CvUser, musuario.CvPerso, CONCAT(cnombre.DsNombre, ' ', p.DsApellid, ' ', m.DsApellid) AS 'Nombre',  musuario.NomUser, musuario.Contrasena, DATE_FORMAT(musuario.FechaIni,'%Y-%m-%d') as fechainicio, DATE_FORMAT(musuario.FechaFin,'%Y-%m-%d') as fechafin, musuario.EdoCta FROM musuario INNER JOIN mperso ON musuario.CvPerso = mperso.CvPerso  INNER JOIN cnombre on mperso.CvNombre = cnombre.CvNombre INNER JOIN capellid AS p on mperso.CvApePat = p.CvApellid INNER JOIN capellid AS m on mperso.CvApeMat = m.CvApellid",
      async (error, results) => {
        req.session.usersArray = results;
        try {
          res.render("users", {
            users: results,
            login: true,
            tipoPersona: req.session.tipoPersona,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
  async selectUserToUpdate(req, res) {
    const CvUser = req.params.id;
    connection.query(
      "SELECT musuario.CvUser, CONCAT(cnombre.DsNombre, ' ', p.DsApellid, ' ', m.DsApellid) AS 'Nombre', musuario.CvPerso, musuario.NomUser, musuario.Contrasena, DATE_FORMAT(musuario.FechaIni,'%Y-%m-%d') as fechainicio, DATE_FORMAT(musuario.FechaFin,'%Y-%m-%d') as fechafin, musuario.EdoCta FROM musuario INNER JOIN mperso ON musuario.CvPerso = mperso.CvPerso INNER JOIN cnombre on mperso.CvNombre = cnombre.CvNombre INNER JOIN capellid AS p on mperso.CvApePat = p.CvApellid INNER JOIN capellid AS m on mperso.CvApeMat = m.CvApellid WHERE CvUser = ?",
      [CvUser],
      (error, results) => {
        try {
          res.render("edit", {
            login: true,
            tipoPersona: req.session.tipoPersona,
            userToUpdate: results[0],
          });
          // res.send({ user: results[0] });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
  async updateState(user) {
    connection.query(
      "UPDATE musuario SET EdoCta = '0' WHERE NomUser = ?",
      [user],
      async (error, results) => {
        return;
      }
    );
  },
  async login(user, password, req, res) {
    connection.query(
      "SELECT musuario.CvUser, musuario.CvPerso, musuario.NomUser, musuario.Contrasena, DATE_FORMAT(musuario.FechaIni,'%Y-%m-%d') as fechainicio, DATE_FORMAT(musuario.FechaFin,'%Y-%m-%d') as fechafin, musuario.EdoCta, mperso.CvTipoPerso FROM musuario INNER JOIN mperso ON mperso.CvPerso = musuario.CvPerso INNER JOIN ctipoperso ON ctipoperso.CvTipoPerso = mperso.CvTipoPerso WHERE musuario.NomUser = ?",
      [user],
      async (err, results) => {
        if (results.length == 0) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "El usuario no existe",
            alertIcon: "Error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
          });
        } else {
          if (results[0].EdoCta === 0) {
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "La cuenta se encuentra inactiva",
              alertIcon: "Error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            let today = new Date(),
              dd = String(today.getDate()).padStart(2, "0"),
              mm = String(today.getMonth() + 1).padStart(2, "0"),
              yyyy = today.getFullYear();
            (today = `${yyyy}-${mm}-${dd}`),
              (todayCom = new Date(today)),
              (fechafinCom = new Date(results[0].fechafin)),
              (fechainiCom = new Date(results[0].fechainicio));

            if (fechainiCom <= todayCom && fechafinCom >= todayCom) {
              if (password != results[0].Contrasena) {
                res.render("login", {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "Contraseña incorrecta",
                  alertIcon: "Error",
                  showConfirmButton: true,
                  timer: false,
                  ruta: "login",
                });
              } else {
                req.session.loggedin = true;
                req.session.name = results[0].NomUser;
                req.session.password = results[0].Contrasena;
                req.session.tipoPersona = results[0].CvTipoPerso;
                res.render("login", {
                  alert: false,
                  alertTitle: "Conexión exitosa",
                  alertMessage: "Bienvenido al sistema",
                  alertIcon: "Success",
                  showConfirmButton: false,
                  timer: 1,
                  ruta: "",
                });
              }
            } else if (fechafinCom <= todayCom) {
              this.updateState(user);
              res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage:
                  "La cuenta ya alcanzó el límite de tiempo de actividad",
                alertIcon: "Error",
                showConfirmButton: true,
                timer: false,
                ruta: "login",
              });
            } else if (fechainiCom >= todayCom) {
              res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage:
                  "La cuenta aún no está activada, contacte al administrador",
                alertIcon: "Error",
                showConfirmButton: true,
                timer: false,
                ruta: "login",
              });
            }
          }
        }
      }
    );
  },
  async updatePassword(req, res, user, oldPassword, newPassword) {
    connection.query(
      "UPDATE musuario SET Contrasena = ? WHERE NomUser = ? AND Contrasena = ?",
      [newPassword, user, oldPassword],
      async (error, results) => {
        res.render("password", {
          alert: true,
          alertTitle: "Actualización exitosa",
          alertMessage: "Actualización de la contraseña realizada exitosamente",
          alertIcon: "Success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "password",
          login: true,
          tipoPersona: req.session.tipoPersona,
          password: newPassword,
          name: req.session.user,
        });
      }
    );
  },
  async listCvPerson(req, res) {
    connection.query(
      "SELECT mperso.CvPerso, CONCAT(cnombre.DsNombre, ' ', p.DsApellid, ' ', m.DsApellid) AS 'Nombre'  FROM mperso INNER JOIN cnombre on mperso.CvNombre = cnombre.CvNombre INNER JOIN capellid AS p on mperso.CvApePat = p.CvApellid INNER JOIN capellid AS m on mperso.CvApeMat = m.CvApellid;",
      async (error, results) => {
        try {
          req.session.cvperso = results;
          res.render("new", {
            login: true,
            tipoPersona: req.session.tipoPersona,
            cvperso: results,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
  async createNewUser(req, res, data) {
    connection.query(
      "INSERT INTO musuario (CvPerso, NomUser, Contrasena, FechaIni, FechaFin, EdoCta) VALUES (?,?,?,?,?,?)",
      [data[0], data[1], data[2], data[3], data[4], data[5]],
      async (error, results) => {
        try {
          res.render("new", {
            alert: true,
            alertTitle: "Creación de usuarios",
            alertMessage: "El usuario se ha guardado exitosamente",
            alertIcon: "Success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "users",
            login: true,
            tipoPersona: req.session.tipoPersona,
            cvperso: req.session.cvperso,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
  async updateUser(req, res, data) {
    connection.query(
      "UPDATE musuario SET NomUser = ?, Contrasena = ?, FechaIni = ?, FechaFin = ?, EdoCta = ? WHERE CvUser = ?",
      [data[2], data[3], data[4], data[5], data[6], data[0]],
      async (error, results) => {
        try {
          res.render("edit", {
            alert: true,
            alertTitle: "Usuario actualizado",
            alertMessage: "El usuario se ha actualizado exitosamente",
            alertIcon: "Success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "users",
            login: true,
            tipoPersona: req.session.tipoPersona,
            password: req.session.password,
            name: req.session.user,
            userToUpdate: req.session.userToUpdate,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
  async deleteUser(req, res, id) {
    connection.query(
      "DELETE FROM musuario WHERE CvUser = ?",
      [id],
      async (error, results) => {
        try {
          res.render("users", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario eliminado exitosamente",
            alertIcon: "Error",
            showConfirmButton: true,
            timer: false,
            ruta: "users",
            login: true,
            users: req.session.usersArray,
            tipoPersona: req.session.tipoPersona,
            password: req.session.password,
            name: req.session.user,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  },
};
