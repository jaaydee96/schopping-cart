var passport = require('passport');
var localStrategy =  require('passport-local').Strategy;

//require User model
var User = require('../models/user');

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// used to deserialize the user from the session
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//passport strategy for user sign up
passport.use('local.signup', new localStrategy({
    //setting up username and password field
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
   //find user in user model
   User.findOne({'email': email}, function (err, user) {
       //form validator
       req.checkBody('email', 'Invalid email').notEmpty().isEmail();
       req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
       //form validation errors
       var errors = req.validationErrors();
       if(errors) {
           //building error messages for flash
           var messages = [];
           errors.forEach(function (error) {
               messages.push(error.msg);
           });
           //return flash messages
           return done(null, false, req.flash('error', messages));
       }
       //catch error in user model
       if(err) {
           return done(err);
       }
       //if user exists
       if(user) {
           return done(null, false, {message: 'Email is already in use.'});
       }
       //user not exists
       //then saving him to user model
       var newUser = new User();
       newUser.email = email;
       newUser.password = newUser.encryptPassword(password);
       newUser.save(function (err, result) {
           if(err) {
               return done(err);
           }
           return done(null, newUser);
       });
   });
}));

//passport strategy for user sign in
passport.use('local.signin', new localStrategy({
    //setting username and password field
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //find user in user model
    User.findOne({'email': email}, function (err, user) {
        //form validator
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
        //form validation errors
        var errors = req.validationErrors();
        if(errors) {
            //building error messages for flash
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            //return flash messages
            return done(null, false, req.flash('error', messages));
        }
        //catch error in user model
        if(err) {
            return done(err);
        }
        //if user not exists
        if(!user) {
            return done(null, false, {message: 'No user found.'});
        }
        //if user has not valid password method in user model
         if(!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));
