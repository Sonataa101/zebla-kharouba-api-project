from flask_smorest import Blueprint
from flask.views import MethodView
from SCHEMAS import HouseholdSchema
from formulas.TAX_FORMULA import compute_household_tax

blp = Blueprint("Household", __name__, url_prefix="/household")

@blp.route("/calculate")
class HouseholdCalc(MethodView):

    @blp.arguments(HouseholdSchema)  # VALIDATION HERE
    def post(self, data):
        result = compute_household_tax(
            data["surface"],
            data["service_count"],
            data["municipality"]
        )
        return {"input": data, "result": result}
