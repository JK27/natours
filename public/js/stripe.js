import axios from "axios";
import { showAlert } from "./alerts";
const stripe = process.env.STRIPE_PUBLIC_KEY;

export const bookTour = async tourId => {
	try {
		// DOES => 1) Gets checkout session from the server.
		const session = await axios(
			`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
		);
		console.log(session);
		// DOES => 2) Create checkout form  and charge credit card.

		window.location.replace(session.data.session.url);
	} catch (err) {
		console.log(err);
		showAlert("error", err);
	}
};
