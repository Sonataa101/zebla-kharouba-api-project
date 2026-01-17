from flask import Blueprint, render_template

blp = Blueprint("MapView", __name__)

@blp.route("/map-ui")
def map_ui():
    return render_template("map.html")
