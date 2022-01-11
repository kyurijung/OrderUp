// Handles logging out the user

// Init() called onload of the multiple views
function init() {
	document.getElementById("logoutButton").onclick = function(){logout()};
}

// Logs the user out of the session and redirects them to the logged out home page
function logout() {
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			// Redirect to the logged out home page
            window.location.replace(`/`);
		}
	}
	req.open("POST", '/logout');
	req.send();
}