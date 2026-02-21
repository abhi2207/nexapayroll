import json, os, boto3

s3 = boto3.client("s3")
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
    return {"statusCode": code, "headers": {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}, "body": json.dumps(body)}

def _is_admin(claims) -> bool:
    return "admin" in str(claims.get("cognito:groups", ""))

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    if not _is_admin(claims):
        return _resp(403, {"ok": False, "error": "Forbidden"})

    prefix = "clients/mapping/clientId="
    items, token = [], None

    while True:
        kwargs = {"Bucket": MASTER_BUCKET, "Prefix": prefix, "MaxKeys": 1000}
        if token: kwargs["ContinuationToken"] = token
        r = s3.list_objects_v2(**kwargs)

        for o in r.get("Contents", []):
            obj = s3.get_object(Bucket=MASTER_BUCKET, Key=o["Key"])
            items.append(json.loads(obj["Body"].read().decode("utf-8")))

        if r.get("IsTruncated"):
            token = r.get("NextContinuationToken")
        else:
            break

    # newest first if createdAt exists
    items.sort(key=lambda x: x.get("createdAt",""), reverse=True)
    return _resp(200, {"ok": True, "clients": items})