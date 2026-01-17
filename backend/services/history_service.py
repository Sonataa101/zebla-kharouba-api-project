# services/history_service.py

from collections import defaultdict
from datetime import datetime

# In-memory store (user_id -> list of explanations)
explanation_history = defaultdict(list)

def add_history(user_id, tax_type, explanation):
    explanation_history[user_id].append({
        "tax_type": tax_type,
        "explanation": explanation,
        "timestamp": datetime.utcnow().isoformat()
    })

def get_history(user_id):
    return explanation_history[user_id]
