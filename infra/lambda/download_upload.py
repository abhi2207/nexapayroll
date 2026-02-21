import json, os, boto3

s3 = boto3.client("s3")
CLIENT_BUCKET = os.environ["CLIENT_BUCKET"]
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
    return {"statusCode": code, "headers": {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}, "body": json.dumps(body)}

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_sub = claims["sub"]

    map_key = f"clients/mapping/user_sub={user_sub}.json"
    try:
        obj = s3.get_object(Bucket=MASTER_BUCKET, Key=map_key)
        mapping = json.loads(obj["Body"].read().decode("utf-8"))
    except s3.exceptions.NoSuchKey:
        return _resp(400, {"ok": False, "error": "Profile not found. Call POST /profile first."})

    qs = event.get("queryStringParameters") or {}
    key = (qs.get("key") or "").strip()
    if not key:
        return _resp(400, {"ok": False, "error": "key is required"})

    client_id = mapping["clientId"]
    prefix = f"clients/clientId={client_id}/"
    if not key.startswith(prefix):
        return _resp(403, {"ok": False, "error": "Forbidden"})

    url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": CLIENT_BUCKET, "Key": key},
        ExpiresIn=900,
    )
    return _resp(200, {"ok": True, "downloadUrl": url})