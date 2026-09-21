export const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'] as const;
export const signSymbols = ['♈︎','♉︎','♊︎','♋︎','♌︎','♍︎','♎︎','♏︎','♐︎','♑︎','♒︎','♓︎'];
export type Kind = 'panchang' | 'horoscopes' | 'experts' | 'testimonials' | 'products';
export type Entry = { id: string; version?: number; published: boolean; [key: string]: unknown };
export type Product = Entry & {name:string;description:string;price:number;features:string[];order:number};
export type Expert = Entry & {name:string;specialty:string;bio:string;image:string;order:number};
export type Testimonial = Entry & {name:string;quote:string;service:string;consent:boolean;order:number};
export type Settings = {brand:string;tagline:string;email:string;phone:string;city:string;language:string;heroTitle:string;heroDescription:string;paymentsEnabled:boolean;refundPolicy:string;privacyPolicy:string;terms:string};
export type PublicData = {settings:Settings;products:Product[];experts:Expert[];testimonials:Testimonial[];panchang:Entry[];horoscopes:Entry[];payment:{configured:boolean;enabled:boolean;mode:string}};
export const statuses = ['pending_payment','paid','preparing','review','delivered','cancelled','refunded'] as const;
export type OrderStatus = typeof statuses[number];
export type Order = {id:string;productId:string;productName:string;amount:number;name:string;email:string;phone:string;address:string;dob:string;question:string;intake?:{label:string;value:string}[];language:string;status:OrderStatus;createdAt:string;paidAt:string|null;dueAt:string|null;deliveredAt:string|null;paymentId:string|null;reportFile:string|null;customerNote:string;internalNote:string;assignedTo:string;cashfreeSession?:string;hasReport?:boolean};
export const statusLabel:Record<OrderStatus,string> = {pending_payment:'Awaiting payment',paid:'Payment received',preparing:'Being prepared',review:'Final review',delivered:'Ready to download',cancelled:'Cancelled',refunded:'Refund recorded'};
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function money(n:number){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n/100);}
export function formatDate(s:string|null){return s?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(s))+' IST':'—';}

