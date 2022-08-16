var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var converter = require('./input_converter');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);  
  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    // emit a message to all players to remove this player
    //io.emit('disconnect', socket.id);
  });
  
  socket.on('action_keydown', function (action_data)
  {
    console.log('got action_keydown: ' + action_data);
    converter.handle_action_keydown(action_data);
  });
  socket.on('keyboard_input', function (keyboard_data)
  {
    console.log('got keyboard_data: ' + keyboard_data);
    converter.handle_keyboard_data(keyboard_data);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});


process.on('uncaughtException', function (err) {
  console.log(err);
}); 