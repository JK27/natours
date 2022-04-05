import "core-js/stable";
import "regenerator-runtime/runtime";
import { displayMap } from "./mapbox";
import { login } from "./login";
import { logout } from "./login";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

/////////////////////////////////////////////////////////// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

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
		const form = new FormData();
		form.append("name", document.getElementById("name").value);
		form.append("email", document.getElementById("email").value);
		form.append("photo", document.getElementById("photo").files[0]);

		updateSettings(form, "data");
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

//////////////////////////////////////////// BOOK TOUR
// DOES => When the bookBtn is clicked, first changes the text content and gets tourId data stored in the button element and then calls bookTour on the tour matching that ID.
if (bookBtn)
	bookBtn.addEventListener("click", e => {
		e.target.textContent = "Processing...";
		const tourId = e.target.dataset.tourId;
		bookTour(tourId);
	});
