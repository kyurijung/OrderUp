// Handles new user registration

// Global variable to send to server
let user = {};

// Init() called onload of the /register view
function init(){
	document.getElementById("registerButton").onclick = function(){register()};
}

// Adds the user to database by sending a post request
// Once the request is fulfilled redirect user to their new profile /users/:id/ view
function register() {
    // Gather the data in a single object to send as a request
	user.username = document.getElementById("username").value;
	user.password = document.getElementById("password").value;
    user.privacy = false;
    // If fields are blank prompt the user to try again
    if (user.username=="" || user.password=="" || user.username==undefined || user.password==undefined) {
        alert("The required fields are blank! Please try again.");
        window.location.replace('/register');
        return;
    }
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4){
            if (this.status==200) {
                // After successfully registering user redirect to their new profile
                window.location.replace(`/users/${this.responseText}`);
            } else {
                // When username is already taken prompt the user to try again
                alert("The username is already taken! Please try again.");
                window.location.replace('/register');
            }
		}
	}
	req.open("POST", `/users`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(user));
}