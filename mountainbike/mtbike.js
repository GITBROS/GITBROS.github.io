// Leaflet Karte initialisieren
let myMap = L.map("mapdiv",{
	fullscreenControl: true,
});
let strecken = L.featureGroup();
myMap.addLayer(strecken);

const salzburgGroup = L.featureGroup();

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
});

myMap.addControl(myMapControl); 
myMap.setView([47.8,13.033333], 9); 

L.control.scale({ 
	position: "bottomleft", 
	maxWidth: 200, 
	metric: true, 
	imperial: false, 
}).addTo(myMap); 


/*let gpxTrack = new L.GPX("Mountainbike_Strecken.gpx", {
      async : true,
     })*/


//L.geoJSON(mountainbikestrecken).addTo(myMap);

async function addGeojson(url) {
    const response = await fetch(url);
    const wienData = await response.json();
    const geojson = L.geoJSON(wienData, {
        style: function(feature){
            return{color: "#ff0000"};
        }, 
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/robbery.png"
                })
            });
        }
    });
    strecken.addLayer(geojson);
    myMap.fitBounds(wienGroup.getBounds());
}


const url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&srsName=EPSG:4326&outputFormat=json&typeName=ogdwien:SPAZIERPUNKTOGD,ogdwien:SPAZIERLINIEOGD"






