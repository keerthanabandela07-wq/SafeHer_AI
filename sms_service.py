import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("FAST2SMS_API_KEY")

URL = "https://www.fast2sms.com/dev/bulkV2"


def send_sms(phone_number, message):

    if not API_KEY:
        return {
            "success": False,
            "message": "API key not found"
        }

    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "route": "q",
        "message": message,
        "numbers": phone_number
    }

    response = requests.post(
        URL,
        json=data,
        headers=headers,
        timeout=15
    )

    result = response.json()

    if response.status_code == 200 and result.get("return"):
        return {
            "success": True,
            "message": "SMS request accepted",
            "details": result
        }

    return {
        "success": False,
        "message": "SMS request failed",
        "details": result
    }