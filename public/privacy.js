// Handles the privacy changes for the logged in user

// Global variable to send to server
let user = {};

// Init() called onload of the /users/:id view
function init() {
	document.getElementById("submitButton").onclick = function(){changePrivacy()};
    document.getElementById("logoutButton").onclick = function(){logout()};
}

// Updates the user's privacy setting from the database by sending a post request
function changePrivacy() {
    // Gather the data in a single object to send as a request
    user.username = theUser.username;
    if (document.getElementById("private").checked) {
        user.privacy = true;
    } else if (document.getElementById("public").checked) {
        user.privacy = false;
    } else {
        // If fields are blank prompt the user to try again
        alert("The required fields are blank! Please try again.");
        window.location.replace(`/users/${theUser._id}`);
        return;
    }
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            // After successfully registering user redirect to their same profile
            window.location.replace(`/users/${this.responseText}`);
		}
	}
	req.open("POST", `/privacy`);
    req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(user));
}

// Put logout functionality here for the header to work properly
// (Could not find a way to script multiple js src in pug file)
function logout() {
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            window.location.replace(`/`);
		}
	}
	req.open("POST", '/logout');
	req.send();
}