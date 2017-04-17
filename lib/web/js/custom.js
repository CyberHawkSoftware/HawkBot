$( document ).ready(function()
{
    console.log( "ready!" );
    $('.dropdown-button').dropdown({
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );
  $(".button-collapse").sideNav({
    edge: "right",
    draggable: true
  });
  $('#server_submit').click( function() {
    if($('#prefix').val() === '')
    {
      Materialize.toast('You must enter a prefix', 4000);
    }
    else
    {
      $.post( '/form', $('#server_form').serialize(), function(data)
      {
        Materialize.toast('Info submitted', 4000);
      },
        'json' // I expect a JSON response
      );
    }
    
  });
});