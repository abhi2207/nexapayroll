import json, os, boto3

s3 = boto3.client("s3")
CLIENT_BUCKET = os.environ["CLIENT_BUCKET"]

def _resp(code, body):
    return {"statusCode": code, "headers": {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}, "body": json.dumps(body)}

def _is_admin(claims) -> bool:
    return "admin" in str(claims.get("cognito:groups", ""))

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    if not _is_admin(claims):
        return _resp(403, {"ok": False, "error": "Forbidden"})

    qs = event.get("queryStringParameters") or {}
    client_id = (qs.get("clientId") or "").strip()
    if not client_id:
        return _resp(400, {"ok": False, "error": "clientId is required"})

    prefix = f"clients/clientId={client_id}/"
    items, token = [], None

    while True:
        kwargs = {"Bucket": CLIENT_BUCKET, "Prefix": prefix, "MaxKeys": 1000}
        if token: kwargs["ContinuationToken"] = token
        r = s3.list_objects_v2(**kwargs)

        for o in r.get("Contents", []):
            items.append({"key": o["Key"], "size": o["Size"], "lastModified": o["LastModified"].isoformat()})

        if r.get("IsTruncated"):
            token = r.get("NextContinuationToken")
        else:
            break

    items.sort(key=lambda x: x["lastModified"], reverse=True)
    return _resp(200, {"ok": True, "clientId": client_id, "items": items})