import type {Metadata} from 'next';
import {LegalPage,ContactDetails} from '@/components/legal-page';
export const metadata:Metadata={title:'Shipping & Delivery Policy'};
export default function ShippingPolicy(){return <LegalPage eyebrow="POLICIES" title="Shipping & Delivery Policy">
<article><p>NumeroVedaa delivers all reports digitally. There is no physical shipping.</p></article>
<article><h2>How your report is delivered</h2><ul className="legal-list">
<li>Every report is delivered as a PDF.</li>
<li>Your PDF is available on the secure <a href="/track">Track your report</a> page. Use the order number and private access code you receive at checkout to open and download it.</li>
<li>Please keep your order number and access code safe, and check that your email address and mobile number are correct when you order.</li>
</ul></article>
<article><h2>Delivery time</h2><ul className="legal-list">
<li>All reports are delivered within 12–24 hours after your payment is verified and we have received your complete details.</li>
<li>Delivery may take slightly longer on weekends and public holidays.</li>
</ul></article>
<article><h2>If your report hasn’t arrived</h2><p>If your report is not ready within the stated time, check the Track your report page and your email, including the spam folder, then contact us straight away.</p></article>
<ContactDetails/>
</LegalPage>;}
