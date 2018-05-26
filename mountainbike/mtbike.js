// Leaflet Karte initialisieren
let myMap = L.map("mapdiv",{
	fullscreenControl: true,
});

let myLayers = {
    osm : L.tileLayer( 
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        	subdomains : ["a","b","c"],
			attribution : "© <a href= 'https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Mitwirkende"
        }
    )
};

myMap.addLayer(myLayers.osm); 

let myMapControl = L.control.layers({ 
    "Openstreetmap" : myLayers.osm
});

myMap.addControl(myMapControl); 
myMap.setView([46.499,11.3566], 10); 

L.control.scale({ 
	position: "bottomleft", 
	maxWidth: 200, 
	metric: true, 
	imperial: false, 
}).addTo(myMap); 