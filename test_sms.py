from sms_service import send_sms

# Enter your own 10-digit mobile number
phone_number = "8121707546"

message = "Hello! This is a test message from SafeHer AI."

# Send SMS
result = send_sms(phone_number, message)

# Display result
if result["success"]:
    print("SMS request successful!")
    print(result["details"])
else:
    print("SMS request failed!")
    print(result)