from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

def generate_admin_report(data, language="en", output_path="admin_report.pdf"):
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    texts = {
        "en": {
            "title": "Municipality Transparency Report",
            "date": "Generated on",
            "legal": "Legal reference: Code de la fiscalité locale (2023)"
        },
        "fr": {
            "title": "Rapport de Transparence Municipale",
            "date": "Généré le",
            "legal": "Référence légale : Code de la fiscalité locale (2023)"
        },
        "ar": {
            "title": "تقرير الشفافية البلدية",
            "date": "تم إنشاؤه في",
            "legal": "المرجع القانوني: مجلة الجباية المحلية (2023)"
        }
    }

    t = texts[language]

    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, t["title"])

    y -= 30
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"{t['date']}: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}")

    y -= 40
    c.drawString(50, y, f"Total explanations requested: {data['total_explanations']}")
    y -= 20
    c.drawString(50, y, f"Total simulated payments: {data['total_payments']}")
    y -= 20
    c.drawString(50, y, f"Average payment (TND): {data['average_payment']}")

    y -= 40
    c.drawString(50, y, "Tax type distribution:")
    y -= 20

    for k, v in data["tax_type_distribution"].items():
        c.drawString(70, y, f"- {k}: {v}")
        y -= 15

    y -= 40
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(50, y, t["legal"])

    c.showPage()
    c.save()

    return output_path
