var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//require product model
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', function(req, res, next) {
  Product.find(function (err, docs) {
      //build product array with chunkSize per row
      var productsChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productsChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', products: productsChunks });
  });
});

router.get('/user/signup',function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages});
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages});
});

router.post('/user/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.get('/user/profile', function (req, res, next) {
    res.render('user/profile');
});

module.exports = router;
