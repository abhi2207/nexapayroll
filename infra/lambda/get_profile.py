import json, os, boto3

s3 = boto3.client("s3")
MASTER_BUCKET = os.environ["MASTER_BUCKET"]

def _resp(code, body):
    return {"statusCode": code, "headers": {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}, "body": json.dumps(body)}

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_sub = claims["sub"]

    key = f"clients/mapping/user_sub={user_sub}.json"
    try:
        obj = s3.get_object(Bucket=MASTER_BUCKET, Key=key)
        mapping = json.loads(obj["Body"].read().decode("utf-8"))
        return _resp(200, {"ok": True, "profile": mapping})
    except s3.exceptions.NoSuchKey:
        return _resp(404, {"ok": False, "error": "Profile not found"})