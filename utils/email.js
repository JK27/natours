const nodemailer = require("nodemailer");

const sendEmail = async options => {
	// DOES => Creates transporter.
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	// DOES => Defines email options.
	const mailOptions = {
		from: "Juan C. Martin <hola@jk27.io>",
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};

	// DOES => Sends the email.
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
