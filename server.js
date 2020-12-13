const { v4: uuidv4 } = require('uuid');
var express = require('express');
var socket = require('socket.io')


// --------------------------------------------------- THE GAME SIDE --------------------------------------------------- //

var players = [];

// Define the class for session
class session {
  constructor(name) {
    this.name = name;
    this.werewolves = [];
	this.villagers = [];
	this.witch = null;
	this.hunter = null;
	this.seer = null;
	this.cupid = null;
	this.lovers = [];
  }
}

// Initiating dummy session object
session1 = new session("Session 1");
session1.players = ["Filip","Vassili","Luc","Abdulkader","Alvaro","Marwin","JP","Akash"];
session1.werewolves.push("Filip");
session1.werewolves.push("Vassili");
session1.werewolves.push("Luc");
session1.villagers.push("Abdulkader");
session1.villagers.push("Alvaro");
session1.witch = "Marwin";
session1.hunter = "JP";
session1.seer = "Akash";


// Define the class for users
class user {
  constructor(name,ID) {
    //this.id = uuidv4();
	this.name = name;
	this.id = ID;
  }
} 





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

io.on('connection', function(socket){
	console.log('made the connection');
	console.log(socket['id']) // the ID of the user

	//console.log(players)

	// gets fired if chat object is sent
	socket.on('chat', function(data){ //chat refers to object sent by chat.js

		players.push({
			conn_id : socket['id'],
			user_name : data['handle']
		})

		//console.log(players)
		//sockets means every socket
		io.sockets.emit('chat', data); // sending the same object with name chat to all sockets
	});

	// gets fired if get_number_of_players object is received from the client
	socket.on('get_number_of_players', function(data){
		number_of_players = [[10,12],[22,25],[5,8]];
		//console.log(players)
		//sockets means every socket
		io.sockets.emit('get_number_of_players', number_of_players); // sending the same object with name get_number_of_players to all sockets
	});

	// gets fired if get_session object is received from the client
	socket.on('get_session', function(data){
	
		//sockets means every socket
		io.sockets.emit('get_session', session1); // sending the same object with name session1 to all sockets
	});

	// gets fired if new_user object is received from the client
	socket.on('new_user', function(data){
	
		//sockets means every socket
		//response = addNewUser(data);
		//data = JSON.stringify(data);
		//console.log(data);
		var x = addNewUser(data);
		if(x){
			console.log("added",data,"to list USERS");
		}
		else{
			console.log("received request to add",data,"to list USERS, but the list already contained a user with that name");
		}
		
		io.sockets.emit('new_user_attempt_result', {
			nickname: data.name,
			added: x});
		
	});

});


var users_that_didnt_join_a_game_yet = [];
//x = new user("Jenkins",123);
//var data = JSON.stringify(x);
//users.push(data);
var y = new user("Jenkins",123);
users_that_didnt_join_a_game_yet.push(y);
console.log(users_that_didnt_join_a_game_yet);
function addNewUser(x){
	//console.log(y);
	console.log(users_that_didnt_join_a_game_yet[0]);
	//var z = JSON.parse(x)
	var z = new user(x.name,x.id);
	//console.log(z);
	//console.log(users[0]);
	//console.log(user);
	var N = users_that_didnt_join_a_game_yet.length;
	var i = 0;
	var test = 1;
	for (i=0; i<N; i++){
		if ( users_that_didnt_join_a_game_yet[i].name == z.name){
			test = 0;
		}
	}
	if (test){
		users_that_didnt_join_a_game_yet.push(x);
	}
	return test;
}













