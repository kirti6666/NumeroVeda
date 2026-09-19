'use client';
import Link from 'next/link';


import {Sun,ArrowUpRight,Mail} from 'lucide-react';
import {usePublic} from './provider';
export function Brand(){const {data}=usePublic();return <Link href="/" className="brand" aria-label="Home"><span className="brand-mark"><Sun size={23} strokeWidth={1.3}/></span><span>{data?.settings.brand||'NumeroVeda'}<small>THE ART OF SELF-DISCOVERY</small></span></Link>;}
export function SiteShell({children}:{children:React.ReactNode}){const {data,error}=usePublic();return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header reference-header"><div className="container nav"><Brand/><Link className="report-access" href="/track"><span><small>Already Paid?</small>Access Report</span><ArrowUpRight size={18}/></Link></div></header>{error&&<div className="container"><p className="notice error" role="alert">We’re having trouble loading current content. Please refresh in a moment.</p></div>}<main id="main">{children}</main><footer className="site-footer"><div className="container footer-grid"><div><Brand/><p>A little clarity.<br/>A more intentional tomorrow.</p></div><div><h3>Explore</h3><Link href="/reports">Personal reports</Link><Link href="/track">Track your report</Link></div><div><h3>Here to help</h3>{data?.settings.email?<a href={'mailto:'+data.settings.email}><Mail size={15}/>{data.settings.email}</a>:<span className="muted">Support details coming soon</span>}{data?.settings.phone&&<a href={'tel:'+data.settings.phone}>{data.settings.phone}</a>}<Link href="/policies">Delivery, privacy & refunds</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {data?.settings.brand||'NumeroVeda'}. All rights reserved.</span><Link href="/admin">Admin sign in</Link></div></footer></>;}



