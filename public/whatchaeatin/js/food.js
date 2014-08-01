var tagsSelOpts = {
  createSearchChoice:createSearchChoice,
  multiple: true,
  data: [
    {id: 'Noodles', text: 'Noodles'},
    {id: 'Soup', text: 'Soup'},
    {id: 'Rice', text: 'Rice'},
    {id: 'Bread', text: 'Bread'}
  ]
}

var allergiesSelOpts = {
  createSearchChoice:createSearchChoice,
  multiple: true,
  data: [
    {id: 'Sesame', text: 'Sesame'},
    {id: 'Peanuts', text: 'Peanuts'}
  ]
}

$(function() {
    $("#tags").select2(tagsSelOpts);
    $("#allergies").select2(allergiesSelOpts);
});

function createSearchChoice(term, data) {
  if ($(data).filter(function() {
      return this.text.localeCompare(term)===0;
  }).length===0)
  {return {id:term, text:term};}
}

function submitFood() {
  $.post("/foodcontribapi/foods", {
    'food[food_name]':$('#foodName').val(),
    'food[tags]':$('#tags').val(),
    'food[allergies]':$('#allergies').val(),
    'food[price_lower]':$('#priceLower').val(),
    'food[price_upper]':$('#priceUpper').val()
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

function clearAll() {
  $('#foodName').val('');
  $('#tags').val('').select2(tagsSelOpts);
  $('#allergies').val('').select2(allergiesSelOpts);
  $('#priceLower').val('');
  $('#priceUpper').val('');
}
