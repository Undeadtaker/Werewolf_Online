
// Generating a random ID 
function generate() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Create socket connection
var socket = io.connect('http://localhost:4000');
var btn = document.getElementById('button');

// Getting name from input and calling the redirect
btn.addEventListener('click', function(){
    if (document.getElementById("nickname").value == ''){
        return alert('Field is empty');
    }
    localStorage.setItem("MyVariable", JSON.stringify({'name' : document.getElementById("nickname").value, 'id' : generate()}));
    var x = JSON.parse(localStorage.getItem('MyVariable'));  // If you want to access nickname and id use this line!!!
    document.getElementById("nickname").value = '';
    socket.emit('lobby');
}
)

// Redirect
socket.on('lobby', function(data){
    window.location.href = data;
});





















// Listen for events
socket.on('chat', function(data){
    output = document.getElementById('output');
	output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
// if a get_number_of_players object is received from the server, function(data) is executed.
// this function updates the number of players that is displayed in the lobby (xx/xx), for each room
socket.on('get_number_of_players', function(data){
	var rooms = document.getElementById("rooms_container").children;
	for (var i = 0; i < rooms.length; i++) {
		rooms[i].children[1].innerHTML = "number of players: "+data[i][0]+"/"+data[i][1];
	}
});

//TheSession = null;
// triggered when a get_session event is detected. A get_session event sends the client the data required to create an object of class Session
socket.on('get_session', function(data){
    localStorage.setItem("session", JSON.stringify(data));

});

socket.on('new_user_attempt_result', function(data){
    if (!(data.added)){
        alert("Nickname taken! Please choose another one");
    }
    else{
        localStorage.setItem("nickname", data.nickname);
        window.location.href = "lobby.html";
        //var y = localStorage.getItem("nickname");
        //alert(y);
    }

});


function storeSession(x){
    TheSession = new session(x.name);
    TheSession.werewolves = x.werewolves;
    TheSession.villagers = x.villagers;
    TheSession.witch = x.witch;
    TheSession.hunter = x.hunter;
    TheSession.seer = x.seer;
    localStorage.setItem("session", TheSession);
    localStorage.setItem("test", 1500);
    //alert(TheSession.seer);
}




// Define the class for sessions
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

// Define the class for users
class user {
  constructor(name,ID) {
    //this.id = uuidv4();
    this.id = ID;
    this.name = name;
  }
} 

// Initiating dummy session object

//x = new session("Session 1");
//x.players = ["Filip","Vassili","Luc","Abdulkader","Alvaro","Marwin","JP","Akash"];
//x.werewolves.push("Filip");
//x.werewolves.push("Vassili");
//x.werewolves.push("Luc");
//x.villagers.push("Abdulkader");
//x.villagers.push("Alvaro");
//x.witch = "Marwin";
//x.hunter = "JP";
//x.seer = "Akash";

var myRole = null;
var myUsername = null;
//x = new user("Jenkins",123);
//newUser(x);
//javscript for game_page
function revealPlayers(){
    var x = JSON.parse(localStorage.getItem('session'));
    TheSession = new session(x.name);
    TheSession.werewolves = x.werewolves;
    TheSession.villagers = x.villagers;
    TheSession.witch = x.witch;
    TheSession.hunter = x.hunter;
    TheSession.seer = x.seer;

    var players = [];


    var i;
    for (i=0;i<TheSession.werewolves.length;i++){
        players.push([TheSession.werewolves[i],"w"]);
    }

    for (i=0;i<TheSession.villagers.length;i++){
        players.push([TheSession.villagers[i],"v"]);
    }

    players.push([TheSession.witch,"wi"]);
    players.push([TheSession.hunter,"h"]);
    players.push([TheSession.seer,"s"]);

    var grid = document.getElementById("theGrid");
    var cards = grid.children;
    var N = players.length;
    for (i = 0; i < N; i++) {
         cards[i].innerHTML = players[i][0];
         if(players[i][1] == "w"){
            cards[i].style.backgroundImage = 'url("werewolf-card.png")';
         }

         if(players[i][1] == "wi"){
            cards[i].style.backgroundImage = 'url("witch-card.png")';
         }

         if(players[i][1] == "h"){
            cards[i].style.backgroundImage = 'url("hunter-card.png")';
         }

         if(players[i][1] == "s"){
            cards[i].style.backgroundImage = 'url("seer-card.png")';
         }
    }
    //N=30;
    setTimeout(function(){fadeIn(cards,N,0.1)},100);
    setTimeout(function(){fadeIn(cards,N,0.3)},250);
    setTimeout(function(){fadeIn(cards,N,0.5)},300);
    setTimeout(function(){fadeIn(cards,N,0.7)},350);
    setTimeout(function(){fadeIn(cards,N,1)},450);
}

function fadeIn(x,y,z){
    for (i = 0; i < y; i++){
        x[i].style.opacity = z;
    }
}


function revealRole(playersToReveal,role){
    var grid = document.getElementById("theGrid");
    var cards = grid.children;
    var N = players.length;
    for (i = 0; i < playersToReveal.length; i++) {
        for (j = 0; j < N; j++) {
            if(cards[j].innerHTML == playersToReveal[i]){
                 if(role == "w"){
                    cards[i].style.backgroundImage = 'url("werewolf-card.png")';
                 }

                 if(role == "wi"){
                    cards[i].style.backgroundImage = 'url("witch-card.png")';
                 }

                 if(role == "h"){
                    cards[i].style.backgroundImage = 'url("hunter-card.png")';
                 }

                 if(role == "s"){
                    cards[i].style.backgroundImage = 'url("seer-card.png")';
                 }
            }
        }
    }     
}


function hideRole(){
    var grid = document.getElementById("theGrid");
    var cards = grid.children;
    var N = players.length;
    for (i = 0; i < N; i++) {
        cards[i].style.backgroundImage = 'url("villager-card.png")';
    }
}


function timer1(z){
    image1 = $('body').css('background-image');
    image2 = image1.slice(0,image1.length - 13)+'day.jpg")';
    var t = document.getElementById("timer");
    y = z;
    x = z;
    var time = setInterval(timer2, 1000);
}

var y = 0;
var image1 = null;
var image2 = null;
var x = 0;
var s1 = ["NIGHT   "," seconds until day."];
var s2 = ["DAY   "," seconds until night."];
var s = s1;

function timer2(){
   
    var t = document.getElementById("timer");
    if(x!=0){
        x = x - 1;
        t.innerHTML = s[0] + x + s[1];
    }
    else{
        t.innerHTML = x;
        if ($('body').css('background-image') == image1){
            document.body.style.backgroundImage = image2;
            s = s2;
        }
        else{
            document.body.style.backgroundImage = image1;
            s = s1;
        }
        x = y;
    }
}

function checkNickname(){
    var nickname = document.getElementById("nickname").value;
    if (nickname!=''){
        x = new user(nickname,null);
        newUser(x);
    }
    else{
        alert(nickname);
        alert("nickname field empty");
    }
}

function showNickname(){
    localStorage.setItem("MyVariable", data.nickname);
    var nickname = localStorage.getItem('MyVariable');
    document.getElementById("nickname_box").innerHTML = nickname;
}
