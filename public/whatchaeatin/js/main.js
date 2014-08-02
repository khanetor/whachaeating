var geoLoc = {};
var safeToGo = true;
var questions = [];
var curQuestion = null;
var curQuestionId = 0;
var curResult = [];
var curId = 0;
var tags = [];

$(function() {

  // we're a location-based app, what else to expect first?
  getLocation();

  // for the rushed nature of the project, let's just put everything
  // here instead of doing a proper MVC ;)
  setupHome();

  // we'll need a list of questions to find out what our users want
  getQuestions();

});

function setupHome() {
  $('#surprise-me-btn').hide();
  setTimeout(function() {
    $('#surprise-me-btn').fadeIn();
  }, 5000);
  $('.left-arr, .right-arr').hide();
}

/*
 * display all food fetched into curResult
 */
function parseFood(start) {

  if(!start)
    start = 0;

  if(start < 0)
    start = 0;

  var sel = $('ul.selections');
  sel.html('');
  // goal: <li><img class="img-thumbnail" src="images/whatchaeatin_icon_200.png" /></li>
  var i = start;
  var lim = Math.min(curResult.length-1, start+3);
  console.log(lim);
  for(i; i<lim; i++) {
    var food = curResult[i];
    //console.log(food);
    //console.log(food.current_review.thumb_280);
    var theImg = $('<li><img class="img-thumbnail" src="'+food.current_review.thumb_280+'" /></li>');
    //console.log(theImg);
    //theImg.fadeTo(0,0);
    sel.append(theImg);
    //theImg.animate({
    //  opacity: 1
    //}, Math.floor(Math.random()*600));
  }
  curId = i;
  resize();
}

/**
 * mostly used upon first login
 * to grab a bunch of food and please the eyes of our uers
 */
function getFood(req) {
  
  if(!req)
    req = '';

  $.ajax({
    type: 'get',
    url: '/foodapi/food',
    success: function(data, text, xhr) {
      if(data && data.length > 0) {
        curResult = curResult.concat(data); // note that we may not want to use concat here
        
        //console.log('Current batch:');
        //console.log(curResult);

        $('.left-arr, .right-arr').show();
        $('.gal-la').hide();

        parseFood();
      }
    },
    error: function(xhr, text, err) {
      console.log(err);
      query(); // sad response...
    }
  });
}

function getQuestions() {
  $.ajax({
    type: 'get',
    url: '/foodcontribapi/questions',
    success: function(data, text, xhr) {
      questions = data.questions;
      console.log('Questions:');
      console.log(questions);

      query(questions[0]);

    },
    error: function(xhr, text, err) {
      console.log(err);
    }
  });
}

/**
 * user responds
 */
function choose(question, answer, cb) {
  
  console.log('Question '+question.text+' was answered: '+answer);
  // yes = 1 ; no = 0

  if(answer == 1) { // to do: do we actually need to use '1' here? ;) it's business logic tho.
    $.ajax({
      type: 'get',
      url: '/foodapi/question/'+question._id,
      success: function(data, text, xhr) {
        if(xhr.status == 200) {
          console.log('xhr status: '+xhr.status);
          if(tags.indexOf(data.tag) < 0) {
            console.log('/foodapi/question/'+question._id);
            console.log(data.tag);
            tags.push(data.tag);
          }

          // refresh food list
          parseFoodFromAllTags();

        } else {
          console.log('Incident: '+xhr.status);
        }
      },
      error: function(xhr, text, err) {
        console.log(err);
      }
    })
  }
  
  curQuestionId++;
  if(curQuestionId < questions.length) {
    query(questions[curQuestionId]);
  }
  else {
    // end game (no more questions)
    parseFoodFromAllTags();
  }
}

/**
 * this is for end game and once every time a question is answered
 */
function parseFoodFromAllTags() {
  
  curResult = [];

  $('.gal-la').show();

  //var tagQS = "";
  var o = 0;
  for(var k in tags) {
    //tagQS += "&tags[]="+tags[k];
    var theUrl = '/foodapi/tag/'+tags[k]+'/'+geoLoc.lat+'/'+geoLoc.long;
    console.log('Tag URL: '+theUrl);
    try {
    $.ajax({
      type: 'get',
      url: theUrl,
      success: function(data, text, xhr) {
        if(xhr.status == 200) {
          console.log('xhr status: '+xhr);
          o++;
          //console.log(o);
          //console.log(data);
          curResult = curResult.concat(data);
          if(o == tags.length) {
            console.log('Got final result');
            console.log(curResult);

            $('.gal-la').hide();

            parseFood();
          }
        } else {
          console.log('Incident: '+xhr.status);
        }
      },
      error: function(xhr, text, err) {
        o++;
        console.log("Loi! "+err);
      }
    });
    } catch(error) {
      console.log("Sob");
    }
  }


  // DEPRECATED BUT KEPT HERE FOR REFERENCE PURPOSE
  //var theUrl = '/foodapi/tag/'+geoLoc.lat+'/'+geoLoc.long+'/?tags='+tagQS;
  
  //console.log(theUrl);

  /*$.ajax({
    type: 'get',
    url: theUrl,
    success: function(data) {
      curResult = data;
      console.log('Got final result');
      console.log(data);
      parseFood();
    },
    error: function(xhr, text, err) {
      console.log(err);
    }
  });*/
  // END DEPRECATED BLOCK
}

/**
 * machine asks
 */
function query(q, cb) {

  // we dont want this feature to be spammed do we?
  if(!safeToGo) {
    console.log('Save yer horses ;)');
    return false;
  }

  if(!q) {
    q = {
      text: "Embarrasing... I don't know what to eat :("
    };
  }
  curQuestion = q;

  // clear up some space
  var toWait = clearConv();

  // #conversation has the following content struct:
  // <ul>
  //   <li>Eat with a friend?</li>
  //   <li>
  //     <a class="text-info"><i class="fa fa-fw fa-check-circle"></i></a>
  //     <a class="text-danger"><i class="fa fa-fw fa-times-circle"></i></a>
  //   </li>
  // </ul>

  // load & display new stuff
  var conv = $('#conversation ul');
  var question = prepConv($("<li>"+q.text+"</li>"));
  var answer = prepConv($('<li>\
                <a href="#" onclick="choose(curQuestion,1,function(){fadeOut($(this))});" class="text-info"><i class="fa fa-fw fa-check-circle"></i></a>\
                <a href="#" onclick="choose(curQuestion,0,function(){fadeOut($(this))});" class="text-danger"><i class="fa fa-fw fa-times-circle"></i></a>\
              </li>'));
  setTimeout(function() {

    conv.append(question);
    conv.append(answer);
    resize();

    var maxDur = 0;
    safeToGo = false;
    $('#conversation > ul > li').each(function() {
      var delay = Math.floor(Math.random()*500);
      maxDur = Math.max(maxDur, delay);
      var theLi = $(this);
      setTimeout(function() {
        theLi.css('top','+50px');
        theLi.animate({
          top: "-=50px",
          opacity: 1
        }, 500);
      }, delay);
    });
    setTimeout(function() {
      console.log('Now safe to go');
      safeToGo = true;
    }, maxDur+800);
  }, toWait);

  /**
   * helper function to prepare the target (question or answer) for animation
   */
  function prepConv(target) {
    return $(target).fadeTo(0,0);
  }

  if(cb != null)
    cb.call();
}

/**
 * just clear up the conversation area before asking for the next question
 */
function clearConv() {

  // we dont want this feature to be spammed do we?
  if(!safeToGo) {
    console.log('Save yer horses ;)');
    return;
  }

  var toWait = 0;
  safeToGo = false;
  $('#conversation > ul > li').each(function() {
    var delay = Math.floor(Math.random()*500);
    toWait = Math.max(toWait, delay);
    var theLi = $(this);
    setTimeout(function() {
      theLi.animate({
        top: "-=50px",
        opacity: 0
      }, 500, function() {
        var scope = $(this);
        setTimeout(function() {
          scope.remove();
        }, 100);
      });
    }, delay);
  });
  var safeMargin = toWait+800; // 500 + 300 for safe margin
  setTimeout(function() {
    safeToGo = true;
  }, safeMargin);
  return safeMargin;
}

/**
 * helper function to handle geolocation stuff
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      ft = document.getElementById("footer-text");
      ft.innerHTML = "Geolocation is not supported by this browser.";

    // well, better than nothing
    getFood();
    }
}

/**
 * helper function to handle geolocation stuff
 */
function showPosition(position) {
  geoLoc.lat = position.coords.latitude;
  geoLoc.long = position.coords.longitude;

  // it's better to ask for food now that we know where you are
  getFood();

  ft = document.getElementById("footer-text");
    ft.innerHTML = "Latitude: " + geoLoc.lat + "; Longitude: " + geoLoc.long;
}

/**
 * helper function to just fade the thing out without removing it from DOM
 */
function fadeOut(target) {
  $(target).animate({
    opacity: 0
  }, 200);
}
