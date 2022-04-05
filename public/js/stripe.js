import axios from "axios";
import { showAlert } from "./alerts";
const stripe = process.env.STRIPE_PUBLIC_KEY;

export const bookTour = async tourId => {
	try {
		// DOES => 1) Gets checkout session from the server.
		const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
		// DOES => 2) Create checkout form  and charge credit card.
		// await stripe.redirectToCheckout({ sessionId: session.data.session.id });
		window.location.replace(session.data.session.url);
	} catch (err) {
		console.log(err);
		showAlert("error", err);
	}
};
