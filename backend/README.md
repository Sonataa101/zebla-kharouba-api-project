Got it.
Let’s strip the noise, keep it clean, professional, and dev-friendly.

Below is a simple, proper README you can paste directly into README.md.
No storytelling, no academic fluff — just what a developer needs to run, understand, and contribute.

Zebdan Kharouba – Backend API

Municipal transparency and citizen reporting platform (backend-first).

Tech Stack

Python 3

Flask

Flask-Smorest (REST + Swagger)

Flask-JWT-Extended (Authentication & RBAC)

Leaflet (Map visualization – frontend)

OpenStreetMap (Free map tiles)

Project Structure
API_PROJECT/
├── app.py                  # App entry point
├── config.py               # Config & JWT setup
│
├── resources/              # API endpoints
│   ├── auth.py
│   ├── map.py
│   ├── admin_map.py
│   ├── report.py
│   ├── payment.py
│   ├── promise.py
│
├── services/               # Business logic
│   ├── map_service.py
│   ├── priority_service.py
│   ├── promise_service.py
│   ├── payment_store.py
│   ├── stores.py
│
├── templates/
│   └── admin_map.html
│
├── static/
│   ├── map.js
│   ├── map.css
│
├── requirements.txt
└── README.md

Setup
1. Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

2. Install dependencies
pip install -r requirements.txt

3. Run the app
flask run


App runs on:

http://localhost:5000

Authentication

JWT-based authentication.

Login
POST /auth/login


Body:

{
  "username": "citizen@test.tn",
  "password": "1234"
}


Response:

{
  "access_token": "...",
  "role": "citizen"
}

Auth Header (required)
Authorization: Bearer <ACCESS_TOKEN>

Core Endpoints
Reports (Citizen)
Method	Endpoint	Description
POST	/reports/	Create report
GET	/reports/my	My reports
GET	/reports/{id}	Report details
Admin Map (Admin only)
Method	Endpoint	Description
GET	/admin/map/reports	Reports for map clustering
Map Data
Method	Endpoint	Description
POST	/map/nearby	Nearby tax zones
GET	/map/zone-metrics	Closest zone metrics
Payments (Mock)
Method	Endpoint	Description
POST	/payment/simulate	Simulated payment
Map (Admin UI)

Admin map page:

GET /admin/map


Uses Leaflet

Marker clustering enabled

Priority-based coloring

Data loaded from /admin/map/reports

Priority System

Each report is scored based on:

Problem severity

Citizen payment behavior

Service impact

Priority levels:

HIGH

MEDIUM

LOW

Computed in:

services/priority_service.py

Promises & SLA

Admins can create promises for reports

Each promise has:

Expected resolution date

SLA tracking

Status updates

Swagger UI

Available at:

http://localhost:5000/swagger-ui


Use it to:

Test endpoints

Inspect schemas

Validate JWT usage

Notes

Data is stored in memory (no database)

Designed for backend correctness, not UI completeness

Frontend can be replaced without touching business logic

Contribution Rules

Put logic in services/

Keep resources/ thin

Validate inputs

Respect RBAC

Document new endpoints

If you want next:

.env setup

Dockerfile

Database migration plan

Minimal frontend README

You’re in good shape now.