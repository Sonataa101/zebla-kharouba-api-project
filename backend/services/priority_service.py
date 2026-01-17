from datetime import datetime

PROBLEM_TYPE_SCORE = {
    "water": 25,
    "electricity": 25,
    "road": 20,
    "garbage": 15,
    "lighting": 10,
    "other": 5
}

SEVERITY_SCORE = {
    "critical": 20,
    "high": 15,
    "medium": 10,
    "low": 5
}

def compute_priority(report, citizen_payment_ratio, nearby_reports=0):
    pay_score = citizen_payment_ratio * 40
    problem_score = PROBLEM_TYPE_SCORE.get(report["problem_type"], 5)
    severity_score = SEVERITY_SCORE.get(report["severity"], 5)

    days_open = (datetime.utcnow() - report["created_at"]).days
    time_score = min(days_open * 1.5, 15)

    cluster_score = min(nearby_reports * 2, 10)

    total = pay_score + problem_score + severity_score + time_score + cluster_score

    if total >= 70:
        level = "HIGH"
    elif total >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "score": round(total, 2),
        "level": level
    }
