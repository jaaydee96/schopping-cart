var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

/* Models */
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

/* User routes */

/*
    User profile & orders list
    protection for authenticated user only
 */
router.get('/profile', isLoggedIn, function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var messages = req.flash('error');

    //fetch orders
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }

        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
            order.totalPrice = cart.getTotalPrice();
            order.isUpdateAt = order.updated_at==null ? false : true;
        });

        res.render('user/profile', {
            csrfToken: req.csrfToken(),
            isUpdateAt: req.user.updated_at==null ? false : true,
            orders: orders,
            messages: messages, hasErrors: messages.length > 0,
            successMsg: successMsg, noMessages: !successMsg
        });

    });
});

router.post('/profile', isLoggedIn, function (req, res, next) {
    var messages = [];
    var email = req.body.email;
    var User = require('../models/user');

    User.findOne({'email': email}, function (err, user) {
        if (err) throw err;
        //form validator
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        //form validation errors
        var errors = req.validationErrors();
        if (errors) {
            //building error messages for flash
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
        }

        if (user) {
            messages.push('Email is already in use.');
        }

        //any errors redirect to back user profile
        if (messages.length > 0) {
            //register flash messages
            req.flash('error', messages);

            return res.redirect('/user/profile');
        }

        //updating user
        User.findOne({'email': req.user.email}, function (err, user) {
            if (err) throw err;
            user.email = email;
            user.save(function (err, user) {
                if (err) throw err;
                if (user) {
                    req.flash('success', 'Email has been successfully updated.');
                }

                return res.redirect('/user/profile');
            });
        });

    });
});

/*
    User logout
    protection for authenticated user only
 */
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logOut();
    res.redirect('/');
});

//======================================================================================================================
/*
    Grant access to all routes bellow only for not logged users
 */
router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

/*
    User sign up
 */
router.get('/signup',function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/*
    Check user sign up
    validate, authenticate & save user in mongodb with passport.js
    implemented function of remember where did user come from
 */
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

/*
    User sign in
 */
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/*
    Check user sign in
    validate and authenticate user in mongodb with passport.js
    implemented function of remember where did user come from
 */
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});
//======================================================================================================================
/*
    Check authenticated user for protected action otherwise redirect to entry site
 */
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

/*
    Opposite function to isLoggedIn()
 */
function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
