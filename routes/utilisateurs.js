const express = require('express');
const mongoose = require('mongoose');
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

// Inscription POST
router.post('/inscription', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Votre mot de passe est non conforme' });
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

module.exports = router;