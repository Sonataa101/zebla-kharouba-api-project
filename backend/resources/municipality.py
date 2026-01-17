# resources/municipality.py

from flask_smorest import Blueprint
from flask.views import MethodView
from flask import abort
from SCHEMAS import MunicipalityUpdateSchema
from municipality import municipalities

blp = Blueprint("Municipality", __name__, url_prefix="/municipality")


@blp.route("/<string:name>/config")
class MunicipalityConfig(MethodView):

    # ------------------------------
    # GET municipality parameters
    # ------------------------------
    def get(self, name):
        name = name.lower()

        if name not in municipalities:
            abort(404, message=f"Municipality '{name}' not found.")

        return {
            "municipality": name,
            "config": municipalities[name]
        }


    # ------------------------------
    # UPDATE municipality parameters
    # ------------------------------
    @blp.arguments(MunicipalityUpdateSchema)
    def put(self, data, name):
        name = name.lower()

        if name not in municipalities:
            abort(404, message=f"Municipality '{name}' not found.")

        # Update only provided fields
        municipalities[name].update(data)

        return {
            "message": f"{name} configuration updated successfully.",
            "new_config": municipalities[name]
        }
