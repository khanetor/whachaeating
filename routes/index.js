var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Whatchaeatin\'?' });
});

/* GET question page. */
router.get('/question', function(req, res) {
  res.render('question', { title: 'Question' });
});

/* GET food page. */
router.get('/food', function(req, res) {
  res.render('food', { title: 'Food' });
});


module.exports = router;
