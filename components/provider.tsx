'use client';
import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import type {PublicData} from '@/lib/types';
import {api} from '@/lib/api';
const Context=createContext<{data:PublicData|null;error:string;reload:()=>void}>({data:null,error:'',reload:()=>{}});
export function PublicProvider({children}:{children:React.ReactNode}){const [data,setData]=useState<PublicData|null>(null);const [error,setError]=useState('');const reload=useCallback(()=>{api<PublicData>('/public').then(d=>{setData(d);setError('');document.title=d.settings.brand+' — Personal numerology & daily guidance';}).catch(e=>setError(e.message));},[]);useEffect(()=>{reload();window.addEventListener('focus',reload);return()=>window.removeEventListener('focus',reload);},[reload]);return <Context.Provider value={{data,error,reload}}>{children}</Context.Provider>;}
export const usePublic=()=>useContext(Context);
