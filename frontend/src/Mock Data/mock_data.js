const promises = [
  {
    id: 1,
    title: "Pothole on Avenue Habib Bourguiba",
    type: "pothole",
    date: "2026-01-10",
    status: "delayed",
    position: [36.8065, 10.1815], // Tunis center
    description: "Large pothole causing traffic issues",
  },
  {
    id: 2,
    title: "Electricity shutdown in La Marsa",
    type: "electricity",
    date: "2026-01-12",
    status: "completed",
    position: [36.8760, 10.3250],
    description: "Power outage resolved after 4 hours",
  },
  {
    id: 3,
    title: "Street light failure - Carthage",
    type: "streetlight",
    date: "2026-01-08",
    status: "refused",
    position: [36.8520, 10.3230],
    description: "Request denied due to budget constraints",
  },
  {
    id: 4,
    title: "Road crack near airport",
    type: "pothole",
    date: "2026-01-14",
    status: "pending",
    position: [36.8510, 10.2270],
    description: "Crack spreading rapidly",
  },
];

// Status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-100';
    case 'delayed':   return 'text-orange-600 bg-orange-100';
    case 'refused':   return 'text-red-600 bg-red-100';
    default:          return 'text-gray-600 bg-gray-100';
  }
};

// Type-based marker colors/icons (simple colored circles for now)
const getMarkerColor = (type, status) => {
  let color = 'blue';
  if (type === 'pothole') color = 'orange';
  if (type === 'electricity') color = 'purple';
  if (type === 'streetlight') color = 'gray';

  if (status === 'completed') color = 'green';
  if (status === 'refused') color = 'red';

  return color;
};

// Example polyline path connecting some points (simulated history route)
const historyPath = [
  [36.8065, 10.1815],
  [36.8760, 10.3250],
  [36.8520, 10.3230],
  [36.8510, 10.2270],
];