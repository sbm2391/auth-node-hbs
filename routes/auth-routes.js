const User = require("../models/User");
const express = require("express");
const authRoutes = express.Router();
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// vista del sign up
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // si hay campos vacios no guarda
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
 // si ya existe el usuario no guarda
 User.findOne({ "username": username },"username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const newUser  = User({
      username,
      password: hashPass
    });
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/");
      }
    });
  })

})

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password
  // validación de campos no vacios
  if(username === "") {
    res.render("auth/login", {
      errorMessage: "No escribiste nada en el nombre de usuario"
    });
    return;
  } 
  if (password === "") {
    res.render("auth/login", {
      errorMessage: "No escribiste nada en la contraseña"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {

    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    // comparando passwords
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/secret");
    } else {
      res.render("auth/login", {
        errorMessage: "Tu contraseña es incorrecta"
      });
      return;
    }
  });
})

// destruir la sesión
authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = authRoutes;