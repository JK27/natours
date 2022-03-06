import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";

/////////////////////////////////////////////////////////// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");

/////////////////////////////////////////////////////////// DISPLAY MAP
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

/////////////////////////////////////////////////////////// SUBMIT EVENT LISTENER
if (loginForm) {
	loginForm.addEventListener("submit", e => {
		// DOES => Prevents form from loading any other page.
		e.preventDefault();
		// DOES => Gets email and password from form data
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		login(email, password);
	});
}
