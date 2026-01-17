from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.stores import notifications

blp = Blueprint("Notifications", __name__, url_prefix="/notifications")

@blp.route("/")
class UserNotifications(MethodView):

    @jwt_required()
    def get(self):
        uid = get_jwt_identity()
        return notifications.get(uid, [])
