import { createStore } from 'vuex'


export default createStore({
	state: {
		room: "",
		username: "",
		id: "",
		status: 0,
		admin: false,
		io: null,
		players: []
	},
	getters: {
		getStatus: state => state.status,
		getRoom: state => state.room,
		getId: state => state.id,
		getUsername: state => state.username,
		getAdmin: state => state.admin,
		getIO: state => state.io,
		getPlayers: state => state.players,
	},
	mutations: {
		updateStatus(state, payload) {
			state.status = payload
		},
		setRoom(state, payload) {
			state.room = payload
		},
		setId(state, payload) {
			state.id = payload
		},
		setUsername(state, payload) {
			state.username = payload
		},
		setAdmin(state, payload) {
			state.admin = payload
		},
		setIO(state, payload) {
			state.io = payload
		},
		setPlayers(state, payload) {
			state.players = payload
		},
		addPlayer(state, payload) {
			state.players =	(state.players).concat(payload)
		},
	},
	actions: {
	},
	modules: {
	},
})

/**
 * Game status
 * 0 = Not in game room
 * 1 = In a game room, waiting for players
 * 2 = In a game room, choose game
 * 3 = Game A, start
 * 4 = Game A, all submitted, start showing 
 */