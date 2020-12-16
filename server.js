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
        this.game_data = null;
        
}

addplayer(playerid,name){
    var nplayer = new Player(playerid,this);
    this.Players.push(nplayer);
    }
} 


//  ---------- VARIABLES ---------- //

rooms = []
player_li = [] // this is to be rooms[i].Players.length()

// redirections 
var destination = ['/lobby.html', '/room.html', '/host.html', '/game_page.html'];


// functions

// TODO You have to implement a way to make sure that every time this function is called that
// it doesn't go through the list again, but just retruns a value.
function check(li){
	all_ready = false

	for (i = 0; i < li.length; i++){
		if(li[i].ready == false){
            all_ready = false;
            console.log(li[i].name+ " Not ready!")
            return
		}	
    }
    return 'start';
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

function get_roomBy_ID(room_id){
    for (i = 0; i < rooms.length; i++){
            
        if (rooms[i].id == room_id){
            return rooms[i]
        }
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
                //player_li.push(player)
                // The ready buttons resets once someone new joins the game, makes infinite loop
                // for (i = 0; i < room.Players; i++){
                //     room.Players[i].ready = false;
                // }
            }
        }
        // IMPORTANT NOTE, the server gets an error when there are people in rooms left over, 
        // you should probably put a conditional here to check whether room is none
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
    socket.on('ready', function(data){
        let room_id = data[0]
        for (i = 0; i < rooms.length; i++){
            
            if (rooms[i].id == room_id) {
             
            
                for (j = 0; j < rooms[i].Players.length; j++) {
                    if (rooms[i].Players[j].id == data[1]){
                        rooms[i].Players[j].ready = true;
                        //io.to('room1').emit('getNames', rooms[i].Players);
                        socket.emit('getNames', rooms[i].Players);
                        console.log(rooms[i].Players);
                        //socket.emit('checked', check(rooms[i].Players))
                        player_li = rooms[i].Players
                        game_room = i
                    }
                }
            }
    		
    	}
    	if (check(player_li) == 'start'){
    		console.log('server side ready');
            //io.to('room1').emit('START');
            let sth = [room_id, destination[3]]
            let pid = []
            let p_names = []
            for (i=0; i< player_li.length ; i++){
                pid.push(player_li[i].id)
                p_names.push(player_li[i].name)
            }
            io.sockets.emit('START', sth);
            
            rooms[game_room].game_data = create(pid, p_names, room_id)
            console.log("player Id: "+pid)
            console.log("player names: "+p_names)
            //console.log("New game Object" + rooms[game_room].game_data)
        }
        else {
            console.log("All players not ready")
        }
    });

    //socket.on('begin_game', function(){
      //  socket.emit('redirect_to_game', destination[3])
        
   // });

    //
    socket.on('show_players', function(data){
        let room = get_roomBy_ID(data)

        let pid = []
        let p_names = []
        for (i=0; i< player_li.length ; i++){
            pid.push(player_li[i].id)
            p_names.push(player_li[i].name)
        }

        console.log(room.id + ":RoomID")
        socket.emit('show_players', room.Players)
        
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
                    //console.log('List of Names ', current.Players);
                    current.Players.splice(j, 1);
                    for (i = 0; i < current.Players.length; i++){
                    //console.log(current.Players);
                    io.to(current.Players[i].socket).emit('getNames', current.Players);
                    }
                }
            }
        }
        console.log(socket.id, ' Disconnected');
  });
});



//-------------------------------------------------system.js---------------

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  //Cupid, Seer, WW, WhiteWW, Witch, Villager, Hunter,
  //ids = list
  //names= list
  //game= string
function create(ids,names,gameid){
    var ng = new Game(gameid);
    if (ids.length < 12){
      var roles=["WW","WW","Seer","Witch","Hunter","Cupid"];
      for (i = 0; i < (ids.length - 6); i++) {
        roles.push("Villager");
        }
    }else if((ids.length > 11 && ids.length < 18)){
      var roles=["WW","WW","WW","Seer","Witch","Hunter","Cupid"];
      for (i = 0; i < (ids.length - 7); i++) {
        roles.push("Villager");
        }
    }else if((ids.length > 17 )){
      var roles=["WW","WW","WW", "WW","Seer","Witch","Hunter","Cupid"];
      for (i = 0; i < (ids.length - 8); i++) {
        roles.push("Villager");
        }
    }
    shuffled=shuffle(roles);
    for (i = 0; i < (ids.length); i++){
      var np = new GamePlayer(ng, ids[i], names[i], shuffled[i]);
      np.checkwitch();
      console.log("np.id display role ");
      ng.addplayer(np);
      ng.Roles.push(np.role);
      ////////
    }
    return ng;

  }
  
class GamePlayer{
    constructor(game,id, name, role){
      this.game=game;
      this.id=id;
      this.name=name;
      this.role=role;
      this.status=0; //alive=0, selected=1, dead=2;
      this.lovebird=false;
      this.killpotion=false;
      this.savepotion=false;
    }
    checkwitch(){
      if (this.role=="Witch"){
        this.killpotion=true;
        this.savepotion=true;
      }
    }
    seeRole(){
      return this.role;
    }
    killplayer(x){
      x.status=1;
    }
    vote(x){
      this.game.Votes.push(x);
    }
    wwvote(x){
      this.game.wwVotes.push(x);
    }
  }
  
  
class Game{
    constructor(name){
      this.Name = name;
      this.Players=[];
      this.Dead=[];
      //this.Status=0; //lobby=0, running=1, ended=2,
      this.Roles=[];
      this.Winners=[];
      this.Losers=[];
      this.Votes=[];
      this.wwVotes=[];
      this.Phases=0; //0=setup, 1=Cupid, 2=seer, 3=WW, 4=WhiteWW, 5=Witch, 6=Day, 61=Hunter, 62=lovers
      this.Nights=0;
    }
    addplayer(player){
      this.Players.push(player);
    }
    deleteplayer(playerid){
      this.Players.pop(playerid);
    }
    killplayer(x){
      x.status=2;
      this.Dead.push(x);
    }
    printnames(){
      console.log(this.Players);
      return this.Players;
    }
  }

    