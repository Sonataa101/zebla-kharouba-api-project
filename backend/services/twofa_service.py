import pyotp
import base64
import qrcode
from io import BytesIO


def generate_2fa_secret():
    """Generate a new base32 secret"""
    return pyotp.random_base32()


def generate_qr_code(email, secret, issuer="Zebla & Kharouba"):
    """
    Generate QR code for authenticator apps
    """
    uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=email,
        issuer_name=issuer
    )

    qr = qrcode.make(uri)
    buffered = BytesIO()
    qr.save(buffered, format="PNG")

    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def verify_otp(secret, otp):
    """
    Verify a TOTP code
    """
    totp = pyotp.TOTP(secret)
    return totp.verify(otp)
