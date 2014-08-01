var express = require('express');
var router = express.Router();
var Food = require('../models/food');
var Question = require('../models/question');

router.get('/questions', function(req, res) {
  Question.find(function(err, questions) {
    if (!err) {
      res.json({ questions : questions });
    } else {
      res.json(500, { message : 'Something is wrong!' });
    }
  });
});

router.post('/questions', function(req, res) {
  console.log(req.body);
  var newQuestion = new Question();
  newQuestion.text = req.body.question.text;
  newQuestion.tag = req.body.question.tag;
  newQuestion.for_profile = req.body.question.for_profile;

  newQuestion.save(function(err) {
    if (!err) {
      res.json({ message : 'Your question is saved!', question : newQuestion });
    } else {
      res.json(500, { message : 'Your question cannot be saved!' });
    }
  });
});

router.put('/questions/:id', function(req, res) {
  Question.findOneById(req.params.id, function(err, question) {
    if (!err) {
      if (!question) {
        res.json(400, { message : 'There is no such question.'});
      } else {
        question.text = req.body.question.text;
        question.tag = req.body.question.tag;
        question.for_profile = req.body.question.for_profile

        question.save(function(err) {
          if (!err) {
            res.json({ message : 'Your question is updated!', question : question });
          } else {
            res.json(500, { message : 'Your question cannot be updated!' });
          }
        });
      }
    } else {
      res.json(500, { message : 'There is an error in searching for the question.'});
    }
  });
});

router.delete('/questions/:id', function(req, res) {
  Question.findById(req.params.id).remove(function() {
    res.json({message : 'Question has been removed.'});
  });
});

router.get('/foods', function(req, res) {
  Food.find(function(err, foods) {
    if (!err) {
      res.json({ foods : foods });
    } else {
      res.json(500, { message : 'Something is wrong!' });
    }
  });
});

router.post('/foods', function(req, res) {
  var newFood = new Food();
  newFood.food_name = req.body.food.food_name;
  newFood.tags = req.body.food.tags;
  newFood.price_lower = req.body.food.price_lower;
  newFood.price_upper = req.body.food.price_upper;
  newFood.allergies = req.body.food.allergies;

  newFood.save(function(err) {
    if (!err) {
      res.json({ message : 'Your question is saved!', food : newFood });
    } else {
      res.json(500, { message : 'Your food cannot be saved!' });
    }
  });
});

router.put('/foods/:id', function(req, res) {
  Food.findOneById(req.params.id, function(err, food) {
    if (!err) {
      if (!food) {
        res.json(400, { message : 'There is no such food.'});
      } else {
        food.food_name = req.body.food.food_name;
        food.tags = req.body.food.tags;
        food.price_lower = req.body.food.price_lower;
        food.price_upper = req.body.food.price_upper;
        food.allergies = req.body.food.allergies;
        food.save(function(err) {
          if (!err) {
            res.json({ message : 'Your food is updated!', food : food });
          } else {
            res.json(500, { message : 'Your food cannot be updated!' });
          }
        });
      }
    } else {
      res.json(500, { message : 'There is an error in searching for the food.'});
    }
  });
});

router.delete('/foods/:id', function(req, res) {
  Food.findById(req.params.id).remove(function() {
    res.json({message : 'Food has been removed.'});
  });
});

module.exports = router;
