from flask_smorest import Blueprint
from flask.views import MethodView
from SCHEMAS import LandSchema
from formulas.TAX_FORMULA import compute_land_tax

blp = Blueprint("Land", __name__, url_prefix="/land")

@blp.route("/calculate")
class LandCalc(MethodView):

    @blp.arguments(LandSchema)
    def post(self, data):
        result = compute_land_tax(
            data["surface"],
            data["zone"],
            data["municipality"]
        )
        return {"input": data, "result": result}
