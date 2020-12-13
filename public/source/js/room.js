

var socket = io.connect('http://localhost:4000');

// Open room.html to see the id of these tags
var button = document.getElementById('send');
var List = document.getElementById('players-list');
var ready = document.getElementsByClassName('btn')[0];







// on connect give id of player 
socket.on('connect', () => {
	socket.emit('giveID', socket.id);
 });



// TODO: Write javascript that says if the name is not equal to Player, the change Name dissapears
// Create a evenet listener that changes the name of the player
button.addEventListener('click', function(){
  socket.emit('changeName', document.getElementById("name").value);
  document.getElementById("name").value= "";
});

// send ready to server
ready.addEventListener('click', function(){
  socket.emit('ready');
});








// Get list of player names (updates every second)
setInterval(function(){
    socket.emit('getNames')
},1000);

socket.on('getNames', function(data){
	List.innerHTML = '';

	for (i = 0; i < data.length; i++){
		if (socket.id == data[i].id){
			if (data[i].ready == true){
				ready.innerHTML = "waiting for others";
			}
			if (data[i].ready == false){
				ready.innerHTML = "READY";
			}
			hr = document.createElement('hr');
			yourDiv = document.createElement('div');
			yourDiv.setAttribute("id", "yourDiv");
			yourDiv.innerHTML = data[i].name;
			List.appendChild(yourDiv);
			List.appendChild(hr)
		}

		else{
			hr = document.createElement('hr');
			element = document.createElement('div');
			element.innerHTML = data[i].name;
			List.appendChild(element);
			List.appendChild(hr)
		}
	}
});

// Printing start on everyone ready
socket.on('START', function(){
	console.log('GAME IS READY TO BEGIN!!!')
});






