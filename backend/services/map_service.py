from math import radians, cos, sin, asin, sqrt
from services.payment_store import payments

ZONES = [
    # -------- GRAND TUNIS --------
    {"id": "tunis", "municipality": "Tunis", "lat": 36.8065, "lng": 10.1815, "total_taxpayers": 1200},
    {"id": "ariana", "municipality": "Ariana", "lat": 36.8625, "lng": 10.1956, "total_taxpayers": 700},
    {"id": "ben_arous", "municipality": "Ben Arous", "lat": 36.7531, "lng": 10.2189, "total_taxpayers": 650},
    {"id": "la_marsa", "municipality": "La Marsa", "lat": 36.8782, "lng": 10.3247, "total_taxpayers": 500},

    # -------- SAHEL --------
    {"id": "sousse", "municipality": "Sousse", "lat": 35.8256, "lng": 10.6084, "total_taxpayers": 900},
    {"id": "monastir", "municipality": "Monastir", "lat": 35.7770, "lng": 10.8262, "total_taxpayers": 600},
    {"id": "mahdia", "municipality": "Mahdia", "lat": 35.5047, "lng": 11.0622, "total_taxpayers": 400},

    # -------- SFAX --------
    {"id": "sfax", "municipality": "Sfax", "lat": 34.7406, "lng": 10.7603, "total_taxpayers": 1100},
    
    # -------- NORTH WEST --------
    {"id": "bizerte", "municipality": "Bizerte", "lat": 37.2746, "lng": 9.8739, "total_taxpayers": 450},
    {"id": "beja", "municipality": "Beja", "lat": 36.7256, "lng": 9.1817, "total_taxpayers": 300},
    {"id": "jendouba", "municipality": "Jendouba", "lat": 36.5011, "lng": 8.7802, "total_taxpayers": 280},

    # -------- CENTER --------
    {"id": "kairouan", "municipality": "Kairouan", "lat": 35.6781, "lng": 10.0963, "total_taxpayers": 550},
    {"id": "kasserine", "municipality": "Kasserine", "lat": 35.1676, "lng": 8.8365, "total_taxpayers": 320},
    {"id": "sidi_bouzid", "municipality": "Sidi Bouzid", "lat": 35.0382, "lng": 9.4849, "total_taxpayers": 260},

    # -------- SOUTH --------
    {"id": "gabes", "municipality": "Gabes", "lat": 33.8815, "lng": 10.0982, "total_taxpayers": 500},
    {"id": "medenine", "municipality": "Medenine", "lat": 33.3549, "lng": 10.5055, "total_taxpayers": 420},
    {"id": "tataouine", "municipality": "Tataouine", "lat": 32.9297, "lng": 10.4518, "total_taxpayers": 180},

    # -------- TOURISM --------
    {"id": "hammamet", "municipality": "Hammamet", "lat": 36.4073, "lng": 10.6225, "total_taxpayers": 350},
    {"id": "djerba", "municipality": "Djerba Houmt Souk", "lat": 33.8750, "lng": 10.8574, "total_taxpayers": 480}
]


def haversine(lat1, lon1, lat2, lon2):
    """Distance in KM between two GPS points"""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c


def count_paid_payments(municipality_id):
    return sum(
        1 for p in payments.values()
        if p["municipality"] == municipality_id and p["status"] == "PAID"
    )

def count_paid_payments(municipality_id):
    return sum(
        1 for p in payments.values()
        if (p["municipality"].lower() == municipality_id.lower() or 
            p["municipality"] == municipality_id) 
        and p["status"] == "PAID"
    )

def compliance_level(ratio):
    if ratio >= 0.6:
        return "green"
    if ratio >= 0.35:
        return "yellow"
    return "red"


def get_zone_metrics(lat, lng):
    """Returns metrics for the closest municipality"""

    closest = min(
        ZONES,
        key=lambda z: haversine(lat, lng, z["lat"], z["lng"])
    )

    paid = count_paid_payments(closest["id"])
    ratio = round(paid / closest["total_taxpayers"], 2)  # ← FIXED: was "taxpayers"

    return {
        "municipality": closest["municipality"],  # ← FIXED: was "name"
        "paid_payments": paid,
        "total_taxpayers": closest["total_taxpayers"],  # ← FIXED: was "taxpayers"
        "compliance_ratio": ratio,
        "status": compliance_level(ratio)
    }


def get_nearby_tax_zones(lat, lng, radius_km=25):
    """Returns nearby zones within radius"""

    nearby = []

    for zone in ZONES:
        distance = haversine(lat, lng, zone["lat"], zone["lng"])

        if distance <= radius_km:
            paid = count_paid_payments(zone["id"])
            ratio = round(paid / zone["total_taxpayers"] * 100, 4)  # as percentage

            nearby.append({
                "zone_id": zone["id"],
                "municipality": zone["municipality"],  
                "lat": zone["lat"],
                "lng": zone["lng"],
                "distance_km": round(distance, 2),
                "paid_ratio": ratio,
                "marker_color": compliance_level(ratio)
            })

    return nearby
#debug version
def count_paid_payments(municipality_id):
    print(f"🔍 Checking payments for municipality: {municipality_id}")
    print(f"🔍 All payments: {payments}")
    
    count = sum(
        1 for p in payments.values()
        if p["municipality"] == municipality_id and p["status"] == "PAID"
    )
    
    print(f"🔍 Found {count} paid payments for {municipality_id}")
    return count