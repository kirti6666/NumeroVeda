import type {Metadata} from 'next';
import {PublicProvider} from '@/components/provider';
import './globals.css';
import './reference.css';
export const metadata:Metadata={title:{default:'NumeroVedaa — A little clarity. A more intentional tomorrow.',template:'%s | NumeroVedaa'},description:'Explore your birth and life-path numbers and personal numerology reports for life, relationships, baby names, career, and business.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PublicProvider>{children}</PublicProvider></body></html>;}

