<template>
	<div>
		<img alt="Ice Break Games Logo" width="500" src="./assets/icebreak-games-logo.png">
		<StartGame v-if="status < 2" />
		<Game v-else />
	</div>

</template>

<script>
import StartGame from './views/StartGame.vue'
import Game from './views/Game.vue'

export default {
	name: 'App',
	components: {
		StartGame,
		Game,
	},
	computed: {
		status() {
			return this.$store.getters.getStatus
		}
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
