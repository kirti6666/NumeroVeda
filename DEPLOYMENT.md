# NumeroVeda: Vercel website + persistent Node backend

The Vercel site is https://nmveda.vercel.app. Its `/api/public` currently
returns `DNS_HOSTNAME_RESOLVED_PRIVATE`: the API rewrite targets a private
address. Vercel does not start this repository's separate Node process.
Do not use localhost as Vercel's API_URL.

## 1. Create the backend on Render

Open https://dashboard.render.com/select-repo?type=blueprint and connect
`kirti6666/NumeroVeda`, branch `main`. Render reads `render.yaml`.
Review the paid compute and 1 GB disk cost before confirming creation.
The persistent disk stores SQLite, uploaded portraits and private report PDFs.
Keep one instance; do not remove the disk or use ephemeral storage for orders.

The blueprint starts only the backend, binds to Render's PORT, and checks
`/api/health`. After deployment copy the actual HTTPS service URL from Render.
Open `<backend-url>/api/health` (expect `{"ok":true}`) and
`<backend-url>/api/public` (expect nine products).

## 2. Connect Vercel

In Vercel project Settings → Environment Variables set, for Production:

```dotenv
API_URL=https://YOUR-ACTUAL-BACKEND-HOST
```

Use the actual Render service URL, without `/api` or a trailing slash.
Redeploy the Vercel project: rewrites are generated at build time.
Keep backend APP_ORIGIN exactly `https://nmveda.vercel.app` (no trailing slash).
The browser continues calling the same-origin `/api` paths on Vercel;
admin cookies and uploaded images also use this proxy.

Verify `https://nmveda.vercel.app/api/health`, `/api/public`, and `/admin`.
If the production domain changes, update APP_ORIGIN on Render as well.
Preview domains cannot change production data unless deliberately authorized.

## 3. Create the production administrator

Your local database and password are not copied to Render. In the Render
service environment, temporarily add ADMIN_PASSWORD with a unique password
of at least 12 characters. In the running service's Shell run:

```sh
npm run admin:create
```

Enter your administrator email when prompted, then remove ADMIN_PASSWORD
from the environment. Sign in at https://nmveda.vercel.app/admin.
Create the administrator in the running service, not a build/pre-deploy job:
the persistent disk must be mounted. Re-enter your report prices and content;
the fresh database starts all nine reports at ₹499.

## 4. Configure payment and email on Render

Use `.env.example` as the variable list. Add CASHFREE_CLIENT_ID,
CASHFREE_CLIENT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM
in Render's environment settings, not in Git or the frontend.
Use sandbox payments first. In admin add support details and enable checkout.
Set Cashfree's webhook to:
`https://nmveda.vercel.app/api/payments/cashfree/webhook`.

Before live payments, test a sandbox purchase, confirmation email, admin
answers, PDF upload/review/release, delivery email and private download.
Then configure approved production Cashfree credentials. Back up the database
and files consistently as described in README.md.

This blueprint prepares deployment; it does not create a hosting account,
purchase a plan, transfer local customer data or configure Vercel automatically.
