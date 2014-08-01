var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
  foodName    : String,
  tag         : String,
  price_lower : Number,
  price_upper : Number,
  allergies   : String
});

module.exports = mongoose.model('Food', foodSchema);