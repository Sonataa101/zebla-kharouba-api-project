import uuid
from datetime import datetime
from services.payment_store import payments

VALID_CHANNELS = ["EDINAR", "BANK_CARD", "D17", "Flouci"]

def initiate_payment(user_id, amount, channel, municipality, reference_id):
    if channel not in VALID_CHANNELS:
        raise ValueError("Unsupported payment channel")

    payment_id = str(uuid.uuid4())
    
    payments[payment_id] = {
        "payment_id": payment_id,
        "user_id": user_id,
        "channel": channel,
        "amount": amount,
        "municipality": municipality.lower(),
        "status": "PENDING",
        "reference_id": reference_id,
        "created_at": datetime.utcnow().isoformat()
    }

    return payments[payment_id]


def confirm_payment(payment_id):
    payment = payments.get(payment_id)
    if not payment:
        return None

    payment["status"] = "PAID"
    payment["paid_at"] = datetime.utcnow().isoformat()
    return payment


def refund_payment(payment_id):
    payment = payments.get(payment_id)
    if not payment or payment["status"] != "PAID":
        return None

    payment["status"] = "REFUNDED"
    payment["refunded_at"] = datetime.utcnow().isoformat()
    return payment
