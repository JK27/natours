const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

/////////////////////////////////////////////////////////// GET CHECKOUT SESSION
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	// DOES => 1) Gets currently booked tour.
	const tour = await Tour.findById(req.params.tourId);
	// DOES => 2) Creates checkout session.
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		/* This is no longer necessary when using Stripe webhooks. */
		// success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
		// 	req.params.tourId
		// }&user=${req.user.id}&price=${tour.price}`,
		success_url: `${req.protocol}://${req.get("host")}/my-tours/`,
		cancel_url: `${req.protocol}://${req.get.host}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		display_items: [
			{
				name: `${tour.name} Tour`,
				description: tour.summary,
				images: [
					`${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
				],
				amount: tour.price * 100, // Stripe expects amount to be in cents.
				currency: "usd",
				quantity: 1,
			},
		],
	});
	// DOES => 3) Creates session as response.
	res.status(200).json({
		status: "success",
		session,
	});
});

/////////////////////////////////////////////////////////// CREATE BOOKING CHECKOUT
/* This code is no needed after using Stripe webhooks. */
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
// 	const { tour, user, price } = req.query;

// 	if (!tour && !user && !price) return next();
// 	await Booking.create({ tour, user, price });

// 	res.redirect(req.originalUrl.split("?")[0]);
// });

/////////////////////////////////////////////////////////// WEBHOOK CHECKOUT
const createBookingCheckout = async session => {
	const tour = session.client_reference_id;
	const user = (await User.findOne({ email: session.customer_email })).id;
	const price = session.display_items[0].amount / 100;
	await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
	const signature = req.headers["stripe-signature"];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		return res.status(400).send(`Webhook error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed")
		createBookingCheckout(event.data.object);

	res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
