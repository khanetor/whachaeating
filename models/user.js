var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username           : String,
  on_a_diet          : Boolean,
  is_a_vegan         : Boolean,
  allergic_to_peanut : Boolean,
  allergic_to_sesame : Boolean
});

module.exports = mongoose.model('User', userSchema);