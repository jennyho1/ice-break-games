<template>
	<div v-if="status == 2">
		<div class="container pt-5">
			<div class="row">
				<div class="col-3">
					<h4>Players</h4>
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="participant in this.participants" :key="participant.id">{{ participant.username }}</li>
					</ul>
				</div>
				<div class="col-9" v-if="admin">
					<div class="row">
						<div class="col p-5">
							<button class="btn btn-primary btn-games color2" v-on:click="gameA()">Two truths One lie</button>
						</div>
						<div class="col p-5">
							<button class="btn btn-primary btn-games color1">Would you rather...? (Coming soon)</button>
						</div>
					</div>
					<div class="row">
						<div class="col p-5">
							<button class="btn btn-primary btn-games color1">Where are you joining from? (Coming soon)</button>
						</div>
						<div class="col p-5">
							<button class="btn btn-primary btn-games color3">Rank movies (Coming soon)</button>
						</div>
					</div>
				</div>
				<div class="col-9" v-if="!admin">
					<div class="row">
						<div class="col p-5">
							<button class="btn btn-primary btn-games color2">Two truths One lie</button>
						</div>
						<div class="col p-5">
							<button class="btn btn-primary btn-games color1">Would you rather...? (Coming soon)</button>
						</div>
					</div>
					<div class="row">
						<div class="col p-5">
							<button class="btn btn-primary btn-games color1">Where are you joining from? (Coming soon)</button>
						</div>
						<div class="col p-5">
							<button class="btn btn-primary btn-games color3">Rank movies (Coming soon)</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<TwoTruthsOneLie v-else-if="3 <= status <= 5" />
</template>

<script>
import TwoTruthsOneLie from '../views/TwoTruthsOneLie.vue'
// game A: two truths one lie
// game B: would you rather

export default {
	name: 'GameView',
	components: {
		TwoTruthsOneLie
	},
	mounted() {
		this.watchUsers()
		this.waitGameStart()
	},
	computed: {
		status() {
			return this.$store.getters.getStatus
		}
	},
	data() {
		return {
			admin: this.$store.getters.getAdmin,
			io: this.$store.getters.getIO,
			room: "",
			participants: this.$store.getters.getPlayers
		}
	},
	methods: {
		gameA() {
			this.io.emit("game:choose", { status: 3 })
			this.$store.commit("updateStatus", 3)
		},
		waitGameStart() {
			this.io.on('game:choosen', (data) => {
				this.$store.commit("updateStatus", data.status)
			})
		},
		watchUsers() {
			this.io.on('room:update_users', (users) => {
				this.participants = users
			})
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-group-item {
	background: none;
	color: white;
	border-color: white;
}
.btn-games {
	height: 170px;
	width: 170px;
	color:black;
}
.color1{
	background: #A7D1CE;
}
.color2{
	background: #4BADCE;
}
.color3{
	background: #79BFCE;
}
</style>
