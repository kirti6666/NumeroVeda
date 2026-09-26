import type {Metadata} from 'next';
import {SiteShell} from '@/components/site-shell';
import {NumberProfileView} from '@/components/number-profile';
export const metadata:Metadata={title:'Your Numerology Profile',robots:{index:false}};
export default function YourNumbers(){return <SiteShell><NumberProfileView/></SiteShell>;}
