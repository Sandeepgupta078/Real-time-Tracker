const socket = io();
console.log("Socket.io is connected");

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
    },
    (error) => {
        console.log(error);
    });
    {
        // Options for geolocation API
        enableHighAccuracy: true;
        timeout: 5000; // 5 seconds
        maximumAge: 0;
    }
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:"openstreetmap.org"

}).addTo(map);

// create a empty marker 
const markers = {};

socket.on("receiveLocation", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {

    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});