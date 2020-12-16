
var socket = io.connect('http://localhost:4000');


// function tocreate player avatar/ card
function create_player_card(player_name, id, role) {

    let avatar_container = document.getElementsByClassName("player-card-container")[0];


    const card = document.createElement("div");
    card.isSelected = false;
    card.id = id
    card.classList.add("card");

    // initiating the tick sign and adding properties
    const tick_sign = document.createElement("img");
    tick_sign.src = "./source/img/tick_sign.png";
    tick_sign.alt = "tick sign";
    // add tick to card
    card.appendChild(tick_sign);


    // text span
    const text_span = document.createElement("span");
    text_span.innerText = player_name;
    text_span.classList.add("text-span");

    // add text to card
    card.appendChild(text_span);


    // adds the card to container
    avatar_container.appendChild(card);


    // click listener
    card.addEventListener('click', event => {

        console.log("card clicked");

        if (card.isSelected === false) {

            // if the card is not selected yet, then select it

            tick_sign.style.visibility = "visible";

            card.isSelected = true;

        } else {

            tick_sign.style.visibility = "hidden";

            card.style.border = "none"

            card.isSelected = false;

        }

    });

}

function display_self(){
    room = JSON.parse(localStorage.getItem('MyVariable'))['room_id'];
    socket.emit('show_players', room)
    socket.on('show_players', function(data){
        for (i=0;i < data.length; i++){
            create_player_card(data[i].name, data[i].id, data[i].role)
        }
    });
}


// next button 
const next_button = document.getElementById("next-btn");

next_button.addEventListener("click", () => {

    // add implementation to what happen when the next button is clicked


});


// updates the title
function update_title(text){
    document.getElementById("title").innerText = text;
}


// updates the subtile
function update_subtitle(text){
    document.getElementById("subtitle").innerText = text;
}



