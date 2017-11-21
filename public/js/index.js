var socket = io();

socket.on('connect', function() {
  socket.emit('createMessage', {
    from: 'Chris',
    text: 'This is test'
  });
  socket.emit('createMessage', {
    from: 'Jen',
    text: 'This is test'
  });
});

socket.on('newMessage', function(message) {
  console.log('NEW MESSAGE RECEIVED', message);
})
