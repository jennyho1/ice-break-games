<template>
	<div>
		<div class="container pt-5 text-center">
			<img alt="Ice Break Games Logo" width="500" src="./assets/icebreak-games-logo.png">
		</div>
		<div class="container penguins">
			<div class="row text-center">
				<div class="col align-self-end">
					<img class="px-3 img-fluid penguin" alt="penguin2" src="./assets/penguin2.png">
				</div>
				<div class="col align-self-end">
					<img class="px-3 img-fluid penguin" alt="penguin3" src="./assets/penguin3.png">
				</div>
				<div class="col align-self-end">
					<img class="px-3 img-fluid penguin" alt="penguin1" src="./assets/penguin1.png">
				</div>
				<div class="col align-self-end">
					<img class="px-3 img-fluid penguin" alt="penguin4" src="./assets/penguin4.png">
				</div>
			</div>
		</div>
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
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

body {
	overflow: hidden;
}

#app {
	font-family: 'Josefin Sans', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height: 100vh;
	width: 100vw;
	background: rgb(75, 75, 75);
	color: white;
}

.penguins {
	justify-content: end;
	position: absolute;
	bottom: 0;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: row;
}

@keyframes bounce {

	0%,
	20%,
	60%,
	100% {
		transform: translateY(0);
	}

	40% {
		transform: translateY(-30px);
	}

	80% {
		transform: translateY(-20px);
	}
}

.penguin:hover{
	animation: bounce 1.5s ease-in-out;
}
</style>
