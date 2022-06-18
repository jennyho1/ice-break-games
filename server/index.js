const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors")
// const mongoose = require('mongoose');
require("dotenv").config();

const { generateRoomCode } = require('./src/utils')
const { Users } = require('./src/models/Users');
const { Console } = require('console');

const PORT = 8080 || process.env.PORT
let users = new Users();

// const User = require("./models/User");
// const { Console } = require('console');

app.use(cors())

// Setup server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		method: ["GET", "POST"]
	}
});

// //Set up default mongoose connection
// mongoose.connect(
// 	process.env.URI, 
// 	{useNewUrlParser: true, useUnifiedTopology: true}
// );

// app.get('/generate-code', (req, res) => {
// 	res.send()
// })


io.on('connection', (socket) => {
	console.log(`New user connected: ${socket.id}`);

	// CREATE ROOM
	socket.on('room:create', (data, callback) => {
		socket.username = data.username
		const room = generateRoomCode();
		console.log(`Room ${room} was created by ${data.username}`)
		socket.join(room);
		users.removeUser(socket.id);
		users.addUser(socket.id, data.username, room);

		io.to(room).emit('room:update_users', users.getUsers(room));
		return callback(room);
	});

	// JOIN ROOM
	socket.on('room:join', (data) => {
		socket.username = data.username
		socket.join(data.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, data.username, data.room);
		console.log(`${data.username} has joined ${data.room}`)
		io.to(data.room).emit('room:update_users', users.getUsers(data.room));
		console.log(users.getUsers(data.room));
	});

	socket.on('send', (data) => {
		//send everyone but yourself
		socket.broadcast.emit("receive", data)

		// send to specific room
		//socket.to(data.room).emit("receive_message", data)

	});
});

// Start server
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});