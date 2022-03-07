import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";
import { logout } from "./login";

/////////////////////////////////////////////////////////// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");

/////////////////////////////////////////////////////////// DISPLAY MAP
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

/////////////////////////////////////////////////////////// EVENT LISTENERS
//////////////////////////////////////////// LOG IN
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
//////////////////////////////////////////// LOG OUT
if (logOutBtn) logOutBtn.addEventListener("click", logout);
