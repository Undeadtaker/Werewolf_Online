

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