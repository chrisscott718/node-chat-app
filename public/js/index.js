var socket = io();

socket.on('connect', function() {
});

socket.on('newMessage', function(message) {
  console.log('NEW MESSAGE RECEIVED', message);
})
