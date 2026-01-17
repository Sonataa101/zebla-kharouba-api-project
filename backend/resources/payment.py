from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, abort


from services.payment_service import (
    initiate_payment,
    confirm_payment,
    refund_payment
)

blp = Blueprint("Payment", __name__, url_prefix="/payment")


@blp.route("/simulate")
class SimulatePayment(MethodView):

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            payment = initiate_payment(
                user_id=user_id,
                amount=data["amount"],
                channel=data.get("channel", "EDINAR"),
                municipality=data.get("municipality", "Tunis"),
                reference_id=data.get("reference_id", "SIMULATION")
            )
        except ValueError as e:
            abort(400, message=str(e))

        confirmed = confirm_payment(payment["payment_id"])

        return {
            "message": "Payment simulated successfully",
            "payment": confirmed
        }

@blp.route("/refund/<payment_id>")
class RefundPayment(MethodView):
    @jwt_required()
    def post(self, payment_id):
        payment = refund_payment(payment_id)

        if not payment:
            abort(404, message="Payment not found or not refundable")

        return {
            "message": "Payment refunded",
            "payment": payment
        }