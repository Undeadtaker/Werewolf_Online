
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


