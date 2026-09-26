import type {Metadata} from 'next';
import {LegalPage,ContactDetails} from '@/components/legal-page';
export const metadata:Metadata={title:'Privacy Policy'};
export default function PrivacyPolicy(){return <LegalPage eyebrow="POLICIES" title="Privacy Policy">
<article><p>This policy explains how NumeroVedaa, operated by Astro Guru, collects, uses and protects your information when you use this website or order a numerology report.</p></article>
<article><h2>Information we collect</h2><ul className="legal-list">
<li>Your full name, date of birth and any other names or dates you ask us to analyse. We need these to prepare your report.</li>
<li>Details you share at checkout, such as a partner’s or child’s details and the questions you want answered.</li>
<li>Your contact details: email address and mobile number.</li>
<li>Payment information. Payments are processed by our payment gateway, Cashfree. We do not see or store your card, UPI or bank details.</li>
</ul></article>
<article><h2>How we use your information</h2><ul className="legal-list">
<li>To prepare your personalised numerology report.</li>
<li>To deliver your report and keep you updated on your order.</li>
<li>To answer your questions and provide support.</li>
<li>To process payments, cancellations and refunds.</li>
<li>To improve our reports and this website.</li>
</ul></article>
<article><h2>How we protect your data</h2><p>Your personal data is stored securely and is never sold, rented or shared with third parties for marketing. We share only what is needed with the service providers that help us run NumeroVedaa, such as our payment gateway. We use industry-standard security measures to protect your information throughout the service.</p></article>
<article><h2>Cookies</h2><p>This website uses cookies and similar browser storage to keep the site working and to improve your experience. You can control or clear cookies through your browser settings.</p></article>
<article><h2>Your choices</h2><p>You can ask us for a copy of the personal information we hold about you, or ask us to correct or delete it, by contacting us using the details below.</p></article>
<ContactDetails heading="Privacy questions"/>
</LegalPage>;}
