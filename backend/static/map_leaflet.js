const map = L.map("map").setView([36.8, 10.18], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let marker = L.marker([36.8, 10.18]).addTo(map);

// ------------------------
// Locate user (permission-based)
// ------------------------
function locateMe() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      map.setView([lat, lng], 14);
      marker.setLatLng([lat, lng]);

      loadNearbyZones(lat, lng);
    },
    () => alert("Permission denied")
  );
}

// ------------------------
// Address search (Nominatim)
// ------------------------
function searchAddress() {
  const address = document.getElementById("address").value;
  const country = document.getElementById("country").value;

  const query = `${address}, ${country}`;

  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
    .then(res => res.json())
    .then(results => {
      if (!results.length) {
        alert("Address not found");
        return;
      }

      const lat = parseFloat(results[0].lat);
      const lng = parseFloat(results[0].lon);

      map.setView([lat, lng], 14);
      marker.setLatLng([lat, lng]);

      loadNearbyZones(lat, lng);
    });
}

// ------------------------
// Load backend zones
// ------------------------
function loadNearbyZones(lat, lng) {
  fetch("/map/nearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_TOKEN"
    },
    body: JSON.stringify({ lat, lng })
  })
    .then(res => res.json())
    .then(data => {
      data.zones.forEach(z => {
        const color =
          z.marker_color === "green" ? "green" :
          z.marker_color === "yellow" ? "orange" : "red";

        L.circleMarker([z.lat, z.lng], {
          radius: 8,
          color,
          fillColor: color,
          fillOpacity: 0.8
        })
        .bindPopup(`
          <strong>${z.municipality}</strong><br>
          Paid ratio: ${z.paid_ratio}%
        `)
        .addTo(map);
      });
    });
}
