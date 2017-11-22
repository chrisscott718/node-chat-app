var socket = io();
var $locationButton = $("#send-location");
var $messageTextBox = $('input[name=message]');
var $messageSendBtn = $('#send-message');

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

  $messageSendBtn.attr('disabled', true);
  $messageTextBox.prop('disabled', true);

  socket.emit('createMessage', {
    from: 'User',
    text: $messageTextBox.val()
  }, function(data){
    $messageSendBtn.attr('disabled', false);
    $messageTextBox.val('').focus().prop('disabled', false);;
  });
});

// location button click handler
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
    $locationButton.html('Send Location').removeAttr('disabled');
  }, function(){
    alert('Unable to fetch location.');
  });
});
