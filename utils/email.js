const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

/////////////////////////////////////////////////////////// EMAIL CLASS
// DOES => Creates email objects that can be used ot send actual emails.
module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = ` Juan C. Martin ${process.env.EMAIL_FROM}`;
	}

	////////////////////////////////////////// TRANSPORTER
	newTransport() {
		if (process.env.NODE_ENV === "production") {
			return nodemailer.createTransport({
				service: "SendGrid",
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}
		// DOES => Creates transporter.
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	////////////////////////////////////////// SEND EMAIL
	async send(template, subject) {
		// DOES => 1) Renders HTML based on pug template.
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject,
			}
		);
		// DOES => 2) Defines email options.
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		// DOES => Creates a transport and sends email.
		await this.newTransport().sendMail(mailOptions);
	}

	////////////////////////////////////////// SEND WELCOME EMAIL
	async sendWelcome() {
		await this.send("welcome", "Welcome to the Natours Family! 👋");
	}
	////////////////////////////////////////// SEND RESET PASSWORD EMAIL
	async sendPasswordReset() {
		await this.send(
			"passwordReset",
			"Your password reset token is valid for only 10 minutes."
		);
	}
};
