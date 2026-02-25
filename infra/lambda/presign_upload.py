import json, os, boto3, datetime

s3 = boto3.client("s3")
CLIENT_BUCKET = os.environ["CLIENT_BUCKET"]
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
    return {
        "statusCode": code,
        "headers": {"Content-Type":"application/json", "Access-Control-Allow-Origin":"*"},
        "body": json.dumps(body),
    }


def _sanitize_filename(name: str) -> str:
    name = (name or "").strip().replace("\\", "/")
    name = name.split("/")[-1]
    allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._- ()"
    cleaned = "".join(ch if ch in allowed else "_" for ch in name)
    cleaned = cleaned.strip().strip(".")
    return cleaned or "upload.bin"

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
    filename = _sanitize_filename(body.get("filename") or "")
    content_type = (body.get("contentType") or "application/octet-stream").strip()

    client_id = mapping["clientId"]
    now = datetime.datetime.utcnow()
    # Keep original filename in the key; group by year/month.
    # If the same filename is uploaded again in the same month, treat it as duplicate.
    key = f"clients/clientId={client_id}/{now:%Y/%m}/{filename}"

    # Duplicate check
    try:
        s3.head_object(Bucket=CLIENT_BUCKET, Key=key)
        return _resp(409, {"ok": False, "error": "File already exists. Please rename it before uploading again.", "key": key})
    except s3.exceptions.ClientError as e:
        code = e.response.get("Error", {}).get("Code")
        if code not in ("404", "NoSuchKey", "NotFound"):
            raise

    url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": CLIENT_BUCKET, "Key": key, "ContentType": content_type},
        ExpiresIn=900,
    )
    return _resp(200, {"ok": True, "uploadUrl": url, "key": key, "filename": filename})