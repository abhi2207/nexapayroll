"use client";

import { Amplify } from "aws-amplify";

let configured = false;

export default function AmplifyConfig() {
  if (!configured) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
          // if you have hosted UI / identity pool, add later
        },
      },
    });
    configured = true;
  }

  return null;
}