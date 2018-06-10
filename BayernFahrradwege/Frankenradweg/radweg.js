// Leaflet Karte initialisieren
let myMap = L.map("mapdiv",{
	fullscreenControl: true,
});
const strecken = L.featureGroup().addTo(myMap);

let myLayers = {
    osm : L.tileLayer( 
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        	subdomains : ["a","b","c"],
			attribution : "© <a href= 'https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Mitwirkende"
        }
    ),
    /*geolandbasemap : L.tileLayer(
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
    )*/
};

myMap.addLayer(myLayers.osm);
 

let myMapControl = L.control.layers({ 
	"Openstreetmap" : myLayers.osm,
	/*"basemap.at Grundkarte": myLayers.geolandbasemap,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,*/
},{
	"Radweg" : strecken
});

myMap.addControl(myMapControl); 
myMap.setView([47.8,13.033333], 9); 

L.control.scale({ 
	position: "bottomleft", 
	maxWidth: 200, 
	metric: true, 
	imperial: false, 
}).addTo(myMap); 


//GPX Datei Einlesen
new L.GPX("2FrankenRadweg__Bayernnetz_fuer_Radler.gpx", {async: true}).on('loaded', function(e) {
     myMap.fitBounds(e.target.getBounds());
 	 }).addTo(strecken);










