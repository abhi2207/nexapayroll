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

    client_id = mapping["clientId"]
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
    return _resp(200, {"ok": True, "items": items})