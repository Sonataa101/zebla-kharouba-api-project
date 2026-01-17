from marshmallow import Schema, fields, validate


# Household Schema
class HouseholdSchema(Schema):
    surface = fields.Float(required=True, validate=validate.Range(min=1))
    service_count = fields.Integer(required=True, validate=validate.Range(min=1, max=10))
    municipal_ref_price = fields.Float(required=True, validate=validate.Range(min=1))


# Company Schema
class CompanySchema(Schema):
    surface = fields.Float(required=True, validate=validate.Range(min=1))
    category = fields.Integer(required=True, validate=validate.OneOf([1, 2, 3, 4]))
    T_percent = fields.Float(required=True, validate=validate.OneOf([0.08, 0.10, 0.12, 0.14]))


# Land Schema
class LandSchema(Schema):
    surface = fields.Float(required=True, validate=validate.Range(min=1))
    zone = fields.String(required=True, validate=validate.OneOf(["high", "medium", "low"]))

# Municipality UPDATE Schema
class MunicipalityUpdateSchema(Schema):
    ref_price = fields.Float(validate=validate.Range(min=100, max=380))
    services = fields.Integer(validate=validate.Range(min=1, max=10))
    T_percent = fields.Float(validate=validate.Range(min=0.09, max=0.14))

    density_zones = fields.Dict(
        keys=fields.String(validate=validate.OneOf(["high", "medium", "low"])),
        values=fields.Float()
    )
