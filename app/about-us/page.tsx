import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {LegalPage,ContactDetails} from '@/components/legal-page';
export const metadata:Metadata={title:'About Us'};
export default function AboutUs(){return <LegalPage eyebrow="OUR STORY" title="About Us" updated={false}>
<article><p>NumeroVedaa is the numerology service of Astro Guru, a trusted name in Vedic astrology and numerology with years of experience helping people across India and abroad.</p></article>
<article><h2>Our mission</h2><p>We believe every name and number carries a unique vibration that influences your career, relationships and overall well-being. Our mission is to help you understand your numbers, and the name that suits them, so you can make clearer and more intentional choices.</p></article>
<article><h2>What we offer</h2><ul className="legal-list">
<li>Personalised numerology reports for your life, relationships, marriage dates, baby names, name correction, career, business names, and mobile and vehicle numbers.</li>
<li>Analysis of your core numbers, including Mulank (birth number) and Bhagyank (life-path number).</li>
<li>Answers to the questions you share with us at checkout.</li>
<li>A free calculator to find your birth number and life-path number.</li>
</ul></article>
<article><h2>Why choose us</h2><ul className="legal-list">
<li>Expert-prepared, 100% personalised reports, reviewed by a real person.</li>
<li>Delivered as a PDF within 12–24 hours of verified payment.</li>
<li>Affordable one-time pricing.</li>
<li>Trusted by clients across India and abroad.</li>
</ul><Link className="button" href="/reports">Explore personal reports <ArrowRight size={17}/></Link></article>
<ContactDetails/>
</LegalPage>;}
