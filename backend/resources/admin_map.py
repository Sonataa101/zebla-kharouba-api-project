from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt
from services.stores import reports

blp = Blueprint("AdminMapAPI", __name__, url_prefix="/api/admin/map")
@blp.route("/reports")
class AdminReportsMap(MethodView):

    @jwt_required()
    def get(self):
        claims = get_jwt()
        if claims["role"] != "admin":
            return {"error": "Forbidden"}, 403

        return [
            {
                "id": r["id"],
                "lat": r["lat"],
                "lng": r["lng"],
                "priority": r["priority"]["level"],  # HIGH / MEDIUM / LOW
                "score": r["priority"]["score"],
                "problem_type": r["problem_type"],
                "description": r["description"],
                "status": r["status"]
            }
            for r in reports.values()
        ]
