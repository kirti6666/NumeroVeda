import type {Metadata} from 'next';
import {LegalPage,ContactDetails} from '@/components/legal-page';
export const metadata:Metadata={title:'Terms & Conditions'};
export default function Terms(){return <LegalPage eyebrow="POLICIES" title="Terms & Conditions">
<article><p>These terms apply when you use this website or order a report from NumeroVedaa, operated by Astro Guru. By placing an order, you agree to them.</p></article>
<article><h2>Our services</h2><p>NumeroVedaa provides personalised numerology reports, including reports for individual life, relationship compatibility, marriage dates, baby names, name correction, career and money, business names, mobile and vehicle numbers, and yearly forecasts. Each report is prepared and reviewed by a person and delivered as a PDF. We also offer a free birth-number and life-path calculator.</p></article>
<article><h2>Using our services</h2><ul className="legal-list">
<li>You must give accurate names, dates and other details. Your report is prepared from the information you provide.</li>
<li>Our reports are for guidance only. They are not a substitute for medical, legal, financial or other professional advice.</li>
<li>You must be at least 18 years old to place an order.</li>
</ul></article>
<article><h2>Payments</h2><p>Prices are shown in Indian rupees and are one-time payments, processed securely through Cashfree. We begin preparing your report once your payment has been verified.</p></article>
<article><h2>Intellectual property</h2><p>All content on this website, including text, graphics, logos and reports, is the property of NumeroVedaa and Astro Guru. Your report is for your personal use and may not be resold or republished.</p></article>
<article><h2>Limitation of liability</h2><p>Our reports are based on traditional numerology principles. We do not guarantee any particular outcome, and you are responsible for any decisions you make based on a report.</p></article>
<article><h2>Changes to these terms</h2><p>We may update these terms from time to time. The date at the top of this page shows when they last changed. Continuing to use our services after an update means you accept the updated terms.</p></article>
<article><h2>Related policies</h2><p>Please also read our <a href="/privacy-policy">Privacy Policy</a>, <a href="/refund-policy">Refund &amp; Cancellation Policy</a> and <a href="/shipping-policy">Shipping &amp; Delivery Policy</a>.</p></article>
<ContactDetails/>
</LegalPage>;}
