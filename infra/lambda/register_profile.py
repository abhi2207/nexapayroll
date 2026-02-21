import json
import os
import boto3
import uuid
import datetime

s3 = boto3.client("s3")
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
  return {
    "statusCode": code,
    "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
    "body": json.dumps(body),
  }

def lambda_handler(event, context):
  claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
  user_sub = claims["sub"]
  email = claims.get("email", "")

  body = json.loads(event.get("body") or "{}")

  client_name = (body.get("clientName") or "").strip()
  primary_contact_email = (body.get("primaryContactEmail") or email or "").strip()
  primary_contact_phone = (body.get("primaryContactPhone") or "").strip()
  phone = (body.get("phone") or "").strip()
  address = (body.get("address") or "").strip()

  if not client_name:
    return _resp(400, {"ok": False, "error": "clientName is required"})

  client_id = str(uuid.uuid4())
  now = datetime.datetime.utcnow()
  dt = now.strftime("%Y-%m-%d")
  created_at = now.isoformat() + "Z"

  record = {
    "clientId": client_id,
    "clientName": client_name,
    "email": email,
    "primaryContactEmail": primary_contact_email,
    "primaryContactPhone": primary_contact_phone,
    "phone": phone,
    "address": address,
    "userSub": user_sub,
    "createdAt": created_at,
  }

  # 1) Save JSON record (registration log)
  json_key = f"clients/registrations/dt={dt}/clientId={client_id}.json"
  s3.put_object(
    Bucket=MASTER_BUCKET,
    Key=json_key,
    Body=json.dumps(record, indent=2).encode("utf-8"),
    ContentType="application/json",
  )

  # 2) Save Excel-friendly CSV (one row)
  csv_key = f"clients/registrations/dt={dt}/clientId={client_id}.csv"
  header = "clientId,clientName,email,primaryContactEmail,primaryContactPhone,phone,address,userSub,createdAt\n"
  # NOTE: if you expect commas in fields, we can CSV-escape later; keeping simple for now.
  row = f"{client_id},{client_name},{email},{primary_contact_email},{primary_contact_phone},{phone},{address},{user_sub},{created_at}\n"
  s3.put_object(
    Bucket=MASTER_BUCKET,
    Key=csv_key,
    Body=(header + row).encode("utf-8"),
    ContentType="text/csv",
  )

  # 3) Mapping used by upload & profile lookups (store FULL record for convenience)
  map_by_user_sub = f"clients/mapping/user_sub={user_sub}.json"
  s3.put_object(
    Bucket=MASTER_BUCKET,
    Key=map_by_user_sub,
    Body=json.dumps(record).encode("utf-8"),
    ContentType="application/json",
  )

  # 4) Mapping by clientId (for admin browse)
  map_by_client_id = f"clients/mapping/clientId={client_id}.json"
  s3.put_object(
    Bucket=MASTER_BUCKET,
    Key=map_by_client_id,
    Body=json.dumps(record).encode("utf-8"),
    ContentType="application/json",
  )

  return _resp(200, {"ok": True, "clientId": client_id})