var socket = io.connect('http://localhost:4000');
var create = document.getElementById('host-a-game');



const room_card_container = document.getElementsByClassName("game-rooms-container-child")[0];

//function to create game room cards
// parameter name is the game room name
function create_game_room_card(name, players_in_game, max_players) {

    const card = document.createElement("div");
    card.setAttribute('class', 'room-card');

    const room_name = document.createElement("h2");
    room_name.innerText = name;
    card.appendChild(room_name);

    const ctj_text = document.createElement("h5");
    ctj_text.innerText = "Click to join!"
    card.appendChild(ctj_text);

    const player_in_room = document.createElement("p");
    player_in_room.innerText = "Players: " + players_in_game + "/" + max_players;
    player_in_room.setAttribute("class", "numOfPlayers");
    card.appendChild(player_in_room);


    card.classList.add("room-card");

    room_card_container.appendChild(card);

}


// a function to update the current player in room
// parameter num is of type string and should be of format "current player number / Max Player number"
function update_player_num_in_room(card, num) {
    card.getElementsByTagName("p")[0].innerText = num;
}



// Call redirection
create.addEventListener('click', e => {
	socket.emit('host')
});

// Redirect
socket.on('host', function(data){
    window.location.href = data;
});


// Sending a request every 1 second for the list update
setInterval(function(){
     socket.emit('getRooms')
},1000);

socket.on('getRooms', function(rooms_li){
    room_card_container.innerHTML = '';
    for (i = 0; i < rooms_li.length; i++){
        create_game_room_card(rooms_li[i].name, rooms_li[i].Players.length, rooms_li[i].max_players);
        room_card_container.children[i].setAttribute("id", rooms_li[i].id);
    }

    // YES!!! This is what we need!!! 
    // select a list of elements and send the id of the room to join ..
    document.querySelectorAll('div.room-card').forEach(item => {
        item.addEventListener('click', event => {
            // adding room id to localstorage
            var json = JSON.parse(localStorage.getItem('MyVariable'));
            old_name = JSON.parse(localStorage.getItem('MyVariable'))['name'];
            old_id = JSON.parse(localStorage.getItem('MyVariable'))['id'];
            localStorage.clear();
            localStorage.setItem("MyVariable", JSON.stringify({'name' : old_name, 'id' : old_id, 'room_id' : item.id}));    
            socket.emit('roomRedirect');
        })
    })
});

socket.on('redirect', function(destination){
    window.location.href = destination;
});
