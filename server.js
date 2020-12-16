var express = require('express');
var socket = require('socket.io');


//  ---------- SERVER SIDE ----------

//  ---------- CLASSES ---------- //

// Player class
class Player {
  constructor(name, id, ready, socket_id) {
    this.name = name;
    this.id = id;
    this.ready = ready;
    this.socket = socket_id;
  }
}

class Room {
    constructor(name, id, max_players){
        this.name = name;
        this.id = id;
        this.max_players = max_players;
        this.Players = [];
}

addplayer(playerid,name){
    var nplayer = new Player(playerid,this);
    this.Players.push(nplayer);
    }
} 


//  ---------- VARIABLES ---------- //

rooms = []
player_li = []

// redirections 
var destination = ['/lobby.html', '/room.html', '/host.html'];


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

// Checking all the rooms and their Players list, if no one connects for more than 10 seconds,
// it gets deleted 
function deleteRoom(room){
    if (room.Players === undefined || room.Players.length == 0) {
        return 1;
    }
    else{
        return 0;
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


// LOGIN FUNCTIONS

	// Redirect player once it has it's name and ID in localstorage
	socket.on('lobby', function(){
		socket.emit('lobby', destination[0])
	});


// LOBBY FUNCTIONS

    // Sending all sockets in the lobby to inform them about the number of players in each room
    socket.on('getRooms', function(){
        socket.emit('getRooms', rooms);
    });
	
    // Redirect to host
    socket.on('host', function(){
        socket.emit('host', destination[2]);
    });

	
// ROOM FUNCTIONS


    // Joining room data[0] - player name, data[1] - player ID, data[2] - id of room joined. data[3] - socket.id
    socket.on('giveID', function(data){
        console.log(data);
        var room;
        for (i = 0; i < rooms.length; i++){
            if (data[2] == rooms[i].id){
                room = rooms[i];

                let player = new Player(data[0], data[1],  false, data[3]);
                room.Players.push(player);

                // The ready buttons resets once someone new joins the game, makes infinite loop
                // for (i = 0; i < room.Players; i++){
                //     room.Players[i].ready = false;
                // }
            }
        }
        for (i = 0; i < room.Players.length; i++){
            io.to(room.Players[i].socket).emit('getNames', room.Players);
        }
});

    // Function that changes the name of the player who sent the request
    socket.on('changeName', function(data){
        for (i = 0; i < rooms.length; i++){
            current = rooms[i];
            for (j = 0; j < current.Players.length; j++){
                console.log('testing ', current.Players[j].name, data[0]);
                if (current.Players[j].id == data[1]){
                    console.log('List of Names ', current.Players);
                    current.Players[j].name = data[0];
                    for (i = 0; i < current.Players.length; i++){
                        console.log(current.Players);
                        io.to(current.Players[i].socket).emit('getNames', current.Players);
                    }
                }
            }
        }
    });

    // Setting the ready attribute of Player
    socket.on('ready', function(){
        for (i = 0; i < player_li.length; i++){
    		if (player_li[i].id == socket.id){
    			player_li[i].ready = true;
                io.to('room1').emit('getNames', player_li);
    		}
    	}
    	if (check(player_li) == 'start'){
    		console.log('server side ready');
    		io.to('room1').emit('START');

    	};
    });

	
// HOST FUNCTIONS

    socket.on('createRoom', function(data){
        socket.emit('lobby', destination[0]);
        let room = new Room(data[0], data[1], data[2]);
        rooms.push(room);
});
	
// Doesn't work as inteded, because once more rooms are created, the timer doubles in speed.
// TODO: create a seperate timer somehow that checks and runs for each room added. 

    //     timer = 0;
    //     var myTimer = setInterval(function(){
    //         deleteRoom(room);
    //         if (deleteRoom(room) == 1){
    //             timer += 1;
    //             if (room.Players.length != 0){
    //                 clearInterval(myTimer);
    //                 timer = 0;
    //             }
    //             if (timer == 10){
    //                 clearInterval(myTimer);
    //                 timer = 0;
    //                 for (i = 0; i < rooms.length; i++){
    //                     if (room.id == rooms[i].id){
    //                         rooms.splice(i, 1);
    //                     }
    //                 }
    //             }
    //         }
    //         console.log(timer);
    //     },1000);

    // });


    // redirecting player to room1, must be bellow socket.on 'giveID'
    socket.on('roomRedirect', function(){
    	socket.emit('redirect', destination[1])
});
 	socket.on('disconnect', () => {
        for (i = 0; i < rooms.length; i++){
            current = rooms[i];
            for (j = 0; j < current.Players.length; j++){
                if (current.Players[j].socket == socket.id){
                    console.log('List of Names ', current.Players);
                    current.Players.splice(j, 1);
                    for (i = 0; i < current.Players.length; i++){
                    console.log(current.Players);
                    io.to(current.Players[i].socket).emit('getNames', current.Players);
                    }
                }
            }
        }
        console.log(socket.id, ' Disconnected');
  });
});
