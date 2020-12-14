const room_card_container = document.getElementsByClassName("game-rooms-container-child")[0];

// event listener for hosting a game.
document.getElementById("host-a-game").addEventListener("click", () => {

    // add implementation


});


//function to create game room cards
// parameter name is the game room name
function create_game_room_card(name) {

    const card = document.createElement("div");

    const room_name = document.createElement("h2");
    room_name.innerText = name;
    card.appendChild(room_name);


    const ctj_text = document.createElement("h5");
    ctj_text.innerText = "Click to join!"
    card.appendChild(ctj_text);

    const player_in_room = document.createElement("p");
    player_in_room.innerText = "0/0";
    player_in_room.setAttribute("class", "numOfPlayers");
    card.appendChild(player_in_room);

    card.addEventListener("click", () => {

        // add code here for what happens when player clicks on a card to join a room (a function preferrably)

    });

    card.classList.add("room-card");

    room_card_container.appendChild(card);

}


// a function to update the current player in room
// parameter num is of type string and should be of format "current player number / Max Player number"
function update_player_num_in_room(card, num) {
    card.getElementsByTagName("p")[0].innerText = num;
}

create_game_room_card('Room1');
create_game_room_card('Room2');
create_game_room_card('Room3');
