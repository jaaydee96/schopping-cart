var express = require('express');
var router = express.Router();

/* Models */
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* Routes/Controllers */

/*
    Products list
 */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
      //build product array with chunkSize per row
      var productsChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productsChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', products: productsChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

/*
    Add item to shopping cart
 */
router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if(err) {
            res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

/*
    Reduce item by one in shopping cart
 */
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

/*
    Remove all units of the same item in shopping cart
 */
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

/*
    Shopping cart list
 */
router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);

    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.getTotalPrice()});
});

/*
    Checkout form for Stripe service on stripe.com
    protection for authenticated user only
    credit card validation process on client side in checkout.js
    tip: use credit card number 4242 4242 4242 4242 for testing
 */
router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];

    res.render('shop/checkout', {total: cart.getTotalPrice(), errMsg: errMsg, noError: !errMsg});
});

/*
    Credit card charge process with Stripe service on stripe.com
    protection for authenticated user only
 */
router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_SZnMAgQevmwGEcpvtCwS1BfT" // Stripe API secret key
    );

    stripe.charges.create({
        amount: Math.round(cart.getTotalPrice() * 100),
        currency: "eur",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;
//======================================================================================================================
/*
    Check authenticated user and remember where did he come from
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
