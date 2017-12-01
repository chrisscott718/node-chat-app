var socket = io();
var $locationButton = $("#send-location");
var $messageTextBox = $('input[name=message]');
var $messageSendBtn = $('#send-message');

function scrollToBottom () {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child')

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {

    }
  });
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('updateUserList', function(users) {
  var $ol = $('<ol></ol>');

  users.forEach(function(user) {
    $ol.append($('<li></li>').text(user))
  });

  $('#users').html($ol);
});

// on new message received from the server
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = $('#message-template').html();

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    timestamp: formattedTime
  });

  $('#messages').append(html);

  scrollToBottom();
});

// new location message
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = $('#location-message-template').html();

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    timestamp: formattedTime,
    url: message.url
  });

  $('#messages').append(html);

  scrollToBottom();
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
