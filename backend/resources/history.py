from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.history_service import get_history

blp = Blueprint("History", __name__, url_prefix="/history")

@blp.route("/")
class HistoryView(MethodView):

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return {
            "history": get_history(user_id)
        }
