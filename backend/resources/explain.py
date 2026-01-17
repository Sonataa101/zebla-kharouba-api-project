from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, abort

from services.history_service import add_history
from services.llm_service import explain_tax

blp = Blueprint("Explain", __name__, url_prefix="/explain")

ALLOWED_TAX_TYPES = {"household", "company", "land"}


@blp.route("/<tax_type>")
class ExplainTax(MethodView):

    @jwt_required()   
    def post(self, tax_type):
        print("🔥 REQUEST RECEIVED!")  # TESTING PURPOSE
        if tax_type not in ALLOWED_TAX_TYPES:
            abort(400, message="Invalid tax type.")

        data = request.get_json()
        if not data:
            abort(400, message="Request body is required.")

        language = data.get("language", "en")  # en | fr | ar
        user_id = get_jwt_identity()

        explanation = explain_tax(tax_type, data, language)

        # Save explanation history
        add_history(user_id, tax_type, explanation)

        return {
            "language": language,
            "explanation": explanation,
            "legal_reference": "http://localhost:5000/legal/code-fiscal"
        }
