const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// Post Model
require('../models/Utilisateur');
const Utilisateur = mongoose.model('utilisateurs');

// Login
router.get('/login', (req,res) => {
  res.render('utilisateurs/login');
});

// Inscription
router.get('/inscription', (req,res) => {
  res.render('utilisateurs/inscription');
});

// Login Post
router.post('/login',(req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/utilisateurs/login'
  })(req, res, next);
});

// Inscription POST
router.post('/inscription', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Mot de passe non identique' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Votre mot de passe doit contenir 4 caractère minimun' });
  }

  if (errors.length > 0) {
    res.render('utilisateurs/inscription', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUtilisateur = new Utilisateur ({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    newUtilisateur.save()
    .then(utilisateur => {
      res.redirect('/utilisateurs/login')
    })
  }
});

// Déconnexion
router.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/')
})

module.exports = router;