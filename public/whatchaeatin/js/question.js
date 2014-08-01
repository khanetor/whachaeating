$(function() {

});

function submitQuestion() {
  $.post("/foodcontribapi/questions", {
    'question[text]':$('#questionText').val(),
    'question[tag]':$('#questionTag').val(),
    'question[for_profile]':$('#questionForProfile').prop('checked')
  })
    .done(function() {
      console.log("DONE");
      var alertSuccess = $('<div id="alertSuccess" class="alert alert-success alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        Operation completed.\
      </div>');
      $('#op-notification').prepend(alertSuccess);
    })
    .fail(function() {
      console.log("FAIL");
      var alertFailure = $('<div id="alertFailure" class="alert alert-danger alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        Operation failed!\
      </div>');
      $('#op-notification').prepend(alertFailure);
    });
}
