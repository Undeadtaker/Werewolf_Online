var socket = io.connect('http://localhost:4000');

// Sending a request every 1 second for the list update
setInterval(function(){
    socket.emit('getPlayers')
},1000);

socket.on('getPlayers', function(rooms){
	var room1 = document.getElementsByClassName('numOfPlayers');
	room1[0].innerHTML = 'number of players: ' + rooms + '/30';
});






// Redirecting Players if they clicked the element
var room = document.getElementsByClassName('room-card');
console.log(room[0])
room[0].addEventListener('click', e => {
	socket.emit('room1');
});

socket.on('redirect', function(destination){
	window.location.href = destination;
});


