const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors")
// const mongoose = require('mongoose');
require("dotenv").config();

const { generateRoomCode, shuffleArray } = require('./src/utils')
const { Users } = require('./src/models/Users');
const { TwoTruthsOneLie } = require('./src/models/TwoTruthsOneLie')

const PORT = 8080 || process.env.PORT
let users = new Users();
let twoTruthsOneLie = new TwoTruthsOneLie();

app.use(cors())

// Setup server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		method: ["GET", "POST"]
	}
});


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
	});

	// START GAME
	socket.on('game:start', () => {
		const user = users.getUser(socket.id)
		const players = users.getUsers(user.room)
		console.log(`Game started in room ${user.room}`);
		console.log('Players:');
		console.log(players);
		io.to(user.room).emit('game:start');
	});


	socket.on('game:choose', (data) => {
		const user = users.getUser(socket.id)
		console.log(`${user.room} started game ${data.status}`);
		io.to(user.room).emit('game:choosen', data);
	});

	// User disconnect
	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('room:update', users.getUsers(user.room));
		}
	});

	socket.on('game_A:submit', (data) => {
		const user = users.getUser(socket.id)
		let statements = []
		statements.push({statement: data.t1, answer: true, votes:[]})
		statements.push({statement: data.t2, answer: true, votes:[]})
		statements.push({statement: data.l, answer: false, votes:[]})
		statements = shuffleArray(statements)

	
		const full = twoTruthsOneLie.addPlayer(user.room, users.getRoomSize(user.room), user.id, user.username, statements)
		if (full){
			io.to(user.room).emit('game_A:all_players_submitted', twoTruthsOneLie.getOnePlayerStatement(user.room));
		}

	});

	socket.on('game_A:voted', (data) => {
		const user = users.getUser(socket.id)
		const player = twoTruthsOneLie.addVote(user.room, data.player.id, user, data.selectedIndex)
		if (player){
			io.to(user.room).emit('game_A:all_players_voted', player);
		}

	});

	socket.on('game_A:next_player', (data) => {
		const user = users.getUser(socket.id)
		let nextPlayer = twoTruthsOneLie.getOnePlayerStatement(user.room)
		if (nextPlayer) {
			io.to(user.room).emit('game_A:next_player', nextPlayer);
		} else {
			io.to(user.room).emit('game_A:finish');
		}
		
	});

});

// Start server
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});