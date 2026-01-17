from flask_jwt_extended import get_jwt_identity
from flask import abort

def require_role(required_role):
    identity = get_jwt_identity()
    if identity["role"] != required_role:
        abort(403, message="Access forbidden")
