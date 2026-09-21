# Deploy NumeroVeda on Vercel

Next.js now includes the Node API at `pages/api/[...path].ts`. No separate Render
backend, port 4000 or API_URL rewrite is required. The Pages API adapter preserves
Express routes, multipart parsing and raw Cashfree webhook signatures.

## Credentials

Use `.env.example` as the complete credential checklist. In Vercel Project Settings
> Environment Variables add:

- `APP_ORIGIN=https://nmveda.vercel.app` (no trailing slash).
- `MONGODB_URI` from MongoDB Atlas and `MONGODB_DB=numeroveda`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `CLOUDINARY_FOLDER=numeroveda` (optional; choose a separate test folder).
- Cashfree sandbox credentials and SMTP credentials before enabling payment.

Use an Atlas database user with read/write permission to this database. Configure
Atlas Network Access to allow the deployment's connection. Atlas supports the
transactions used for initialization; standalone MongoDB without a replica set
is not supported. Remove the old `API_URL`. No JWT or NextAuth secret is used:
admin sessions are random tokens, hashed in MongoDB, with HttpOnly cookies.
Set Vercel Node runtime to 22.x or newer and redeploy after changing variables.
Do not share the production database with unrestricted preview deployments.

## First administrator

Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters under
Vercel Project Settings > Environment Variables, redeploy, then sign in at
https://nmveda.vercel.app/admin with exactly those two values. That first sign-in creates the account in MongoDB and
records `admin.bootstrap` in the audit trail.

It runs only while the `users` collection is empty. Once an administrator exists the
two variables are ignored completely: they cannot create a second account, change an
existing password, or let a different email in. So finish the job: change your
password under Admin > Settings, then **delete `ADMIN_PASSWORD` from Vercel and
redeploy**. Until you do, the dashboard shows a warning, because anyone who can read
your environment variables can read that password.

`"bootstrapReady": true` in `/api/health` means the deployment holds both variables
and has no administrator yet, so signing in with them will work.

### From a shell instead

With the production `MONGODB_URI` in your local ignored `.env`, set `ADMIN_EMAIL`
and `ADMIN_PASSWORD` and run:

```sh
npm run admin:create
```

The script prints the database it writes to. It must name your Atlas cluster, not
a local SQLite file: without `MONGODB_URI` in `.env` it writes to your computer
only and the deployment never sees that administrator. There is no public signup
endpoint.

Forgotten password, or an administrator created against the wrong database? Set
`ADMIN_EMAIL` and a new `ADMIN_PASSWORD`, keep the production `MONGODB_URI` in
`.env`, and run `npm run admin:reset`. It replaces the password of the existing
administrator and signs out every admin session. Without `--reset` the script
refuses to touch an existing account.

`GET /api/health` reports which database the deployment reads (`"store"`) and
whether an administrator exists there (`"adminConfigured"`). If sign-in fails,
check that first: `adminConfigured: false` means the account is missing from the
production database, and the sign-in page says so instead of reporting a wrong
password. A sign-in that reports "Too many requests" is the 20-attempts-per-15-
minutes limit per IP address; wait for the window to pass.

The first initialization creates nine reports at INR 499 and disables payments.
Later initialization never resets prices or deleted reports. Your local SQLite
database, login, prices and files remain on your computer; they are not copied to
MongoDB automatically. Set production prices, content, support details and policies
in the production admin panel.

## Images and private reports

Cloudinary stores public portraits and authenticated raw PDF assets. The app checks
an admin session or customer access code before fetching a PDF. Customer downloads
also require delivered status; refunds remove access. Time-limited Cloudinary URLs
stay on the server. PDFs are never served through the public media route.
Check that your Cloudinary account allows PDF delivery; keep uploads authenticated.

Uploads and report downloads are limited to 4 MB to fit Vercel's 4.5 MB function
payload limit. Compress larger PDFs/images before upload.

## Payments and emails

Register `https://nmveda.vercel.app/api/payments/cashfree/webhook` with Cashfree and
whitelist the site domain. Add support details and enable checkout in admin after
configuring sandbox credentials. Verification checks amount/currency server-side.
MongoDB uses atomic payment updates, unique payment IDs and a shared email lease
to prevent parallel confirmation sends. SMTP cannot guarantee exactly-once delivery
if a process crashes after sending but before recording success; check before retry.

## Verify before accepting payments

1. `/api/health` and `/api/public` succeed, `/api/health` reports `"store":"mongodb"`
   and `"adminConfigured":true`; live prices replace the outage preview.
2. Admin login, prices and content persist after redeploy.
3. A sandbox checkout stores the category answers and sends confirmation.
4. Upload/review/release a sample PDF; check customer download and delivery email.
5. Invalid access codes and unreleased/refunded orders cannot download reports.
6. Back up MongoDB and Cloudinary assets for the live service.

Cashfree, SMTP, Atlas and Cloudinary require your account credentials. Committing
code does not configure those accounts. Local SQLite mode remains available for
development; cloud service checks must be repeated with your actual accounts.
