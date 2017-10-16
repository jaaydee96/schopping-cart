/*
   Product model
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //DeprecationWarning: Mongoose: mpromise
var Schema = mongoose.Schema;

var productSchema = new Schema({
   imagePath: {type: String, required: true},
   title: {type: String, required: true},
   description: {type: String, required: true},
   price: {type: Number, required: true},
   created_at: { type: Date},
   updated_at: { type: Date}
});

// on every save, add the date
productSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Product', productSchema);
