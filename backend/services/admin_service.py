from services.history_service import explanation_history
from services.payment_store import payments

def get_admin_metrics():
    total_explanations = sum(len(v) for v in explanation_history.values())

    tax_type_count = {
        "household": 0,
        "company": 0,
        "land": 0
    }

    for user_entries in explanation_history.values():
        for entry in user_entries:
            tax_type = entry.get("tax_type")
            if tax_type in tax_type_count:
                tax_type_count[tax_type] += 1

    total_payments = len(payments)
    total_amount = sum(p["amount"] for p in payments.values()) if payments else 0
    avg_payment = round(total_amount / total_payments, 2) if total_payments else 0

    return {
        "total_explanations": total_explanations,
        "tax_type_distribution": tax_type_count,
        "total_payments": total_payments,
        "average_payment": avg_payment
    }
