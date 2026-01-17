# formulas/tax_formula.py

from municipality import municipalities
try:
    from flask import abort
except Exception:
    # Fallback for environments without Flask: provide a minimal abort() compatible with calls below.
    def abort(code, message=None):
        if code == 404:
            raise LookupError(message or f"HTTP {code}: Resource not found")
        raise RuntimeError(message or f"HTTP {code}")

# -------------------------------------------------------
# Helper: Load municipality config
# -------------------------------------------------------
def get_config(municipality_name):
    name = municipality_name.lower()

    if name not in municipalities:
        abort(404, message=f"Municipality '{municipality_name}' not found.")

    return municipalities[name]


# -------------------------------------------------------
# HOUSEHOLD TAX FORMULA (UNCHANGED)
# -------------------------------------------------------
def compute_household_tax(surface, service_count, municipality_name):
    """
    Household tax = (Surface × Municipal Ref Price × 2% ) × T%
    FNAH Contribution = 4% × Household tax
    """

    # Load municipal REF PRICE (only this value)
    config = get_config(municipality_name)
    category_ref_price = config["ref_price"]

    # Category determination (unchanged)
    if surface <= 100:
        category = 1
    elif surface <= 200:
        category = 2
    elif surface <= 400:
        category = 3
    else:
        category = 4

    # Service tier (8–14%) — unchanged
    if service_count <= 2:
        T = 0.08
    elif service_count <= 4:
        T = 0.10
    elif service_count <= 6:
        T = 0.12
    else:
        T = 0.14

    # ORIGINAL FORMULA (NOT MODIFIED)
    total = round(surface * category_ref_price * 0.02 * T, 2) + \
            round(surface * category_ref_price * 0.02 * 0.04, 2)

    return {
        "municipality": municipality_name,
        "category": category,
        "T_percent": T,
        "ref_price_used": category_ref_price,
        "final_tax": total
    }


# -------------------------------------------------------
# COMPANY TAX FORMULA (UNCHANGED)
# -------------------------------------------------------
def compute_company_tax(surface, category, municipality_name):
    """
    Uses the official fixed decree rates for companies (2023).
    """

    # Load T_percent from municipality (ONLY this)
    config = get_config(municipality_name)
    T_percent = config["T_percent"]

    # Original official decree table — unchanged
    rate_table = {
        1: {0.08:0.900, 0.10:1.125, 0.12:1.345, 0.14:1.570},
        2: {0.08:0.620, 0.10:0.770, 0.12:0.920, 0.14:1.075},
        3: {0.08:0.755, 0.10:0.950, 0.12:1.135, 0.14:1.320},
        4: {0.08:0.990, 0.10:1.240, 0.12:1.485, 0.14:1.735},
    }

    rate = rate_table[category][T_percent]
    total = round(surface * rate, 2)

    return {
        "municipality": municipality_name,
        "T_percent": T_percent,
        "reference_rate": rate,
        "final_tax": total
    }



# LAND TAX FORMULA

def compute_land_tax(surface, zone, municipality_name):
    """ Flat per-m² rate based on density. """

    # Load rates from municipality config
    config = get_config(municipality_name)

    zone_rates = config["density_zones"]
    r = zone_rates[zone]

    total = round(surface * r, 2)

    return {
        "municipality": municipality_name,
        "zone": zone,
        "zone_rate": r,
        "final_tax": total
    }
