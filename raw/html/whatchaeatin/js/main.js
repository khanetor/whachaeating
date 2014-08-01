var geoLoc = {};
var safeToGo = true;

$(function() {
	
	// we're a location-based app, what else to expect first?
	getLocation();
	
	// for the rushed nature of the project, let's just put everything
	// here instead of doing a proper MVC ;)
	setupHome();

});

function setupHome() {
	resize();
	$(window).on('resize', resize);

	$('#surprise-me-btn').hide();
	setTimeout(function() {
		$('#surprise-me-btn').fadeIn();
	}, 5000);
}

function resize() {
	// make sure section#container always span to nicely fit browser height
	$('#container').height($(window).height()-$('#container').position().top-80);
	// and the conversation sits vertically central
	$('#conversation').css('top', ($('#container').height()/2-$('#conversation').height()/2-$('#container').position().top)+'px');
}

function query(info) {
	
	// we dont want this feature to be spammed do we?
	if(!safeToGo) {
		console.log('Save yer horses ;)');
		return;
	}

	if(!info) {
		info = {
			question: "Embarrasing... I don't know what to eat :("
		};
	}

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
    							<a href="#" onclick="fadeOut($(this));query();" class="text-info"><i class="fa fa-fw fa-check-circle"></i></a>\
    							<a href="#" onclick="fadeOut($(this));query();" class="text-danger"><i class="fa fa-fw fa-times-circle"></i></a>\
    						</li>'));
    setTimeout(function() {
    	
    	conv.append(question);
    	conv.append(answer);
    	resize();

    	var maxDur = 0;
    	safeToGo = false;
    	$('#conversation li').each(function() {
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
	$('#conversation li').each(function() {
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
    }
}

/**
 * helper function to handle geolocation stuff
 */
function showPosition(position) {
	geoLoc.lat = position.coords.latitude;
	geoLoc.long = position.coords.longitude;

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