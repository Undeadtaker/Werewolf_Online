var express = require('express');
var socket = require('socket.io');






//  ---------- SERVER SIDE ----------


// Player class
class Player {
  constructor(name, id, ready) {
    this.name = name;
    this.id = id;
    this.ready = ready;
  }
}


// variables
player_li = []

// redirections 
var destination = '/room.html';

// functions

// TODO I have to implement a way to make sure that every time this function is called that
// it doesn't go through the list again, but just retruns a value.
function check(li){
	all_ready = false

	for (i = 0; i < li.length; i++){
		if(li[i].ready == false){
			all_ready = false;
		}	
		else{
			all_ready = true;
		}	
	}
	if (li.length >= 6 && all_ready == true){
		console.log('The game starts soon!')
		return ('start');
		}
}
















// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));



//--------------------------------------- SOCKET ----------------------------------------// 


// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);


// LOBBY FUNCTIONS

    // Sending all sockets in the lobby to inform them about the number of players in each room
    socket.on('getPlayers', function(){
        socket.emit('getPlayers', player_li.length);
    });
	





// ROOM1 FUNCTIONS

    // Joining room1
    socket.on('giveID', function(data){
    	let player = new Player("Player", data, false);
    	player_li.push(player)
    	socket.join('room1');

    	console.log(player_li)
    	for (i = 0; i < player_li.length; i++){
    		player_li[i].ready = false;
    	}
    });

    // Function that changes the name of the player who sent the request
    socket.on('changeName', function(name){
    	for (i = 0; i < player_li.length; i++){
    		if (player_li[i].id == socket.id){
    			player_li[i].name = name;
    		}
    	}
    });

    // Sending all sockets in the room the names of the players
    socket.on('getNames', function(){
        socket.emit('getNames', player_li);
    });

    // Setting the ready attribute of Player
    socket.on('ready', function(){
        for (i = 0; i < player_li.length; i++){
    		if (player_li[i].id == socket.id){
    			player_li[i].ready = true;
    		}
    	}
    	if (check(player_li) == 'start'){
    		console.log('server side ready');
    		io.to('room1').emit('START');

    	};
    });









    // redirecting player to room1, must be bellow socket.on 'giveID'
    socket.on('room1', function(data){
    	socket.emit('redirect', destination)

});

 	socket.on("disconnect", function (){
 		for (i = 0; i < player_li.length; i++){
 			if (player_li[i].id == socket.id){
 				player_li.splice(i, 1)
 			}
 		}
  		console.log(this.id + ' disconnected'); // this.id is the 'id' of the socket that got disconnected
});

});


