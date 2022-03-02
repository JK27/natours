/////////////////////////////////////////////////////////// GET OVERVIEW
exports.getOverview = (req, res) => {
	res.status(200).render("overview", {
		title: "Exciting tours for adventurous people",
	});
};
/////////////////////////////////////////////////////////// GET OVERVIEW
exports.getTour = (req, res) => {
	res.status(200).render("tour", {
		title: "The Forest Hiker",
	});
};
