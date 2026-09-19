'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container section"><h1>Let’s try that again.</h1><p>This page couldn’t load. Your saved information is still safe.</p><button className="button" onClick={reset}>Try again</button></main>;}
