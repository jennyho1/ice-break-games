// [
// 	{
// 		room: '',
// 		players: [
// 			{
// 				id: '',
// 				username: '',
//        played: false
// 				statements: [
// 					{
// 						statement: "",
// 						answer: false,
//            votes: ["id"]
// 					},
// 					{
// 						statement: "",
// 						answer: false,
//            votes: ["id"]
// 					},
// 					{
// 						statement: "",
// 						answer: true,
//            votes: ["id"]
// 					}
// 				]
// 			}
// 		]
// 	}
// ]

class TwoTruthsOneLie {
	constructor() {
		this.games = [];
	}

	addPlayer(room, roomSize, id, username, statements) {
		// search for existing room, in games
		let game = this.games.filter((game) => game.room === room);
		if (game.length == 0) {
			game = { room: room, players: [] }
			this.games.push(game)
		} else {
			game = game[0]
		}
		game.players.push({ id: id, username: username,  played: false, statements: statements })
		// return true if all players in the roon have submitted their statements
		if (game.players.length == roomSize) {
			return true
		}
		return false;
	}

	getGamePlayers(room) {
		let game = this.games.filter((game) => game.room === room)[0];
		return game.players;
	}

	getOnePlayerStatement(room) {
		let game = this.games.filter((game) => game.room === room)[0];
		let availablePlayers = game.players.filter((player) => !player.played);
		if (availablePlayers.length == 0) {
			return null 
		}
		let player = availablePlayers[Math.floor(Math.random() * availablePlayers.length)]
		player.played = true
		return player
	}

	addVote(room, playerId, voteUser, statementIndex) {
		let game = this.games.filter((game) => game.room === room)[0];
		let player = game.players.filter((player) => player.id === playerId)[0];
		player.statements[statementIndex].votes.push(voteUser)
		//all players have voted
		const voteNeeded = game.players.length - 1
		const votes = player.statements[0].votes.length + player.statements[1].votes.length + player.statements[2].votes.length
		if (voteNeeded == votes) {
			return player;
		}
		return null;
	}

	removePlayer(room, id) {
		let game = this.games.filter((game) => game.room === room)[0];
		game.players = game.players.filter((player) => player.id !== id);
		return game.players;
	}

}

module.exports = { TwoTruthsOneLie };