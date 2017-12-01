const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '..', '/public'); // set public path -- path is built into node to flatten directories/paths
const port = process.env.PORT || 3000; // set port -- should be done in config file
let app = express(); // create server
let server = http.createServer(app); // set up server for websockets
let io = socketIO(server); // initialize websockets to receive connections
let users = new Users();

// when a user connects to the server
io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // general message to new user connection
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
    // this sends to everyone but the connected user
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  // wait for create message from client
  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      // io aka socketIO(server) emits events to every single connection
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    // when the client emits something to the Server
    // we can pass a call back with it.
    // if things go well here we can acknowledge it by calling the callback
    // which will be called on the client side. we can also send data back
    callback();
  });
  // wait for create location message
  socket.on('createLocationMessage', (loc) => {
    let user = users.getUser(socket.id);

    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, loc.lat, loc.lng));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});

// middleware to tell express to use this static directory
app.use(express.static(publicPath));

// have app listen for requests
server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})
