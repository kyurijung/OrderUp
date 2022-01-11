// Handles the logging in the user

// Global variable to send to server
let userSession = {};

// Init() called onload of the / view
function init() {
	document.getElementById("loginButton").onclick = function(){login()};
}

// Logs the user in to the session and redirects them to the logged in home page
function login() {
    // Gather the data in a single object to send as a request
	userSession.username = document.getElementById("username").value;
	userSession.password = document.getElementById("password").value;
    // If fields are blank prompt the user to try again
    if (userSession.username=="" || userSession.password=="" || userSession.username==undefined || userSession.password==undefined) {
        alert("The required fields are blank! Please try again.");
        window.location.replace('/');
        return;
    }
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4){
            if (this.status==200) {
                // After successfully registering user redirect to their logged in home page
                window.location.replace(`/`);
            } else {
                // When username or password doesn't match anything from the database prompt user to try again
                alert("The username or password is incorrect! Please try again.");
                window.location.replace('/');
            }
		}
	}
	req.open("POST", `/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(userSession));
}