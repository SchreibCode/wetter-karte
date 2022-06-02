const API_KEY = "795dbdd2026a0a72b5074a36b75497fb";
let map;
let popup;
let marker;

function initMap() {
    const startLocation = { lat: 52, lng: 10 };
    // Map Canvas
    map = L.map("map").setView([startLocation.lat, startLocation.lng], 5);

    // Canvas mit openstreetmap befüllen
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
    }).addTo(map);

    // On Click handler
    map.on("click", function (e) {
        const { lat, lng } = e.latlng;
        fetchAndAddWeather(lat, lng);
    });

    marker = L.marker();
    popup = L.popup({ closeButton: false });
    marker.bindPopup(popup);
}

function removeMarkerAndPopup() {
    if (popup) popup.close();
    if (marker) marker.remove();
}

function setMarkerAndPopup(lat, lng, content) {
    marker.setLatLng([lat, lng]);
    marker.addTo(map);
    popup.setLatLng([lat, lng]);
    popup.setContent(content);
    marker.openPopup();
}

async function fetchAndAddWeather(lat, lng) {
    removeMarkerAndPopup();
    setMarkerAndPopup(lat, lng, "<p>Loading...</p>");
    const data = await fetchWeather(lat, lng);
    const weatherContent = `<p>${getLocalTimeHHMM(data.timezone)} Uhr<br> 
    ${data.weather[0].description}<br> ${data.main.temp} °C</p>`;
    setMarkerAndPopup(lat, lng, weatherContent);
}

async function fetchWeather(lat, lng) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=de&appid=${API_KEY}`
    );
    const json = response.json();
    return json;
}

function getLocalTimeHHMM(timezoneOffset) {
    const now = new Date();
    const localTime = now.getTime();
    const localOffset = now.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const dateForTimezone = new Date(utc + 1000 * timezoneOffset);
    const mins = ("0" + dateForTimezone.getMinutes()).slice(-2);
    return `${dateForTimezone.getHours()}:${mins}`;
}

initMap();
