from flask_smorest import Blueprint
from flask.views import MethodView
from SCHEMAS import CompanySchema
from formulas.TAX_FORMULA import compute_company_tax

blp = Blueprint("Company", __name__, url_prefix="/company")

@blp.route("/calculate")
class CompanyCalc(MethodView):

    @blp.arguments(CompanySchema)
    def post(self, data):
        result = compute_company_tax(
            data["surface"],
            data["category"],
            data["T_percent"],
        )
        return {"input": data, "result": result}
