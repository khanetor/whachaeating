var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
  text        : { type : String, required : true, unique : true },
  tag         : String,
  for_profile : { type : Boolean, default : false }
});

var questionModel = mongoose.model('Question', questionSchema);

questionSchema.pre('save', function(next) {
  questionModel.findOne({ text : this.text }, function(err, question) {
    if (err) {
      next(err);
    } else if (!question) {
      next();
    } else {
      next(new Error('This question already exists.'));
    }
  });
});

module.exports = questionModel;
