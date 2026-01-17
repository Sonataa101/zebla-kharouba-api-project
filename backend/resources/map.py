from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request, abort
from flask_jwt_extended import jwt_required
from services.map_service import get_nearby_tax_zones, get_zone_metrics

blp = Blueprint("Map", __name__, url_prefix="/map")

@blp.route("/zone-metrics")
class ZoneMetrics(MethodView):

    @jwt_required()
    def get(self):
        try:
            lat = float(request.args.get("lat"))
            lng = float(request.args.get("lng"))
        except (TypeError, ValueError):
            abort(400, message="Invalid coordinates")

        return get_zone_metrics(lat, lng)

@blp.route("/nearby")
class NearbyTaxZones(MethodView):

    @jwt_required()
    def post(self):
        data = request.get_json()
        lat = data["lat"]
        lng = data["lng"]

        if not data or "lat" not in data or "lng" not in data:
             return {"msg": "lat and lng required"}, 422
        lat = float(data["lat"])
        lng = float(data["lng"])

        zones = get_nearby_tax_zones(lat, lng)

        return {
            "zones": zones,
            "legend": {
                "green": "High compliance (>70%)",
                "yellow": "Medium compliance (40–70%)",
                "red": "Low compliance (<40%)"
            }
        }