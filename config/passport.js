const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Utilisateur Model
const Utilisateur = mongoose.model('utilisateurs');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done) => {
    Utilisateur.findOne({
      email:email
    }).then(user => {
      console.log(email)
      if(!user){
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Utilisateur.findById(id, function(err, user) {
      done(err, user);
    });
  });

}