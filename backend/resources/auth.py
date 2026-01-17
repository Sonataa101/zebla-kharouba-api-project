from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import create_access_token
from flask import request, abort

blp = Blueprint("Auth", __name__, url_prefix="/auth")

# Mock users
USERS = {
    "citizen@test.tn": {
        "password": "1234",
        "role": "citizen",
        "id": "user-1",
    },
    "admin@municipality.tn": {
        "password": "admin123",
        "role": "admin",
        "id": "admin-1",
    }
}

@blp.route("/login")
class Login(MethodView):

    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = USERS.get(username)

        if not user or user["password"] != password:
            abort(401, description="Invalid credentials")

        # Otherwise issue JWT directly
        token = create_access_token(
            identity=user["id"],
            additional_claims={"role": user["role"]}
        )

        return {
            "access_token": token,
            "role": user["role"]
        }, 200
