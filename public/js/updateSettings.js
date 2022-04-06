import axios from "axios";
import { showAlert } from "./alerts";

/////////////////////////////////////////////////////////// UPDATE SETTINGS
// NOTE => Type is either password or data.
export const updateSettings = async (data, type) => {
	try {
		// DOES => If the type is password, it uses /updateMyPassword. Otherwise, it uses /updateMe.
		const url =
			type === "password"
				? "http://127.0.0.1:8000/api/v1/users/updateMyPassword"
				: "http://127.0.0.1:8000/api/v1/users/updateMe";

		const res = await axios({
			method: "PATCH",
			url: url,
			data: data,
		});

		if (res.data.status === "success") {
			showAlert("success", `${type.toUpperCase()} updated successfully.`);
		}
	} catch (err) {
		showAlert("error", err.response.data.message);
	}
};
