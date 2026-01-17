# municipality.py
"""
Municipality configuration module for the Zebla wel Kharouba Transparency API.

Each entry represents a Tunisian governorate with:
- ref_price: Reference price per m² (min 100 → max 380)
- services: Number of municipal services (commonly 4+)
- T_percent: Surcharge percentage (environmental tax, usually 8% to 14%)
- density_zones: Pricing multiplier for land tax based on density (official law)

"""

municipalities = {
    "Tunis": {
        "ref_price": 340,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.385, "medium": 0.115, "low": 0.040}
    },
    "Ariana": {
        "ref_price": 380,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.360, "medium": 0.110, "low": 0.040}
    },
    "Ben_Arous": {
        "ref_price": 300,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.355, "medium": 0.110, "low": 0.040}
    },
    "manouba": {
        "ref_price": 280,
        "services": 4,
        "T_percent": 0.12,
        "density_zones": {"high": 0.340, "medium": 0.105, "low": 0.040}
    },

    # ———————— North & Coast ————————
    "nabeul": {
        "ref_price": 300,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.320, "medium": 0.100, "low": 0.040}
    },
    "bizerte": {
        "ref_price": 320,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.300, "medium": 0.095, "low": 0.040}
    },
    "beja": {
        "ref_price": 240,
        "services": 2-3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.250, "medium": 0.080, "low": 0.040}
    },
    "jendouba": {
        "ref_price": 180,
        "services": 2-3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.220, "medium": 0.070, "low": 0.040}
    },
    "kef": {
        "ref_price": 170,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.210, "medium": 0.070, "low": 0.040}
    },
    "siliana": {
        "ref_price": 180,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.200, "medium": 0.060, "low": 0.040}
    },

    # ———————— Sahel ————————
    "soousse": {
        "ref_price": 360,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.380, "medium": 0.120, "low": 0.050}
    },
    "monastir": {
        "ref_price": 330,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.360, "medium": 0.115, "low": 0.050}
    },
    "mahdia": {
        "ref_price": 280,
        "services": 4,
        "T_percent": 0.12,
        "density_zones": {"high": 0.340, "medium": 0.110, "low": 0.040}
    },

    # ———————— Center ————————
    "sousse": {
        "ref_price": 310,
        "services": 6,
        "T_percent": 0.14,
        "density_zones": {"high": 0.340, "medium": 0.110, "low": 0.040}
    },
    "kairouan": {
        "ref_price": 180,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.250, "medium": 0.080, "low": 0.040}
    },
    "kasserine": {
        "ref_price": 150,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.180, "medium": 0.060, "low": 0.040}
    },
    "sidi_bouzid": {
        "ref_price": 160,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.190, "medium": 0.070, "low": 0.040}
    },

    # ———————— South ————————
    "sfax": {
        "ref_price": 240,
        "services": 5,
        "T_percent": 0.14,
        "density_zones": {"high": 0.330, "medium": 0.100, "low": 0.040}
    },
    "gabes": {
        "ref_price": 200,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.290, "medium": 0.090, "low": 0.040}
    },
    "medenine": {
        "ref_price": 200,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.260, "medium": 0.080, "low": 0.040}
    },
    "tataouine": {
        "ref_price": 150,
        "services": 2,
        "T_percent": 0.08,
        "density_zones": {"high": 0.180, "medium": 0.060, "low": 0.040}
    },
    "tozeur": {
        "ref_price": 210,
        "services": 3-4,
        "T_percent": 0.12,
        "density_zones": {"high": 0.220, "medium": 0.070, "low": 0.040}
    },
    "kebili": {
        "ref_price": 170,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.210, "medium": 0.070, "low": 0.040}
    },
    "gafsa": {
        "ref_price": 220,
        "services": 3,
        "T_percent": 0.10,
        "density_zones": {"high": 0.260, "medium": 0.085, "low": 0.040}
    }
}
