import axios from "axios";
import { showAlert } from "./alerts";

/////////////////////////////////////////////////////////// LOG IN
export const login = async (email, password) => {
	try {
		const res = await axios({
			method: "POST",
			url: "http://127.0.0.1:8000/api/v1/users/login",
			data: { email, password },
		});
		// DOES => If log in is successful, then redirect to account page.
		if (res.data.status === "success") {
			showAlert("success", "Logged in successfully.");
			window.setTimeout(() => {
				location.assign("/me");
			}, 1500);
		}
	} catch (err) {
		showAlert("error", err.response.data.message);
	}
};

/////////////////////////////////////////////////////////// LOG OUT
export const logout = async () => {
	try {
		const res = await axios({
			method: "GET",
			url: "http://127.0.0.1:8000/api/v1/users/logout",
		});
		// DOES => If logged out successfully, then force a reload from the server, redirecting to the overview template.
		if (res.data.status === "success") {
			showAlert("success", "Logged out successfully.");
			window.setTimeout(() => {
				location.assign("/");
			}, 1000);
		}
	} catch (err) {
		showAlert("error", "Error logging out. Please try again.");
	}
};
