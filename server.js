var express = require('express');
var socket = require('socket.io');
// --------------------------------------------------- THE SERVER SIDE --------------------------------------------------- //

// App setup
var app = express();
var server = app.listen(4000, function(){
	console.log('Listening to new connections on port 4000');
}); // listen to port number

// Directory for static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);
// Open room.html to see the id of these tags
//var button = document.getElementById('send');
//var List = document.getElementById('players-list');
//var ready = document.getElementById('ready');
//var name = JSON.parse(localStorage.getItem('MyVariable'))['name'];




// on connect give id of player 
socket.on('connect', () => {
	socket.emit('giveID', [socket.id, name]);
 });



// TODO: Write javascript that says if the name is not equal to Player, the change Name dissapears
// Create a evenet listener that changes the name of the player
button.addEventListener('click', function(){
  socket.emit('changeName', document.getElementById("name").value);
  document.getElementById("name").value= "";
});

// send ready to server
ready.addEventListener('click', function(){
  socket.emit('ready');
});








// Get list of player names (updates every second)
setInterval(function(){
    socket.emit('getNames')
},1000);

socket.on('getNames', function(data){
	List.innerHTML = '';

	for (i = 0; i < data.length; i++){
		if (socket.id == data[i].id){
			if (data[i].ready == true){
				ready.innerHTML = "waiting for others";
			}
			if (data[i].ready == false){
				ready.innerHTML = "READY";
			}
			hr = document.createElement('hr');
			yourDiv = document.createElement('div');
			yourDiv.setAttribute("id", "yourDiv");
			yourDiv.innerHTML = data[i].name;
			List.appendChild(yourDiv);
			List.appendChild(hr)
		}

		else{
			hr = document.createElement('hr');
			element = document.createElement('div');
			element.innerHTML = data[i].name;
			List.appendChild(element);
			List.appendChild(hr)
		}
	}
});

// Printing start on everyone ready
socket.on('START', function(){
	console.log('GAME IS READY TO BEGIN!!!')
});





class user {
  constructor(name,ID) {
    this.id = ID;
    this.name = name;
    this.role = null;
  }
}

// Generating a random ID 
function generate() {
  return '_' + Math.random().toString(36).substr(2, 9);
};



// DUMMY LIST OF PLAYERS
listOfPlayersNames = ['Marwin','Abdulkader','Luc','JP','Vasilli','Akash','Filip','GoogleBurger','El Chupacabra','Wumpus'];
listOfPlayers = [];
var i = 0;
var player;
var id;
for (i=0;i<listOfPlayersNames.length;i++){
    id = generate();
    player = new user(listOfPlayersNames[i],id);
    listOfPlayers.push(player);
}

listOfPlayersIDs = [];
for (i=0;i<listOfPlayers.length;i++){
    listOfPlayersIDs.push(listOfPlayers[i].id);
}


listOfRoles = ['werewolf','werewolf','werewolf','villager','villager','villager','hunter','seer','witch','cupid'];

function assignRoles(players,roles){
    var index;
	for (i=0;i<players.length;i++){
        index = Math.floor(Math.random()*roles.length);
        players[i].role = roles[index];
        alert(players[i].name+" is "+roles[index]);
        roles.splice(index,1);
        
    }
}

assignRoles(listOfPlayers,listOfRoles);




