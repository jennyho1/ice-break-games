<template>
	<div class="container text-center pt-5">
		
		<div v-if="!joined" class="new-game">
			<div class="row">
				<div class="col text-center">
					<button class="btn btn-primary btn-custom" type="button" data-bs-toggle="collapse"
						data-bs-target="#collapseNewGame" aria-expanded="false" aria-controls="collapseNewGame">
						Create new game room
					</button>
					<div class="collapse" id="collapseNewGame">
						<div class="card card-body card-custom">
							<input class="form-control" type="text" placeholder="Username" v-model="this.username">
							<br>
							<button type="button" class="btn btn-outline-secondary" v-on:click="newGame()">Create room</button>
						</div>
					</div>
				</div>
				<div class="col text-center">
					<button class="btn btn-primary btn-custom" type="button" data-bs-toggle="collapse"
						data-bs-target="#collapseJoinGame" aria-expanded="false" aria-controls="collapseJoinGame">
						Join a game
					</button>
					<div class="collapse" id="collapseJoinGame">
						<div class="card card-body card-custom">
							<input class="form-control" type="text" placeholder="Username" v-model="this.username">
							<input class="form-control" type="text" placeholder="Room code" v-model="this.room">
							<br>
							<button type="button" class="btn btn-outline-secondary" v-on:click="joinGame()">Join room</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="joined">
			<div>
				<h1>Code: <code>{{ this.room }}</code></h1>
				<h4>You are --> {{ username }}</h4>
				<div class="row pt-4">
					<div class="col">
						<h4>Players: </h4>
						<ul class="list-group list-group-flush">
							<li class="list-group-item" v-for="participant in this.participants" :key="participant.id">{{ participant.username }}</li>
						</ul>
					</div>
					<div class="col">
						<button v-if="admin" type="button" class="btn btn-outline-light" v-on:click="startGame()">Start Game</button>
						<p v-else>Waiting for other players...</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import io from 'socket.io-client'

export default {
	name: 'StartGame',
	data() {
		return {
			joined: false,
			username: "",
			room: "",
			admin: false,
			participants: []
		}
	},
	methods: {
		newGame() {
			this.io = io("http://localhost:8080")

			// create room and add this user
			this.io.emit("room:create", { username: this.username }, (callback) => {
				console.log(callback)
				this.room = callback
				this.$store.commit("setRoom", this.room)
				this.$store.commit("setUsername", this.username)
			})
			this.admin = true
			this.$store.commit("setAdmin", true)
			this.joined = true
			this.watchUsers()
		},
		joinGame() {
			this.io = io("http://localhost:8080")

			if (this.room == "") {
				alert('enter room code')
				return
			}
			this.joined = true
			this.io.emit("room:join", { room: this.room, username: this.username })
			this.$store.commit("setRoom", this.room)
			this.$store.commit("setUsername", this.username)
			this.watchUsers()
			this.waitGameStart()
		},
		watchUsers() {
			this.io.on('room:update_users', (users) => {
				this.participants = users
			})
		},
		startGame() {
			this.io.emit("game:start")
			console.log("game started")
			this.$store.commit("updateStatus", 2)
			this.$store.commit("setIO", this.io)
			this.$store.commit("setPlayers", this.participants)
		},
		waitGameStart() {
			this.io.on('game:start', () => {
				console.log("game started")
				this.$store.commit("updateStatus", 2)
				this.$store.commit("setIO", this.io)
				this.$store.commit("setPlayers", this.participants)
			})
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
code {
	color: white;
}

.new-game {
	padding-top: 100px;
}

.btn-custom {
	width: 280px;
	height: 100px;
	background: #4BADCE;
}

.card-custom {
	width: 330px;
	align-items: center;
	background: #A7D1CE;
}

.list-group-item {
	background: none;
	color: white;
	border-color: white;
}
</style>
