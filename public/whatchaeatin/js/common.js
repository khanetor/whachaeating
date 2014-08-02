$(function() {
  resize();
  $(window).on('resize', resize);
});

function resize() {
  // make sure section#container always span to nicely fit browser height
  $('#container').height($(window).height()-$('#container').position().top);

  // and the conversation sits vertically central
  if($('#conversation').height() < $(window).height())
    $('#conversation').css('top', ($('#container').height()/2-$('#conversation').height()/2-$('#container').position().top)+'px');
  else
    $('#conversation').css('top', 0);
}
