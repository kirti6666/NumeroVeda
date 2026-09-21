# NumeroVeda

A Next.js App Router website with a Node.js / Express API served inside Next.js, MongoDB storage and Cloudinary uploads. Local SQLite development remains available. Includes the selected ivory-and-plum UI, free birth/life-path calculator, portrait carousel, testimonials, ₹499 report packages, Cashfree checkout, private order tracking and manually uploaded PDFs.

## Run locally

Requires Node.js 22.18+ and npm.

```sh
npm ci
npm run setup:local
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
- Initial local login: see the ignored `local-access.txt` file created by setup. The password is random; no fixed default password is shipped.
- Next.js serves `/api` directly on port 3000. No separate backend process is needed.
- `setup:local` never replaces an existing administrator. Change the generated password in Settings before deployment.
- A deployment with `ADMIN_EMAIL` and `ADMIN_PASSWORD` set creates its first administrator when you first sign in with them, then ignores both variables from then on. Remove `ADMIN_PASSWORD` once you are in.
- Locked out? `ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=<12+ characters> npm run admin:reset` sets a new password. It targets the database named in its first output line: MongoDB when `MONGODB_URI` is set, local SQLite otherwise.
- `GET /api/health` reports `store` and `adminConfigured`, so you can confirm the deployment reads the database that holds your administrator.

## Admin workflows

1. **Overview:** Pending reports, delivered reports, verified revenue, overdue deadlines and recent customer orders.
2. **Customers & orders:** View contact details, submitted questions and answers, payment status and email history. Add internal preparation notes or a customer-visible answer. Upload, review and release the final PDF.
3. **Reports & pricing:** Edit names, descriptions, included features, INR prices, ordering and availability. Existing orders retain their original amount.
4. **Numerologists / Testimonials:** Maintain public portraits and consented reviews. Generated illustrative portraits are fallback assets only.
5. **Settings:** Brand, homepage, contact details, report language, checkout availability, policies and admin password. Credentials remain server-side.

## Customer checkout

Each report card opens its category-specific form at `/report-details`. Validated answers are stored in the current browser tab and the customer proceeds to `/checkout` to review details and pay. Editing returns to the prefilled form. Payment initiation creates the order; Cashfree verification, not the browser result, starts the delivery window. Unpaid orders do not trigger a confirmation email.

## Cashfree setup

Copy `.env.example` settings into your local/server environment. Do not commit secrets.

```dotenv
APP_ORIGIN=https://your-domain.example
CASHFREE_ENV=sandbox
CASHFREE_CLIENT_ID=your_sandbox_app_id
CASHFREE_CLIENT_SECRET=your_sandbox_secret
```

Use Cashfree sandbox credentials first. Whitelist the website domain in Cashfree and register:

`https://your-domain.example/api/payments/cashfree/webhook`

The webhook validates the raw-body signature with the Cashfree PG secret, then independently checks the order and successful payment with Cashfree. Only verified INR payments matching the stored amount mark an order paid. Duplicate callbacks do not reset the delivery deadline. The return page also checks payment server-side. Browser redirects never prove payment.

In **Settings**, enter support contact details, review your policies and enable checkout. After merchant approval and a real sandbox end-to-end test, set `CASHFREE_ENV=production` and supply production credentials. No payment credentials were available during implementation; automated tests mock Cashfree and never charge money.

Cashfree API version: `2025-01-01`. Browser checkout uses their hosted v3 SDK. Sources: https://www.cashfree.com/docs/payments/online/web/redirect and https://www.cashfree.com/docs/payments/online/webhooks/signature-verification.

## Email and PDF delivery

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. Port 465 uses TLS; port 587 uses SMTP upgrade negotiation. A professional thank-you confirmation is sent to the supplied email only after verified payment, promising the personalised PDF within 12–24 hours. Repeat callbacks do not resend a successfully sent confirmation. Failed confirmation sends can be retried from admin. A separate email is sent when the PDF is released. SMTP requests have bounded timeouts. Delivery history and resend are available in each admin order.

Without SMTP, order tracking and PDF download still work; the admin shows that email was not sent. Checkout stores the access code for the current browser session and the tracking page lets the customer copy it. The payment confirmation email links to tracking; customers must retain the private code from checkout. Access links carry the code in the URL fragment, which is removed after loading; it is not a query parameter sent to the server. The database stores only a hash of the access code.

The delivery window is 12–24 elapsed hours after verified payment. Admin shows due/overdue orders. There is no unattended background reminder or astrology automation service. Ensure staffing meets the delivery promise. Refunds are processed in Cashfree, then recorded in admin with the refund reference; the website does not itself issue a financial refund.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

Tests use isolated SQLite and MongoDB replica-set databases, with mocked Cashfree, Cloudinary and SMTP responses. The MongoDB test downloads a temporary test binary on its first run. They cover date validation, numerology, auth, origin checks, draft visibility, concurrent edit protection, payment amount validation, webhook verification/idempotency, PDF release, private downloads and session revocation.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel + MongoDB + Cloudinary setup.
The Node API runs inside Next.js; no separate backend or API_URL is needed.
With MONGODB_URI configured, MongoDB stores orders, content, admin sessions and
notification records. Cloudinary stores files; customer PDFs are authenticated.
Local development without MongoDB retains SQLite/files. Vercel requires MongoDB
and never silently writes ephemeral data. Uploads are limited to 4 MB.

### Report catalogue and intake

The public site now offers nine categories: Individual Life, Relationship Compatibility, Marriage Date & Muhurat, Baby Name, Name Correction, Career & Money, Business Name, Mobile & Vehicle Number Check, and Yearly Personal Forecast. Prices and card content remain editable under Admin → Reports & pricing. The one-time `report-catalog-v2` migration preserves existing prices and subsequent admin edits.

Required/optional intake fields are defined in `lib/report-catalog.ts` and validated on the server. Submitted field labels and values are saved with the order and shown in the admin order detail. Astrological muhurat requires both partners’ birth times and birthplaces and must be prepared by an astrologer; it is not calculated by the free numerology calculator.

Panchang and horoscope sections have been removed from the public site. `/daily` redirects to `/reports`; existing editorial records remain stored.
