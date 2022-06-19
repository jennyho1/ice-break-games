<template>

	<div v-if="status == 3">
		<div v-if="!this.submitted"><input type="text" placeholder="Enter Truth" v-model="this.truth1">
			<input type="text" placeholder="Enter Truth" v-model="this.truth2">
			<input type="text" placeholder="Enter Lie" v-model="this.lie">
			<button v-on:click="submit()">Done</button>
		</div>
		<div v-if="this.submitted">Your response has been recorded. Please wait for other players</div>
	</div>
	<div v-else-if="status == 4">
		<div v-if="!this.voted">
			<p v-if="this.currentPlayer.username == this.username">It's your turn</p>
			<p v-else>{{ this.currentPlayer.username }}'s turn:'</p>
			<input type="radio" name="options" id="option0" value=0 v-model="selectedIndex">
			<label for="option0">{{ this.currentPlayer.statements[0].statement }}</label>
			<input type="radio" name="options" id="option1" value=1 v-model="selectedIndex">
			<label for="option1">{{ this.currentPlayer.statements[1].statement }}</label>
			<input type="radio" name="options" id="option2" value=2 v-model="selectedIndex">
			<label for="option2">{{ this.currentPlayer.statements[2].statement }}</label>
			<button v-if="this.currentPlayer.username != this.username" v-on:click="selectOption()">Vote</button>
		</div>

		<div v-if="this.voted">You voted. Wait for others to vote.</div>

	</div>

	<div v-else-if="status == 5">

		<h2 :class="{ 'red': !this.currentPlayer.statements[0].answer }"> {{ this.currentPlayer.statements[0].statement }}
		</h2>
		<p v-for="vote in this.currentPlayer.statements[0].votes" :key="vote.id">{{ vote.username }}</p>
		<h2 :class="{ 'red': !this.currentPlayer.statements[1].answer }"> {{ this.currentPlayer.statements[1].statement }}
		</h2>
		<p v-for="vote in this.currentPlayer.statements[1].votes" :key="vote.id">{{ vote.username }}</p>
		<h2 :class="{ 'red': !this.currentPlayer.statements[2].answer }"> {{ this.currentPlayer.statements[2].statement }}
		</h2>
		<p v-for="vote in this.currentPlayer.statements[2].votes" :key="vote.id">{{ vote.username }}</p>

		<button v-if="admin" v-on:click="next()">Next</button>

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
			selectedIndex: ''
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
			this.watchAllSubmitted()
			this.watchAllVoted()
			this.watchNext()
			this.watchFinish()
		},
		selectOption() {
			console.log(this.selectedIndex)
			this.voted = true
			this.io.emit("game_A:voted", { player: this.currentPlayer, selectedIndex: this.selectedIndex })
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
.red {
	color: red;
}
</style>
