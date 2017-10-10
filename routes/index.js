var express = require('express');
var router = express.Router();

//require product model
var Product = require('../models/product');

/* Home Page */
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

module.exports = router;
