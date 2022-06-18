<template>
<div>
	<img alt="Ice Break Games Logo" width="500" src="./assets/icebreak-games-logo.png">
	<StartGame/>
</div>

</template>

<script>
import StartGame from './views/StartGame.vue'

export default {
  name: 'App',
  components: {
    StartGame
  }
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
