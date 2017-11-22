var socket = io();
var $locationButton = $("#send-location");
var $messageTextBox = $('input[name=message]');
var $messageSendBtn = $('#send-message');

// on new message received from the server
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a'),
      $li = $('<li></li>'),
      $span = $('<span></span>');

  $li.text(`${message.from}: ${message.text}`);
  $span.text(formattedTime);

  $li.append($span);

  $('#messages').append($li);
});
// new location message
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a'),
      $li = $('<li></li>'),
      $a = $('<a target="_blank">My Current Location</a>'),
      $span = $('<span></span>');

  $li.text(`${message.from}: `);
  $a.attr('href', message.url);
  $span.text(formattedTime);

  $li.append($a);
  $li.append($span);

  $('#messages').append($li);
});

// send message click handler
$('#message-form').on('submit', function(e){
  e.preventDefault();
  if(!$messageTextBox.val()) return;
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
