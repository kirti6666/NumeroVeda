import type {Metadata} from 'next';
import {LegalPage,ContactDetails} from '@/components/legal-page';
import {business} from '@/lib/business';
export const metadata:Metadata={title:'Refund & Cancellation Policy'};
export default function RefundPolicy(){return <LegalPage eyebrow="POLICIES" title="Refund & Cancellation Policy">
<article><h2>Cancellation</h2><ul className="legal-list">
<li>You can cancel an order within 2 hours of payment, as long as we have not started preparing your report.</li>
<li>Once our numerologist has started working on your report, the order cannot be cancelled.</li>
<li>To cancel, contact us straight away at <a href={'mailto:'+business.email}>{business.email}</a> or {business.phone} with your order number.</li>
</ul></article>
<article><h2>Refunds</h2><ul className="legal-list">
<li>Refunds are given only for cancellations made within the eligible time window.</li>
<li>Refunds do not apply once your report has been delivered, because each report is a customised digital service prepared for you.</li>
<li>If you have a concern about a delivered report, contact us within 48 hours of delivery and we will work with you to resolve it.</li>
<li>Approved refunds are processed within 7–10 business days to your original payment method.</li>
</ul></article>
<article><h2>Our guarantee</h2><p>If, in the rare case, we are unable to deliver your report, you will receive a full refund or the option to choose another report of equal value.</p></article>
<ContactDetails/>
</LegalPage>;}
