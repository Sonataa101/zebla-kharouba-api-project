from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request, abort
from flask_jwt_extended import jwt_required, get_jwt
from services.stores import promises, reports, notifications
from datetime import datetime
import uuid

blp = Blueprint("Promises", __name__, url_prefix="/promises")

def admin_only():
    if get_jwt()["role"] != "admin":
        abort(403, description="Admin only")

@blp.route("/<report_id>")
class CreatePromise(MethodView):

    @jwt_required()
    def post(self, report_id):
        admin_only()

        if report_id not in reports:
            abort(404, description="Report not found")

        data = request.get_json()
        promise_id = str(uuid.uuid4())

        promise = {
            "id": promise_id,
            "report_id": report_id,
            "admin_id": get_jwt()["sub"],
            "action": data["action"],  # instant / scheduled
            "scheduled_date": data.get("scheduled_date"),
            "created_at": datetime.utcnow(),
            "status": "PROMISED"
        }

        promises[promise_id] = promise
        reports[report_id]["status"] = "PROMISED"

        # Notification
        notifications.setdefault(reports[report_id]["citizen_id"], []).append({
            "message": "Municipality has promised to resolve your issue",
            "date": datetime.utcnow()
        })

        return promise, 201
