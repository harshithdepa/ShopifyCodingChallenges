function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

$(document).ready(function(){
  $("#error").hide();
  $('#form').on('submit', function(data){
    var email = $('#email').val();
    if(!isEmail(email)){
      $('#error').show();
      return false;
    }
    else {
      return true;
    }
  })
})
