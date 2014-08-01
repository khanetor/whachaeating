$(function() {
  resize();
  $(window).on('resize', resize);
});

function resize() {
  // make sure section#container always span to nicely fit browser height
  $('#container').height($(window).height()-$('#container').position().top-80);
  // and the conversation sits vertically central
  $('#conversation').css('top', ($('#container').height()/2-$('#conversation').height()/2-$('#container').position().top)+'px');
}
