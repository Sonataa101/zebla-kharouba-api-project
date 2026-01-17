from flask import Blueprint, render_template
#cfrom flask_jwt_extended import jwt_required, get_jwt

bp = Blueprint("AdminMapPage", __name__)

@bp.route("/admin/map")
def admin_map_page():
    return render_template("admin_map.html")
