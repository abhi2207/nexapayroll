import json
import os
import boto3
import datetime

ses = boto3.client("ses")

FROM_EMAIL = os.environ["FROM_EMAIL"]
TO_EMAIL = os.environ["TO_EMAIL"]

def _resp(code, body):
    return {
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }

def lambda_handler(event, context):
    body = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body).decode("utf-8")

    data = json.loads(body)

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    company = (data.get("company") or "").strip()
    message = (data.get("message") or "").strip()
    source_page = (data.get("sourcePage") or "").strip()

    subject = "Inquiry"
    ts = datetime.datetime.utcnow().isoformat() + "Z"

    text = (
        f"New inquiry received\n\n"
        f"Timestamp (UTC): {ts}\n"
        f"Source page: {source_page}\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Phone: {phone}\n"
        f"Company: {company}\n\n"
        f"Message:\n{message}\n"
    )

    ses.send_email(
        Source=FROM_EMAIL,
        Destination={"ToAddresses": [TO_EMAIL]},
        Message={
            "Subject": {"Data": subject},
            "Body": {"Text": {"Data": text}},
        },
    )

    return _resp(200, {"ok": True})
