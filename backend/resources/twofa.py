from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token
)

from services.twofa_service import (
    generate_2fa_secret,
    generate_qr_code,
    verify_otp
)

from resources.auth import USERS

blp = Blueprint("TwoFA", __name__, url_prefix="/auth/2fa")
@blp.route("/setup")
class TwoFASetup(MethodView):

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()

        user = next(
            (u for u in USERS.values() if u["id"] == user_id),
            None
        )

        if not user or user["role"] != "admin":
            return {"msg": "Forbidden"}, 403

        secret = generate_2fa_secret()
        user["2fa_secret"] = secret

        qr_code = generate_qr_code(
            email=user_id,
            secret=secret
        )

        return {
            "qr_code_base64": qr_code,
            "manual_secret": secret
        }
@blp.route("/verify")
class TwoFAVerify(MethodView):

    @jwt_required()
    def post(self):
        data = request.get_json()
        otp = data.get("otp")

        user_id = get_jwt_identity()

        user = next(
            (u for u in USERS.values() if u["id"] == user_id),
            None
        )

        if not user or not user["2fa_secret"]:
            return {"msg": "2FA not initialized"}, 400

        if not verify_otp(user["2fa_secret"], otp):
            return {"msg": "Invalid OTP"}, 401

        user["2fa_enabled"] = True
        return {"msg": "2FA enabled successfully"}
@blp.route("/login")
class TwoFALogin(MethodView):

    def post(self):
        data = request.get_json()
        email = data.get("username")
        otp = data.get("otp")

        user = USERS.get(email)

        if not user or not user["2fa_enabled"]:
            return {"msg": "2FA not enabled"}, 400

        if not verify_otp(user["2fa_secret"], otp):
            return {"msg": "Invalid OTP"}, 401

        token = create_access_token(
            identity=user["id"],
            additional_claims={"role": user["role"]}
        )

        return {
            "access_token": token,
            "role": user["role"]
        }
