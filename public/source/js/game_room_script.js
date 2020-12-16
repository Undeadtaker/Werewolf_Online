

var socket = io.connect('http://localhost:4000');
var button = document.getElementById('send');
var ready = document.getElementById('ready');
var name = JSON.parse(localStorage.getItem('MyVariable'))['name'];

console.log(name);

console.log(ready);
console.log(ready.innerHTML);

// ---------------------------------------- AKASHES PART ----------------------------------------------#

const colors = ["#5F0F40", "#9A031E", "#FB8B24", "#E36414", "#0F4C5C", "#2A9D8F", "#E9C46A", "#E76F51", "#240046"]
const container = document.getElementById("player-avatar-container");


// a function to update the current player in room
// parameter num is of type string and should be of format "current player number / Max Player number"
function set_player_num(num) {
    document.getElementById("player-number").innerText = num;
}


// function to add player avatar
function add_avatar(player_name) {

    const avatar = document.createElement("div");
    const name = document.createElement("p");
    name.innerText = player_name;
    avatar.appendChild(name);

    // random border color
    color = colors[Math.floor(Math.random() * Math.floor(colors.length))]
    avatar.style.border = "2px solid " + color;
    avatar.classList.add("player-avatar");
    container.appendChild(avatar);
}

// function to remove avatar
// parameter avatar is a reference to the player avatar
function remove_avatar(avatar) {
    if (avatar) {
        avatar.remove();
    }
}

// ----------------------------------------------------------------------------------------------------#

// My code

// on connect give id of player 
socket.on('connect', () => {
    local = JSON.parse(localStorage.getItem('MyVariable'));
    old_name = JSON.parse(localStorage.getItem('MyVariable'))['name'];
    old_id = JSON.parse(localStorage.getItem('MyVariable'))['id'];
    socket.emit('giveID', [name, local.id, local.room_id, socket.id]);
 });


// Change the name of the Player on button click, also changes value for localstorage
button.addEventListener('click', function(){
  name = document.getElementById("name").value;
  room = JSON.parse(localStorage.getItem('MyVariable'))['room_id'];
  Player_ID = JSON.parse(localStorage.getItem('MyVariable'))['id']; // ID to be copied
  socket.emit('changeName', [document.getElementById("name").value, Player_ID]);
  localStorage.clear();
  localStorage.setItem("MyVariable", JSON.stringify({'name' : document.getElementById("name").value, 'id' : Player_ID, 'room_id' : room}));
  document.getElementById("name").value= "";

});

// send ready to server
ready.addEventListener('click', function(){
  socket.emit('ready');
});

// Get list of player names (updates on socket connection)
socket.on('getNames', function(data){
    //alert(data[1].name);
    container.innerHTML = '';
    for (i = 0; i < data.length; i++){
        if (socket.id == data[i].id){
            if (data[i].ready == true){
                ready.innerHTML = "waiting for others";
            }
            if (data[i].ready == false){
                ready.innerHTML = "READY";
            }
        }

        add_avatar(data[i].name)
        //alert(data[i].name);
    }
});




// Printing start on everyone ready, doesn't work, you have to make it.
socket.on('START', function(){
    console.log('GAME IS READY TO BEGIN!!!')
});
