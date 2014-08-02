var geoLoc = {};
var safeToGo = true;
var questions = [];
var curQuestion = "";
var curResult = [];
var curId = 0;

$(function() {

	// we're a location-based app, what else to expect first?
	getLocation();

	// for the rushed nature of the project, let's just put everything
	// here instead of doing a proper MVC ;)
	setupHome();

	getQuestions();

});

function setupHome() {
	$('#surprise-me-btn').hide();
	setTimeout(function() {
		$('#surprise-me-btn').fadeIn();
	}, 5000);
}

function parseFood(start) {

	//var caro = $('#caro');
	/*
	<div class="item active">
		<img src="..." alt="...">
		<div class="carousel-caption">
			...
		</div>
	</div>
	*/

	/*caro.html('');
	for(var j=0; j<curResult.length; j++) {
		var theFood = curResult[j];
		//console.log(food.current_review.thumb_280);
		var itm = $('<div class="item">\
			<img src="'+theFood.current_review.thumb_280+'" alt="'+theFood.item.name+'">\
			<div class="carousel-caption">'+theFood.item.name+'</div>\
		</div>');
		caro.append(theFood);
	}*/


	if(!start)
		start = 0;

	if(start < 0)
		start = 0;

	var sel = $('ul.selections');
	sel.html('');
	// goal: <li><img class="img-thumbnail" src="images/whatchaeatin_icon_200.png" /></li>
	var i = start;
	var lim = Math.min(curResult.length-1, start+3);
	for(i; i<lim; i++) {
		var food = curResult[i];
		//console.log(food.current_review.thumb_280);
		var theImg = $('<li><img class="img-thumbnail" src="'+food.current_review.thumb_280+'" /></li>');
		//theImg.fadeTo(0,0);
		sel.append(theImg);
		//theImg.animate({
		//	opacity: 1
		//}, Math.floor(Math.random()*600));
	}
	curId = i;
	resize();
}

function getFood(req) {
	if(!req)
		req = '';
	$.ajax({
		type: 'get',
		url: '/foodapi',
		success: function(data, text, xhr) {
			if(data && data.length > 0) {
				curResult = curResult.concat(data);
				//console.log('Current batch:');
				//console.log(curResult);
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
	console.log('Question '+question+' was answered: '+answer);
	$.ajax({
		type: 'get',
		url: '/foodapi/bun-bo',
		success: function(data, text, xhr) {
			if(data) {
				curResult = curResult.concat(data);
				console.log(curResult);
			}
			//console.log(data);
			console.log(cb);
			if(cb != null)
				cb.call();
		},
		error: function(xhr, text, err) {
			console.log(err);
		}
	});
}

/**
 * machine asks
 */
function query(info, cb) {

	// we dont want this feature to be spammed do we?
	if(!safeToGo) {
		console.log('Save yer horses ;)');
		return false;
	}

	if(!info) {
		info = {
			question: "Embarrasing... I don't know what to eat :("
		};
	}
	curQuestion = info.question;

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
  var question = prepConv($("<li>"+info.question+"</li>"));
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
