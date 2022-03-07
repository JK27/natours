import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";
import { logout } from "./login";
import { updateSettings } from "./updateSettings";

/////////////////////////////////////////////////////////// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

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

//////////////////////////////////////////// UPDATE USER DATA
if (userDataForm)
	userDataForm.addEventListener("submit", e => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const name = document.getElementById("name").value;
		updateSettings({ name, email }, "data");
	});

//////////////////////////////////////////// UPDATE USER PASSWORD
if (userPasswordForm)
	userPasswordForm.addEventListener("submit", async e => {
		e.preventDefault();
		document.querySelector(".btn--save-password").textContent = "Updating...";

		const passwordCurrent = document.getElementById("password-current").value;
		const password = document.getElementById("password").value;
		const passwordConfirm = document.getElementById("password-confirm").value;
		await updateSettings(
			{ passwordCurrent, password, passwordConfirm },
			"password"
		);

		document.querySelector(".btn--save-password").textContent = "Save password";
		// DOES => Clears out contents of input fields after reloading the page.
		document.getElementById("password-current").value = "";
		document.getElementById("password").value = "";
		document.getElementById("password-confirm").value = "";
	});
