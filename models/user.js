/*
    User model
 */
var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //DeprecationWarning: Mongoose: mpromise
var Schema = mongoose.Schema;

var userSchema = Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    created_at: { type: Date},
    updated_at: { type: Date}
});

// on every save, add the date
userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
        this.updated_at = null;
    }
    else {
        // change the updated_at field to current date
        this.updated_at = currentDate;
    }

    next();
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
