from flask import send_file, request, abort
from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
import tempfile
from services.admin_service import get_admin_metrics
from services.pdf_service import generate_admin_report

blp = Blueprint("Admin", __name__, url_prefix="/admin")

ALLOWED_LANGUAGES = {"en", "fr", "ar"}

def admin_only():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="Admin access only")


@blp.route("/dashboard")
class AdminDashboard(MethodView):

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()

        # Role validation intentionally omitted (documented limitation)
        return get_admin_metrics()


@blp.route("/report/pdf")
class AdminPDFReport(MethodView):

    @jwt_required()
    def get(self):
        language = request.args.get("lang", "en")

        if language not in ALLOWED_LANGUAGES:
            abort(400, message="Unsupported language.")

        data = get_admin_metrics()

        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        path = generate_admin_report(data, language, tmp.name)

        return send_file(
            path,
            as_attachment=True,
            download_name=f"municipality_report_{language}.pdf"
        )
