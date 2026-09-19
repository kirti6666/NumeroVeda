'use client';
import Link from 'next/link';
import {ArrowRight,Check,Sun} from 'lucide-react';
import {usePublic} from './provider';
import {money} from '@/lib/types';
export function ReportCards(){const {data}=usePublic();return (<div className="report-stack">{data?.products.map(p=><article className="reference-report" key={p.id}><div className={'book-scene book-category-'+p.id} aria-hidden="true"><div className="report-book"><small>{data.settings.brand}</small><Sun size={55} strokeWidth={.7}/><strong>{p.name}</strong><span>YOUR PERSONAL REPORT</span></div><div className="book-page"><Sun size={28}/><i/><i/><i/><i/><i/></div></div><div className="report-description"><span className="report-kicker">PERSONAL PDF · HUMAN-REVIEWED</span><h3>{p.name}</h3><p>{p.description}</p><div className="report-price">{money(p.price)}<small>one-time payment</small></div><Link className="button report-buy" href={'/report-details?report='+p.id}>Get Report <ArrowRight size={16}/></Link></div><div className="report-includes"><span className="report-kicker">✧ WHAT’S INSIDE</span><ul>{p.features.map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul></div></article>)}</div>);}
