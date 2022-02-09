class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	///////////////////////// FILTERING THE QUERY
	filter() {
		// DOES => Spreads the query params and excludes specified fields deleting them from the query, leaving only the desired fields for filtering
		const queryObj = { ...this.queryString };
		const excludedFields = ["page", "sort", "limit", "field"];
		excludedFields.forEach(el => delete queryObj[el]);

		// DOES => Converts queryObj into string, replacing all the operators to include '$' required for the mongoDB operators
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		// DOES => Gets all the tours from the Tour collection that meet the params on queryString, and sends them as data object, returning a document that matches the query
		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}

	///////////////////////// SORTING THE QUERY
	sort() {
		// DOES => Sorts the results by the specified params, if any. If no sort params, then defaults to createdAt in descending order to show the most recent first
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-_id");
		}

		return this;
	}

	///////////////////////// LIMITING THE QUERY
	limitFields() {
		// DOES => Limits the number of fields shown to the client by the specified params, if any. If not field params, then defaults to only exclude the __v field used only internally by Mongoose
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	///////////////////////// PAGINATION
	paginate() {
		// DOES => Takes page and limit params from query, if any. If no params, then defaults page to 1 and limit to 100
		const limit = this.queryString.limit * 1 || 100;
		const page = this.queryString.page * 1 || 1; // Converts string to a number
		// DOES => Calculates number of tours to skip for that page. EXAMPLE: page=3&limit=10 shows results 21-30 (3 - 1) * 10 = 20
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}
module.exports = APIFeatures;
