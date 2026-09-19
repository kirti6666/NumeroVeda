# NumeroVeda

A Next.js App Router website with a separate Node.js / Express API and SQLite storage. Includes the selected ivory-and-plum UI, free birth/life-path calculator, portrait carousel, testimonials, ₹499 report packages, Cashfree checkout, private order tracking and manually uploaded PDFs.

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
- The API binds to loopback on port 4000. Next.js proxies `/api` to it. Browser requests use the same origin.
- `setup:local` never replaces an existing administrator. Change the generated password in Settings before deployment.

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

Tests use an isolated temporary SQLite database and mocked Cashfree responses. They cover date validation, numerology, auth, origin checks, draft visibility, concurrent edit protection, payment amount validation, webhook verification/idempotency, PDF release, private downloads and session revocation.

## Deployment

This is genuine Next.js plus a long-running Node.js backend, not a static export or Cloudflare Worker. Deploy to a Node-capable VM/container with a persistent disk. SQLite and local files require a **single API instance**; do not deploy to ephemeral serverless storage or horizontally scale the API without migrating storage.

1. Set a public HTTPS `APP_ORIGIN`, loopback `API_URL`, Cashfree and SMTP environment variables.
2. Run `npm ci` and `npm run build`.
3. Create an admin with `ADMIN_PASSWORD` set securely in the environment and run `npm run admin:create`; it prompts for the email. Remove the temporary environment password afterwards. No public account registration exists.
4. Run `npm start` behind an HTTPS reverse proxy to port 3000. This command starts both processes in production and requires an HTTPS origin. For containers, the included Dockerfile sets `WEB_HOST=0.0.0.0`; persist `/app/data` in a volume. Initialize the production administrator in the same volume.
5. Permit uploads of at least 12 MB at the reverse proxy, with suitable timeouts. Never expose port 4000 to the internet. Configure normal host monitoring and TLS renewal.
6. Back up the complete `data/` directory: database, reports and images. Use SQLite's online backup mechanism or stop the API for a consistent filesystem backup; do not copy only a live `.sqlite` file without its WAL. Test restoration before accepting payments.

Admin sessions are random, server-stored, HTTP-only, SameSite=Strict, expire after eight hours and use Secure cookies in production. Mutation endpoints enforce the configured Origin. Changing an admin password revokes all sessions. Portraits are public; PDFs remain outside public assets. Requests are validated, uploads are bounded and sensitive endpoints are rate limited. The default in-memory rate limiter is suitable for this single-instance launch; multi-instance deployment needs a shared store.

Before public launch, provide actual portraits, consented testimonials, support details, final policies, the domain/hosting account, and Cashfree/SMTP credentials. Nothing is published to an external host by these local commands.
### Report catalogue and intake

The public site now offers nine categories: Individual Life, Relationship Compatibility, Marriage Date & Muhurat, Baby Name, Name Correction, Career & Money, Business Name, Mobile & Vehicle Number Check, and Yearly Personal Forecast. Prices and card content remain editable under Admin → Reports & pricing. The one-time `report-catalog-v2` migration preserves existing prices and subsequent admin edits.

Required/optional intake fields are defined in `lib/report-catalog.ts` and validated on the server. Submitted field labels and values are saved with the order and shown in the admin order detail. Astrological muhurat requires both partners’ birth times and birthplaces and must be prepared by an astrologer; it is not calculated by the free numerology calculator.

Panchang and horoscope sections have been removed from the public site. `/daily` redirects to `/reports`; existing editorial records remain stored.
