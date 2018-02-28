const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Post Model
require('../models/Post');
const Post = mongoose.model('posts');

// Route Posts
router.get('/', (req, res) => {
  Post.find({})
    .sort({ date: 'desc' })
    .then(posts => {
      res.render('posts', {
        posts: posts
      });
    });
});

// Route Ajouter 
router.get('/add', (req, res) => {
  res.render('posts/add');
});

// Route Edit 
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Ajoutez un titre' })
  }
  if (!req.body.content) {
    errors.push({ text: 'Ajoutez le contenu' })
  }
  if (errors.length > 0) {
    res.render('posts/add', {
      errors: errors,
      title: req.body.title,
      content: req.body.content
    });
  } else {
    const newUtilisateur = {
      title: req.body.title,
      content: req.body.content
    }
    new Post(newUtilisateur)
      .save()
      .then(post => {
        res.redirect('/posts')
      })
  }
});

// Route Edit Post
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Post.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/posts');
    });
});

module.exports = router;