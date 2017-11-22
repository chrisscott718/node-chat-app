var socket = io();

// on user connection
socket.on('connect', function() {
});

// on new message received from the server
socket.on('newMessage', function(message) {
  var $li = $('<li></li>');
  $li.text(`${message.from}: ${message.text}`);
  $('#messages').append($li);
});
// new location message
socket.on('newLocationMessage', function(message) {
  var $li = $('<li></li>'),
      $a = $('<a target="_blank">My Current Location</a>');

  $li.text(`${message.from}: `);
  $a.attr('href', message.url);
  $li.append($a);
  
  $('#messages').append($li);
});

// send message click handler
$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: $('input[name=message]').val()
  }, function(data){
    $('input[name=message]').val('').focus();
  })
});

// location button click handler
var $locationButton = $("#send-location");
$locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert("Geolocation is not supported in your browser.");
  }
  $locationButton.html('Fetching location...').attr('disabled', true);
  navigator.geolocation.getCurrentPosition(function(pos){
    socket.emit('createLocationMessage', {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
    $locationButton.html('Send Location').attr('disabled', false);
  }, function(){
    alert('Unable to fetch location.');
  });
});
