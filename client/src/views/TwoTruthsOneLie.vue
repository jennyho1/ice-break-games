<template>
	<div class="container pt-5 text-center">
		<h2>Two Truths and One Lie</h2>

		<div v-if="status == 3">
			<div v-if="!this.submitted" class="pt-5 col">
				<textarea class="form-control greenGlow" placeholder="Enter Truth" rows="2" v-model="this.truth1"></textarea>
				<br>
				<textarea class="form-control greenGlow" placeholder="Enter Truth" rows="2" v-model="this.truth2"></textarea>
				<br>
				<textarea class="form-control redGlow" placeholder="Enter Lie" rows="2" v-model="this.lie"></textarea>
				<br><br><br>
				<button type="button" class="btn btn-outline-light" v-on:click="submit()">Done</button>
			</div>
			<div v-if="this.submitted" class="pt-5">
				<p>Your response has been recorded. Please wait for other players</p>
				<div class="text-start">
					<p>Response: </p>
					<p>Truth --> {{ truth1 }}</p>
					<p>Truth --> {{ truth2 }}</p>
					<p>Lie --> {{ lie }}</p>
				</div>
			</div>
		</div>

		<div v-else-if="status == 4">
			<div class="pt-5">
				<div v-if="this.currentPlayer.username == this.username">
					<p>It's your turn</p>
					<div class="row pt-5">
						<div class="col">
							<button type="button" class="btn btn-custom">{{
									this.currentPlayer.statements[0].statement
							}}</button>
						</div>
						<div class="col">
							<button type="button" class="btn btn-custom">{{
									this.currentPlayer.statements[1].statement
							}}</button>
						</div>
						<div class="col">
							<button type="button" class="btn btn-custom">{{
									this.currentPlayer.statements[2].statement
							}}</button>
						</div>
					</div>
				</div>
				<div v-else>
					<p>{{ this.currentPlayer.username }}'s turn</p>
					<p>Select the one you think is a LIE.</p>
					<div class="row pt-5">
						<div class="col">
							<button type="button" class="btn btn-custom" id="vote0" v-on:click="vote(0)">{{
									this.currentPlayer.statements[0].statement
							}}</button>
						</div>
						<div class="col">
							<button type="button" class="btn btn-custom" id="vote1" v-on:click="vote(1)">{{
									this.currentPlayer.statements[1].statement
							}}</button>
						</div>
						<div class="col">
							<button type="button" class="btn btn-custom" id="vote2" v-on:click="vote(2)">{{
									this.currentPlayer.statements[2].statement
							}}</button>
						</div>
					</div>
				</div>
			</div>
			<div v-if="this.voted" class="pt-5">
				<p>Thanks for voting. Waiting for other players to vote...</p>
			</div>
		</div>

		<div v-else-if="status == 5">
			<p>{{ this.currentPlayer.username }}'s result:</p>
			<div class="row pt-5">
				<div class="col-4" v-for="statement in this.currentPlayer.statements" :key="statement.statement">
					<div class="card" :class="{ 'greenGlow': statement.answer, 'redGlow': !statement.answer }">
						<h5 class="card-header" v-if="statement.answer">True</h5>
						<h5 class="card-header" v-else>False</h5>
						<div class="card-body">
							<p class="card-text">{{ statement.statement }}</p>
						</div>
					</div>
					<div class="pt-3">
						<ul class="list-group list-group-flush">
							<li class="list-group-item" v-for="player in statement.votes" :key="player.id">{{
									player.username
							}}</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="pt-5">
				<button type="button" class="btn btn-outline-light" v-if="admin" v-on:click="next()">Next</button>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	name: 'TwoTruthsOneLie',
	computed: {
		status() {
			return this.$store.getters.getStatus
		}
	},
	data() {
		return {
			admin: this.$store.getters.getAdmin,
			username: this.$store.getters.getUsername,
			io: this.$store.getters.getIO,
			truth1: "",
			truth2: "",
			lie: "",
			submitted: false,
			voted: false,
			currentPlayer: { id: "", username: "", statements: [] },
		}
	},
	methods: {
		watchAllSubmitted() {
			this.io.on('game_A:all_players_submitted', (player) => {
				this.currentPlayer = player
				console.log(player)
				this.$store.commit("updateStatus", 4)
			})
		},
		submit() {
			this.io.emit("game_A:submit", { t1: this.truth1, t2: this.truth2, l: this.lie })
			this.submitted = true;
			this.watchAllSubmitted()
			this.watchAllVoted()
			this.watchNext()
			this.watchFinish()
		},
		vote(index) {
			if (!this.voted) {
				this.voted = true
				this.io.emit("game_A:voted", { player: this.currentPlayer, selectedIndex: index })
				if (index !== 0) {
					document.getElementById('vote0').disabled = true
				}
				if (index !== 1) {
					document.getElementById('vote1').disabled = true
				}
				if (index !== 2) {
					document.getElementById('vote2').disabled = true
				}
			}

		},
		watchAllVoted() {
			this.io.on('game_A:all_players_voted', (player) => {
				this.currentPlayer = player
				console.log(player)
				this.$store.commit("updateStatus", 5)
			})
		},
		next() {
			this.io.emit("game_A:next_player")
		},
		watchNext() {
			this.io.on('game_A:next_player', (nextPlayer) => {
				this.currentPlayer = nextPlayer
				this.voted = false,
					this.$store.commit("updateStatus", 4)
			})
		},
		watchFinish() {
			this.io.on('game_A:finish', () => {
				this.$store.commit("updateStatus", 2)
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.greenGlow {
	border: 1px solid #0dff00;
	box-shadow: 0px 0px 10px #41ff33;
}

.redGlow {
	border: 1px solid #ff4040;
	box-shadow: 0px 0px 10px #ff4040;
}

.red {
	color: red;
}

.btn-custom {
	height: 100px;
	background: #4BADCE;
	width: 200px;
}

.card {
	background: none
}

.list-group-item {
	background: none;
	color: white;
	border-color: white;
}
</style>
