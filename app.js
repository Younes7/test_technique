const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Routes
const posts = require('./routes/posts');
const utilisateurs = require('./routes/utilisateurs');

// Config passport
require('./config/passport')(passport);

// Config Database
const db = require('./config/database');

// Connection Mongoose
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('connecter à MongoDB...'))
  .catch(err => console.log(err));

// Post Model
require('./models/Post');
const Post = mongoose.model('posts');

// Middleware Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Middleware Body-Parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Middleware Method-Override
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'younes',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Route Index
app.get('/', (req, res) => {
  Post.find({})
    .sort({ date: 'desc' })
    .then(posts => {
      res.render('index', {
        posts: posts
      });
    });

});

// Route Posts
app.get('/posts', (req, res) => {
  Post.find({})
    .sort({ date:'desc' })
    .then(posts => {
     res.render('posts', {
      posts: posts
     });
  });
});

// Route Ajouter
app.get('/posts/add', (req, res) => {
  res.render('posts/add');
});

// Route Edit
app.get('/posts/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      res.render('posts/edit', {
        post: post
      });
    });
});

// Route Ajouter post
app.post('/posts', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({ text: 'Ajoutez un titre' })
  }
  if (!req.body.content) {
    errors.push({ text: 'Ajoutez le contenu' })
  }
  if(errors.length > 0){
    res.render('posts/add', {
      errors: errors,
      title : req.body.title,
      content : req.body.content
    });
  } else {
    const newUtilisateur = {
      title: req.body.title,
      content : req.body.content
    }
    new Post(newUtilisateur)
      .save()
      .then(post => {
        res.redirect('/posts')
      })
    }
  });

// Route Edit Post
app.put('/posts/:id', (req,res) => {
  Post.findOne({
    _id: req.params.id
  })
  .then(post => {
    post.title = req.body.title;
    post.content = req.body.content;

    post.save()
      .then(post => {
        res.redirect('/posts');
      });
  });
});

// Supprimer Post
app.delete('/posts/:id', (req, res) => {
  Post.remove({ _id: req.params.id })
  .then(() => {
    res.redirect('/posts');
  });

});

app.use('/posts', posts);
app.use('/utilisateurs', utilisateurs);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`écoute sur le port: ${port}`);
});