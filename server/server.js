const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '..', '/public'); // set public path -- path is built into node to flatten directories/paths
const port = process.env.PORT || 3000; // set port -- should be done in config file
let app = express(); // create server
let server = http.createServer(app); // set up server for websockets
let io = socketIO(server); // initialize websockets to receive connections

// when a user connects to the server
io.on('connection', (socket) => {
  // general message to new user connection
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
  // this sends to everyone but the connected user
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined.'));
  // wait for create message from client
  socket.on('createMessage', (message, callback) => {
    // io aka socketIO(server) emits events to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    // when the client emits something to the Server
    // we can pass a call back with it.
    // if things go well here we can acknowledge it by calling the callback
    // which will be called on the client side. we can also send data back
    callback();
  });
  // wait for create location message
  socket.on('createLocationMessage', (loc) => {
    // send to every single connection
    io.emit('newLocationMessage', generateLocationMessage('Admin', loc.lat, loc.lng));
  });

});

// middleware to tell express to use this static directory
app.use(express.static(publicPath));

// have app listen for requests
server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})
