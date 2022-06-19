function generateRoomCode() {
	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < 6; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	 }
	return result
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {generateRoomCode, shuffleArray}