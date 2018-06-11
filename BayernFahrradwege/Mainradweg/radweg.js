// Einlesen der Grunddatei
const rohstrecke = "Main-Radweg_Bayernnetz_fuer_Radler.gpx"

// Leaflet Karte initialisieren
let myMap = L.map("mapdiv", {
    fullscreenControl: true,
});
const hash = new L.Hash(myMap);
L.Control.measureControl().addTo(myMap);
L.control.mousePosition().addTo(myMap);

// Variablen
const strecken = L.featureGroup().addTo(myMap);
const steigung = L.featureGroup();

// Layer
let myLayers = {
    osm: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            subdomains: ["a", "b", "c"],
            attribution: "© <a href= 'https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Mitwirkende"
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

// Layercontrol
let myMapControl = L.control.layers({
    "Openstreetmap": myLayers.osm,
	/*"basemap.at Grundkarte": myLayers.geolandbasemap,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,*/
}, {
        "Radweg": strecken,
        "Steigung": steigung,
    });
myMap.addControl(myMapControl);

// Massstab
L.control.scale({
    position: "bottomright",
    maxWidth: 200,
    metric: true,
    imperial: false,
}).addTo(myMap);

// Start und Finish Marker hinzufuegen 
// Einfuegen der Icons

const iconStart = L.icon({
    iconUrl: "../../images/start.png",
    iconAnchor: [16, 37],
    popupAnchor: [0, -37],
});
const iconFinish = L.icon({
    iconUrl: "../../images/finish.png",
    iconAnchor: [16, 37],
    popupAnchor: [0, -37],
});

const markerOptionStart = {
    opacity: 1,
    draggable: false,
    icon: iconStart,
};
const markerOptionsFinish = {
    opacity: 1,
    draggable: false,
    icon: iconFinish,
};

//GPX Datei Einlesen
new L.GPX(rohstrecke, { async: true, polyline_options: { color: "#483D8B" } }).on('loaded', function (e) {
    myMap.fitBounds(e.target.getBounds());
}).addTo(strecken);

//Elevation Control
var elevationControl = L.control.elevation({
    position: "topleft",
    theme: "steelblue-theme",
    collapsed: true,
}).addTo(myMap)

//Elevation Zeichnen
let elevation = new L.GPX(rohstrecke, {
    async: true,
});
elevation.on('loaded', function (evt) {
    myMap.fitBounds(evt.target.getBounds());
});
elevation.on("addline", function (evt) {
    elevationControl.addData(evt.line);
    // alle Segmente der Steigungslinie hinzufügen
    let gpxLinie = evt.line.getLatLngs();

    // Hinzufuegen der Icons
    let start = gpxLinie[0]
    let finish = gpxLinie[gpxLinie.length - 1];
    L.marker(start, markerOptionStart).addTo(strecken).bindPopup("<p><a href='https://LinkwikiOderSo'><strong>Name der Stadt</strong></a></p>");
    L.marker(finish, markerOptionsFinish).addTo(strecken).bindPopup("<p><a href='https://LinkwikiOderSo'><strong>Name der Stadt</strong></a></p>");

    for (let i = 1; i < gpxLinie.length; i++) {
        let p1 = gpxLinie[i - 1];
        let p2 = gpxLinie[i];

        //Entfernung zwischen Punkten Berechnen
        let dist = myMap.distance(
            [p1.lat, p1.lng],
            [p2.lat, p2.lng]
        );

        //Hoehenunterschied berechnen
        let delta = p2.meta.ele - p1.meta.ele;

        //Steigung in %
        /*let proz = 0;
        if (dist > 0) {
            let proz = (delta / dist * 100.0).toFixed(1);
        };*/

        //Andere Schreibweise: Bedingung ? ausdruck1 : Ausdruck2
        let proz = (dist > 0) ? (delta / dist * 100.0).toFixed(1) : 0;

        //console.log(p1.lat, p1.lng, p2.lat, p2.lng, dist, delta, proz);

        //Zuteilung der Farbe URL: http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3
        let farbe =
            (proz > 2.5) ? "#fc8d59" :
                (proz < -2.5) ? "#91cf60" :
                    "#ffffbf";

        let segment = L.polyline(
            [
                [p1.lat, p1.lng],
                [p2.lat, p2.lng],
            ], {
                color: farbe,
                weight: 3,
            }
        ).addTo(steigung);
    }
});

// Streckendetails
let hilfsTrack = new L.GPX(rohstrecke, {
    async: true,
});

hilfsTrack.on("loaded", function (evt) {
    let laenge = ((evt.target.get_distance().toFixed(0)) / 1000).toFixed(0);
    document.getElementById("laenge").innerHTML = laenge;
    let tiefsterP = evt.target.get_elevation_min().toFixed(0);
    document.getElementById("tiefsterP").innerHTML = tiefsterP;
    let hoechsterP = evt.target.get_elevation_max().toFixed(0);
    document.getElementById("hoechsterP").innerHTML = hoechsterP;
    let aufstieg = evt.target.get_elevation_gain().toFixed(0)
    document.getElementById("aufstieg").innerHTML = aufstieg;
    let abstieg = evt.target.get_elevation_loss().toFixed(0)
    document.getElementById("abstieg").innerHTML = abstieg;
});










