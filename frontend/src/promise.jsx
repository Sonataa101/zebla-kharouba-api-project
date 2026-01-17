import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Fix marker icons (important!)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ──────────────────────────────────────────────────────────────
export default function PromiseWorkflow() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selected, setSelected] = useState(null);

  // Use consistent name: mockPromises (no "reports")
  const mockPromises = [
    {
      id: 1,
      title: "Pothole on Avenue Habib Bourguiba",
      type: "pothole",
      date: "2026-01-10",
      status: "delayed",
      position: [36.8065, 10.1815],
      description: "Large pothole causing traffic issues near the theater.",
    },
    {
      id: 2,
      title: "Electricity shutdown in La Marsa",
      type: "electricity",
      date: "2026-01-12",
      status: "completed",
      position: [36.8760, 10.3250],
      description: "Power outage resolved after emergency intervention.",
    },
    {
      id: 3,
      title: "Street light failure - Carthage",
      type: "streetlight",
      date: "2026-01-08",
      status: "refused",
      position: [36.8520, 10.3230],
      description: "Request denied due to budget constraints.",
    },
    {
      id: 4,
      title: "Road crack near Tunis-Carthage Airport",
      type: "pothole",
      date: "2026-01-14",
      status: "pending",
      position: [36.8510, 10.2270],
      description: "Crack spreading rapidly – safety hazard.",
    },
  ];

  useEffect(() => {
    if (mapInstance.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([36.8, 10.18], 10);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Marker clusters
    const clusters = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 60,
    });

    // Simple priority-based color
    function getColor(status) {
      if (status === "completed") return "#10b981"; // green
      if (status === "delayed") return "#f59e0b";   // orange
      if (status === "refused") return "#ef4444";   // red
      return "#3b82f6";                             // blue for pending/other
    }

    mockPromises.forEach((report) => {
      const marker = L.circleMarker(report.position, {
        radius: 8,
        color: getColor(report.status),
        fillColor: getColor(report.status),
        fillOpacity: 0.85,
        weight: 2,
      });

      marker.bindPopup(`
        <b>${report.title}</b><br/>
        Type: ${report.type}<br/>
        Status: ${report.status}<br/>
        Date: ${report.date}<br/><br/>
        ${report.description}<br/><br/>
        <button id="promise-${report.id}" style="padding:6px 12px; background:#3b82f6; color:white; border:none; border-radius:4px; cursor:pointer;">
          Make Promise
        </button>
      `);

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`promise-${report.id}`);
          if (btn) {
            btn.onclick = () => setSelected(report);
          }
        }, 0);
      });

      clusters.addLayer(marker);
    });

    map.addLayer(clusters);

    // IMPORTANT: Force map to recalculate size after render
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // give React time to render the container

  }, []); // empty dependency → run once

  return (
    <div className="h-[80vh] flex flex-col lg:flex-row gap-6 p-2">
      {/* LEFT PANEL - Reports list */}
      <div className="w-full lg:w-5/12 xl:w-1/3 bg-white rounded-xl shadow border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-5 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Promise Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Click to view on map</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {mockPromises.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelected(report)}
              className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                selected?.id === report.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="font-medium text-gray-900">{report.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {report.type} • {report.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - Map */}
      <div className="w-full lg:w-7/12 xl:w-2/3 h-full min-h-[500px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}