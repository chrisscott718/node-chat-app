const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

// set public path -- path is built into node to flatten directories/paths
const publicPath = path.join(__dirname, '..', '/public');

// set port -- should be done in config file
const port = process.env.PORT || 3000;

// create server
let app = express();

let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
  socket.emit('newMessage', {
    from: 'chris',
    text: 'message.text',
    createdAt: new Date().getTime()
  });
  
  socket.on('createMessage', (message) => {
    console.log('new message was created, sending message back to clients');
  });
});

// middleware to tell express to use this static directory
app.use(express.static(publicPath));

// have app listen for requests
server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})
