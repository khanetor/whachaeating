var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
  text : String,
  tags : [String]
});

module.exports = mongoose.model('Question', questionSchema);