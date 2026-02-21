import json, os, boto3, datetime, uuid

s3 = boto3.client("s3")
CLIENT_BUCKET = os.environ["CLIENT_BUCKET"]
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
    return {
        "statusCode": code,
        "headers": {"Content-Type":"application/json", "Access-Control-Allow-Origin":"*"},
        "body": json.dumps(body),
    }

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_sub = claims["sub"]

    # Load client mapping by userSub
    map_key = f"clients/mapping/user_sub={user_sub}.json"
    try:
        obj = s3.get_object(Bucket=MASTER_BUCKET, Key=map_key)
        mapping = json.loads(obj["Body"].read().decode("utf-8"))
    except s3.exceptions.NoSuchKey:
        return _resp(400, {"ok": False, "error": "Profile not found. Call POST /profile first."})

    body = json.loads(event.get("body") or "{}")
    filename = (body.get("filename") or "").strip()
    content_type = (body.get("contentType") or "application/octet-stream").strip()
    if not filename:
        return _resp(400, {"ok": False, "error": "filename is required"})

    client_id = mapping["clientId"]
    now = datetime.datetime.utcnow()
    key = f"clients/clientId={client_id}/{now:%Y/%m}/{uuid.uuid4()}-{filename}"

    url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": CLIENT_BUCKET, "Key": key, "ContentType": content_type},
        ExpiresIn=900,
    )
    return _resp(200, {"ok": True, "uploadUrl": url, "key": key})