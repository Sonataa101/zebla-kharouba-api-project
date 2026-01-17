from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.stores import reports
from services.priority_service import compute_priority
from datetime import datetime
import uuid

blp = Blueprint("Reports", __name__, url_prefix="/reports")

@blp.route("/")
class ReportCreate(MethodView):

    @jwt_required()
    def post(self):
        data = request.get_json()
        report_id = str(uuid.uuid4())

        report = {
            "id": report_id,
            "citizen_id": get_jwt_identity(),
            "municipality": data["municipality"],
            "lat": data["lat"],
            "lng": data["lng"],
            "problem_type": data["problem_type"],
            "severity": data["severity"],
            "description": data.get("description"),
            "images": data.get("images", []),
            "created_at": datetime.utcnow(),
            "status": "OPEN"
        }

        # MOCK payment ratio (later computed from payments)
        payment_ratio = data.get("payment_ratio", 0.5)

        priority = compute_priority(report, payment_ratio)
        report["priority"] = priority

        reports[report_id] = report
        return report, 201

@blp.route("/my")
class MyReports(MethodView):

    @jwt_required()
    def get(self):
        uid = get_jwt_identity()
        return [r for r in reports.values() if r["citizen_id"] == uid]

@blp.route("/<string:report_id>")
class ReportDetail(MethodView):

    @jwt_required()
    def get(self, report_id):
        report = reports.get(report_id)
        if not report:
            return {"msg": "Report not found"}, 404
        return report