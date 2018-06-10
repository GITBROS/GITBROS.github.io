// Leaflet Karte initialisieren
let myMap = L.map("mapdiv",{
	fullscreenControl: true,
});
const strecken = L.featureGroup();

let myLayers = {
    osm : L.tileLayer( 
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        	subdomains : ["a","b","c"],
			attribution : "© <a href= 'https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Mitwirkende"
        }
    ),
    geolandbasemap : L.tileLayer(
        "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
            subdomains : ["maps","maps1","maps2","maps3","maps4"], 
            attribution : "Datenquelle: <a href= 'https://www.basemap.at'>Basemap.at</a>" 
        }
	),
	bmaporthofoto30cm: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    )
};

myMap.addLayer(myLayers.osm);
 

let myMapControl = L.control.layers({ 
	"Openstreetmap" : myLayers.osm,
	"basemap.at Grundkarte": myLayers.geolandbasemap,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,
},{
	"strecken" : strecken
});

myMap.addControl(myMapControl); 
myMap.setView([47.8,13.033333], 9); 

L.control.scale({ 
	position: "bottomleft", 
	maxWidth: 200, 
	metric: true, 
	imperial: false, 
}).addTo(myMap); 

	 
// new L.GPX("Mountainbike_Strecken.gpx", {async: true}).on('loaded', function(e) {
// 	   myMap.fitBounds(e.target.getBounds());
// 	 }).addTo(myMap);


//Einlesen aus data.gv.at
const url = "https://cors.io/?http://www.salzburg.gv.at/ogd/e5bc00bf-a84a-46fa-9494-b43ba606f1f6/Mountainbike_Strecken.json"



async function addGeojson(url) {
    console.log("Url wird geladen: ", url);
    const response = await fetch(url);
    console.log("Response: ", response);
    const mtstrecken = await response.json();
    console.log("Geojson: ", mtstrecken);
    const geojson = L.geoJSON(mtstrecken).bindPopup(function (layer) {
		const props = layer.feature.properties;
        const popupText = `<h1>${props.STANDORTNAME}</h1>
        <p>Bezirk: ${props.HOMEPAGE} </p>`;
        return popupText});
	//.addTo(strecken)
	strecken.addLayer(geojson);
}
addGeojson(url);


//Einlesen aus lokal gespeicherte Datei
//console.log(test)
//L.geoJSON(test).addTo(strecken)



