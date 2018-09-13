var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = app.listen(3000, () => {
	console.log('Listening...')
});

var io = socket_io(server);

io.sockets.on('connection', (socket) => {
	console.log('New client...' + socket.id);
	socket.on('mouse', function(data) {
		socket.broadcast.emit('mouse', data);
	});

	socket.broadcast.emit('join', socket.id);
})
