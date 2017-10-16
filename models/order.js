/*
    Order model
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //DeprecationWarning: Mongoose: mpromise
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true},
    created_at: { type: Date},
    updated_at: { type: Date}
});

// on every save, add the date
orderSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Order', orderSchema);
