<template>
	<div>
		<div v-if="!joined">
			<div class="new-game">
				<input type="text" placeholder="Username" v-model="this.username">
				<button v-on:click="newGame()">Create new game room</button>
				<span></span>
			</div>
			<div class="join-game">
				<input type="text" placeholder="Room code" v-model="this.room">
				<input type="text" placeholder="Username" v-model="this.username">
				<button v-on:click="joinGame()">Join game room</button>
			</div>
		</div>

		<div v-if="joined">
			<div>
				<h1>Code: {{ this.room }}</h1>
				<h4>You are {{ username }}</h4>
				<div>
					<p v-for="participant in this.participants" :key="participant.id">{{ participant.username }}</p>
				</div>
				<button v-if="admin" v-on:click="startGame()">Start Game</button>
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
		startGame(){
			this.io.emit("game:start")
			console.log("game started")
			this.$store.commit("updateStatus", 2)
			this.$store.commit("setIO", this.io)
			this.$store.commit("setPlayers", this.participants)
		},
		waitGameStart(){
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
img {
	width: 500px;
}
</style>
