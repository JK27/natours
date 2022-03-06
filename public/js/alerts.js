/////////////////////////////////////////////////////////// HIDE ALERT
export const hideAlert = () => {
	const el = document.querySelector(".alert");
	if (el) el.parentElement.removeChild(el);
};
/////////////////////////////////////////////////////////// SHOW ALERT
export const showAlert = (type, message) => {
	// DOES => Hides all alertes before showing new alert.
	hideAlert();
	// NOTE => type is either 'success' or 'error'.
	const markup = `<div class="alert alert--${type}">${message}</div>`;
	document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
	// DOES => Hides alert after 5 seconds.
	window.setTimeout(hideAlert, 5000);
};
