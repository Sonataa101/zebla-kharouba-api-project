# app.py

from flask import Flask, send_from_directory
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask import render_template
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os
from flask import render_template

# Blueprints
from resources.municipality import blp as MunicipalityBlueprint
from resources.household import blp as HouseholdBlueprint
from resources.company import blp as CompanyBlueprint
from resources.land import blp as LandBlueprint
from resources.explain import blp as ExplainBlueprint
from resources.history import blp as HistoryBlueprint
from resources.admin import blp as AdminBlueprint
from resources.auth import blp as AuthBlueprint
from resources.map import blp as MapBlueprint
from resources.payment import blp as PaymentBlueprint
from resources.map_view import blp as MapViewBlueprint
from resources.admin_map_page import bp as AdminMapPageBlueprint
from resources.admin_map import blp as AdminMapAPIBlueprint
from resources.report import blp as ReportsBlueprint  
from resources.promise import blp as PromiseBlueprint
from resources.notification import blp as NotificationBlueprint

load_dotenv()

app = Flask(__name__)

# Flask-Smorest Configuration
app.config.update(
    PROPAGATE_EXCEPTIONS=True,
    API_TITLE="Zebla wel Kharouba Transparency API",
    API_VERSION="v1",
    OPENAPI_VERSION="3.0.3",
    OPENAPI_URL_PREFIX="/", 
    OPENAPI_SWAGGER_UI_PATH="/swagger-ui",
    OPENAPI_SWAGGER_UI_URL="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/"
)


# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
jwt = JWTManager(app)


# CORS
CORS(app)


# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[os.getenv("RATE_LIMIT", "200 per day;50 per hour")]
)


# API Init
api = Api(app)


# Register Blueprints
api.register_blueprint(HouseholdBlueprint)
api.register_blueprint(CompanyBlueprint)
api.register_blueprint(LandBlueprint)
api.register_blueprint(MunicipalityBlueprint)
api.register_blueprint(ExplainBlueprint)
api.register_blueprint(HistoryBlueprint)
api.register_blueprint(AdminBlueprint)
api.register_blueprint(AuthBlueprint)
api.register_blueprint(MapBlueprint)
api.register_blueprint(PaymentBlueprint)
app.register_blueprint(MapViewBlueprint)
app.register_blueprint(AdminMapPageBlueprint)
api.register_blueprint(AdminMapAPIBlueprint)
api.register_blueprint(ReportsBlueprint)
api.register_blueprint(PromiseBlueprint)
app.register_blueprint(NotificationBlueprint)

# Legal Document Endpoint
@app.route("/legal/code-fiscal")
def legal_code():
    return send_from_directory(
        "static/legal",
        "CODE-DE-LA-FISCALITE-LOCALE-2023.pdf",
        as_attachment=False
    )

#map view endpoint
@app.route("/map")
def map_view():
    return render_template("map.html")

# Health Check
@app.route("/ping")
def ping():
    return {"message": "pong"}


# Home route
@app.route("/")
def home():
    return {"message": "home"}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

