# NexaPayroll – merged content (Next.js + Tailwind v3 + Static Export)

Merged content from:
- NexaPayroll pages (index, about, services, epf, contact)
- IAG India EPF page content (EPF definition, services, benefits)

## Run locally
```bash
npm install
npm run dev
```

## Build for S3/CloudFront
```bash
npm run build
```
Upload the generated `out/` folder to S3.


## Portal setup (Cognito + API)
1) Copy `.env.local.example` to `.env.local` and keep the values (or update if your outputs change).
2) Install deps and run locally:
```bash
npm install
npm run dev
```
3) Pages:
- /contact/ (sends email via SES through API Gateway)
- /signup/ (create account)
- /login/ (login)
- /portal/ (save profile to master bucket)
- /portal/upload/ (upload docs to client bucket)
