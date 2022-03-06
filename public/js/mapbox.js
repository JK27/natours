export const displayMap = locations => {
	///////////////////////////////////////////////////////// ACCESS TOKEN
	mapboxgl.accessToken =
		"pk.eyJ1IjoiamsyNyIsImEiOiJjbDBkenYzaGgwY3dtM2preDVrc3dxdDdwIn0.W28BqhI3NzOAfHHF6PJ0sw";

	///////////////////////////////////////////////////////// MAP VARS
	var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/jk27/cl0e14why002u14mlpi0fsfns",
		scrollZoom: false,
	});
	////////////////////////////////////////// BOUNDS

	const bounds = new mapboxgl.LngLatBounds();

	locations.forEach(loc => {
		// DOES => Creates marker.
		const el = document.createElement("div");
		el.className = "marker";
		// DOES => Adds marker.
		new mapboxgl.Marker({
			element: el,
			anchor: "bottom",
		})
			.setLngLat(loc.coordinates)
			.addTo(map);

		// DOES => Adds popup.
		new mapboxgl.Popup({
			offset: 30,
		})
			.setLngLat(loc.coordinates)
			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
			.addTo(map);

		// DOES => Extends map bounds to include current location
		bounds.extend(loc.coordinates);
	});

	// DOES => Makes all markers in the map be visible when loading the page. Extra padding is to save the diagonal edges of the map element.
	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100,
		},
	});
};
