<template>
	<div>
		<div class="row">
			<div class="col-3">
				<h4>Players</h4>
				<ul>
					<li v-for="participant in this.participants" :key="participant.id">
						{{ participant.username }}
					</li>
				</ul>
			</div>
			<div class="col-9">
				<div class="row">
					<div class="col p-5">
						<button class="btn btn-primary" v-on:click="gameA()">Two truths One lie</button>
					</div>
					<div class="col p-5">
						<button class="btn btn-primary">Would you rather...?</button>
					</div>
				</div>
				<div class="row">
					<div class="col p-5">
						<button class="btn btn-primary">Where are you joining from? (Coming soon)</button>
					</div>
					<div class="col p-5">
						<button class="btn btn-primary">Rank movies (Coming soon)</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import io from 'socket.io-client'

// game A: two truths one lie
// game B: would you rather

export default {
	name: 'ChooseGame',
	data() {
		return {
			joined: false,
			username: "",
			room: "",
			admin: false,
			participants: [{ id: 1, username: "asdf" }, { id: 2, username: "jjjbj" }]
		}
	},
	methods: {
		gameA() {
			this.io = io("http://localhost:8080")

			// create room and add this user
			this.io.emit("room:create", { username: this.username }, (callback) => {
				this.room = callback
			})
			this.admin = true
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
		},
		waitGameStart() {
			this.io.on('game:start', () => {
				console.log("game started")
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
	width: 500px;
}
</style>
