const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

// Revisar si existe una sesión
router.use((req, res, next)=> {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect("/")
  }
});

router.get("/secret", (req, res, next) => {
  res.render("secret");
});


module.exports = router;