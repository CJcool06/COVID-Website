const locations = [
    { lat: -34.928, lng: 138.601 },
    { lat: -34.920, lng: 138.610 },
    { lat: -34.931, lng: 138.596 },
    { lat: -34.915, lng: 138.610 },
    { lat: -34.947, lng: 138.640 },
	{ lat: -34.984, lng: 138.603 }
];

/**
 * Main map vue object.
 */
let vmap = new Vue({
	el: "#vmap",
	data: {
		hotspots: [{}],
		locations: [],
		markers: [],
		map: null
	},
	methods: {
		update: function() {
			// Delete existing markers
			for (index in this.markers) {
				let marker = this.markers[index];
				marker.setMap(null);
				marker = null;
			}
			this.markers = [];

			// Add new markers
			for (index in this.hotspots) {
				let marker = new google.maps.Marker({
					position: this.hotspots[index].location,
					label: this.hotspots[index].name,
					title: "Covid Hotspot"
	
				});
	
				// eslint-disable-next-line no-undef
				let infoWindow = new google.maps.InfoWindow();
	
				marker.addListener("click", () => {
					infoWindow.close();
					infoWindow.setContent(marker.getLabel() + " has been a covid hotspot since " + this.hotspots[index].since + "!");
					infoWindow.open(marker.getMap(), marker);
				});
	
				this.markers.push(marker);
			}

			// Add the markers to the map
			new MarkerClusterer(vmap.map, this.markers, {
				imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
			});
		}
	}
});

/**
 * Initialization of the map by Google.
 */
function initMap() {
	// eslint-disable-next-line no-undef
	vmap.map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: -34.928, lng: 138.601 },
		zoom: 12
	});
}

/**
 * Populates the hotspots for the map.
 */
function populateHotspotsForMap() {
	let http = new XMLHttpRequest();
	http.responseType = "json";

	http.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status != 200) {
				console.log(this.response.error);
			}
			else {
				vmap.hotspots = this.response;
				// console.log(vmap.hotspots);
				vmap.update();
			}
		}
	}

	http.open("GET", "/hotspots/map");
	http.send();
}