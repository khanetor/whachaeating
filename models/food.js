var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
  food_name   : { type : String, required : true, unique : true },
  tags        : { type : [String], required : true },
  price_lower : Number,
  price_upper : Number,
  allergies   : [String]
});

var foodModel = mongoose.model('Food', foodSchema);

foodSchema.pre('save', function(next) {
  foodModel.findOne({ foodName : this.food_name }, function(err, food) {
    if (err) {
      next(err);
    } else if (!food) {
      next();
    } else {
      next(new Error('This food already exists.'));
    }
  });
});

module.exports = foodModel;
