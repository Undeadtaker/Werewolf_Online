var socket = io.connect('http://localhost:4000');

var create = document.getElementById('host-game_btn');
var exit = document.getElementById('go-back');
var li = []

// Generating a random ID for the room
function generate() {
  return '_' + Math.random().toString(36).substr(2, 9);
};



// Returning to lobby if exit is pressed
exit.addEventListener('click', e => {
	socket.emit('lobby');
});

// Redirect to lobby
socket.on('lobby', function(data){
    window.location.href = data;
});




// Event listener for create
create.addEventListener('click', e => {
	li.push(document.getElementById("room-name").value)
	li.push(generate());
	li.push(document.getElementById("max-num-of-player").value)
	socket.emit('createRoom', li)
	document.getElementById("room-name").value = '';
	document.getElementById("max-num-of-player").value = '';
});





