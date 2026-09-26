import type {Metadata} from 'next';
import Link from 'next/link';
import {Mail,MessageCircle,Phone,Clock3} from 'lucide-react';
import {LegalPage} from '@/components/legal-page';
import {business} from '@/lib/business';
export const metadata:Metadata={title:'Contact Us'};
export default function ContactUs(){return <LegalPage eyebrow="HERE TO HELP" title="Contact Us" updated={false}>
<article><p>Questions about a report, your order or which report is right for you? Reach us on WhatsApp, phone or email.</p>
<div className="contact-cards">
<a className="contact-card" href={business.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={22}/><span><strong>WhatsApp</strong>{business.phone}</span></a>
<a className="contact-card" href={'tel:'+business.phoneHref}><Phone size={22}/><span><strong>Phone</strong>{business.phone}</span></a>
<a className="contact-card" href={'mailto:'+business.email}><Mail size={22}/><span><strong>Email</strong>{business.email}</span></a>
</div></article>
<article><h2><Clock3 size={22}/> Business hours</h2><ul className="legal-list">
<li>Monday to Saturday: 10:00 AM – 8:00 PM IST</li>
<li>Sunday: 11:00 AM – 5:00 PM IST</li>
</ul><p>We usually reply to all queries within 2–4 hours during business hours.</p></article>
<article><h2>Already ordered?</h2><p>Open your report any time on the <Link href="/track">Track your report</Link> page using your order number and access code.</p></article>
<article><h2>Business details</h2><ul className="legal-list">
<li>Name: {business.legalName}</li>
<li>GST: {business.gst}</li>
</ul><p>NumeroVedaa is a numerology service offering personalised numerology reports based on your name and date of birth.</p></article>
</LegalPage>;}
