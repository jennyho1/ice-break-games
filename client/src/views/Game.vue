<template>
	<div v-if="status == 2">
		<div >
			<div class="row">
				<div class="col-3">
					<h4>Players</h4>
					<ul>
						<li v-for="participant in this.participants" :key="participant.id">
							{{ participant.username }}
						</li>
					</ul>
				</div>
				<div class="col-9" v-if="admin">
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
				<div class="col-9" v-if="!admin">
					<div class="row">
						<p>host is choosing game</p>
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
			this.io.emit("game:choose", {status:3})
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
img {
	width: 500px;
}
</style>
