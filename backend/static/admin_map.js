const token = localStorage.getItem("access_token");

const map = L.map("map").setView([36.8, 10.18], 6);

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Cluster group
const clusters = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  maxClusterRadius: 60
});

function getColor(priority) {
  if (priority === "HIGH") return "red";
  if (priority === "MEDIUM") return "orange";
  return "green";
}

fetch("/admin/map/reports", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    data.forEach(r => {
      const marker = L.circleMarker([r.lat, r.lng], {
        radius: 8,
        color: getColor(r.priority),
        fillOpacity: 0.85
      });

      marker.bindPopup(`
        <b>${r.problem_type.toUpperCase()}</b><br/>
        Priority: ${r.priority}<br/>
        Score: ${r.score}<br/>
        Status: ${r.status}<br/><br/>
        ${r.description}<br/><br/>
        <button onclick="promise('${r.id}')">
          Make Promise
        </button>
      `);

      clusters.addLayer(marker);
    });

    map.addLayer(clusters);
  });

window.promise = function(reportId) {
  window.location.href = `/promise.html?report=${reportId}`;
};
