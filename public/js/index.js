var socket = io();

socket.on('connect', function() {
});

socket.on('newMessage', function(message) {
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  $('#messages').append(li);
})

$('#message-form').on('submit', function(e){
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('input[name=message]').val()
  }, function(data){
    $('input[name=message]').val('').focus();
  })
});
