'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,CheckCircle2,Crown,Brain,Heart,Moon,Flower2,Sun,CalendarDays,Palette,Hash,Sparkles,CircleCheck,CircleAlert} from 'lucide-react';
import {numerologyProfile,reduceNumber,reductionSteps,type NumberProfile} from '@/lib/numerology';
import {numberMeanings,subconsciousMeanings,rulingByBirthNumber} from '@/lib/number-meanings';

export const profileStorageKey='nv-profile';
const steps=['Core numbers','Name number','Name analysis'];
const nextLabel=['See how your name adds up','See your name analysis'];

function Medal({n,size='md'}:{n:number|null;size?:'md'|'lg'}){return <span className={'np-medal np-medal-'+size}><span>{n??'—'}</span></span>;}

function CoreCard({tone,icon,title,text,n,featured=false}:{tone:string;icon:React.ReactNode;title:string;text:string;n:number|null;featured?:boolean}){
  return <article className={'np-card np-'+tone+(featured?' np-featured':'')}>
    <div className="np-card-head"><span className="np-icon" aria-hidden="true">{icon}</span><h3>{title}</h3></div>
    <p>{text}</p>
    <Medal n={n} size={featured?'lg':'md'}/>
  </article>;
}

function CoreNumbers({p}:{p:NumberProfile}){
  const m=(n:number|null)=>n?numberMeanings[n]:null;
  const ruling=rulingByBirthNumber[p.birth];
  return <>
    <div className="np-section-title"><h2>Your Core Numbers</h2><p>Five key numbers derived from your name and birth date.</p></div>
    <div className="np-grid">
      <CoreCard featured tone="gold" icon={<Flower2 size={20}/>} title="Your Life Path Number" n={p.lifePath} text={`${m(p.lifePath)!.title} — ${m(p.lifePath)!.lifePath}`}/>
      <CoreCard tone="plum" icon={<Crown size={18}/>} title="Your Name Destiny Number" n={p.destiny} text={m(p.destiny)!.destiny}/>
      <CoreCard tone="sage" icon={<Brain size={18}/>} title="Your Personality Number" n={p.personality} text={m(p.personality)?.personality??'Your name has no consonants to calculate this number.'}/>
      <CoreCard tone="rose" icon={<Heart size={18}/>} title="Your Soul Urge Number" n={p.soulUrge} text={m(p.soulUrge)?.soulUrge??'Your name has no vowels to calculate this number.'}/>
      <CoreCard tone="bronze" icon={<Moon size={18}/>} title="Your Subconscious Self Number" n={p.subconscious} text={subconsciousMeanings[p.subconscious]}/>
    </div>
    <div className="np-section-title np-sub"><h2>Your Ruling Details</h2><p>Based on your birth number (Mulank) {p.birth}, from the day you were born.</p></div>
    <div className="np-facts">
      <div><span><Sun size={15}/> Ruling planet</span><strong>{ruling.planet}</strong></div>
      <div><span><CalendarDays size={15}/> Lucky day</span><strong>{ruling.day}</strong></div>
      <div><span><Palette size={15}/> Lucky colours</span><strong>{ruling.colours}</strong></div>
      <div><span><Hash size={15}/> Lucky numbers</span><strong>{ruling.numbers}</strong></div>
    </div>
    <details className="np-method"><summary>How these numbers are calculated</summary>
      <p><b>Life Path:</b> every digit of your birth date, {p.lifePathDigits.join(' + ')} = {p.lifePathTotal}{reductionSteps(p.lifePathTotal).map(s=>' → '+s)}.</p>
      <p><b>Birth number:</b> the day you were born, reduced to one digit.</p>
      <p><b>Name numbers</b> use the Pythagorean letter values (A = 1 to I = 9, then J = 1 again). Destiny adds every letter, Soul Urge adds the vowels, Personality adds the consonants, and Subconscious Self counts how many of the numbers 1–9 appear in your name.</p>
      <p>Master numbers 11, 22 and 33 are kept as they are, as is standard practice.</p>
    </details>
  </>;
}

function NameNumber({p}:{p:NumberProfile}){
  const words=p.name.split(' ');
  return <>
    <div className="np-section-title"><h2>Your Name Number</h2><p>Every letter has a value. Here is how yours adds up.</p></div>
    <div className="np-panel">
      <span className="np-kicker">Full name</span>
      <strong className="np-fullname">{p.name}</strong>
      <div className="np-words">{words.map((w,wi)=><div className="np-word" key={wi}>{p.letters.filter(l=>l.word===wi).map((l,i)=><span className="np-tile" key={i}><b>{l.letter}</b><small>{l.value}</small></span>)}</div>)}</div>
      <div className="np-sum">
        <code>{p.letters.map(l=>l.value).join(' + ')} = <b>{p.destinyTotal}</b></code>
        {reductionSteps(p.destinyTotal).map(s=><code key={s}>{s}</code>)}
        <span className="np-sum-label">Your Name Number</span>
        <Medal n={p.destiny} size="lg"/>
        <p>This is the same number as your Name Destiny Number. It describes the talents and direction your full name carries.</p>
      </div>
    </div>
  </>;
}

function Analysis({p}:{p:NumberProfile}){
  const m=numberMeanings[p.destiny];
  const planet=rulingByBirthNumber[reduceNumber(p.destiny)].planet;
  return <>
    <div className="np-section-title"><h2>Your Name Number Analysis</h2><p>What the number {p.destiny} means for you.</p></div>
    <div className="np-hero-card"><Medal n={p.destiny} size="lg"/><div><span className="np-kicker">Name number · ruled by {planet}</span><h3>{m.title}</h3><p>{m.destiny}</p></div></div>
    <div className="np-list np-good"><h3>Your Strengths</h3><ul>{m.strengths.map(s=><li key={s}><CircleCheck size={17}/>{s}</li>)}</ul></div>
    <div className="np-list np-watch"><h3>Common Challenges</h3><ul>{m.challenges.map(s=><li key={s}><CircleAlert size={17}/>{s}</li>)}</ul></div>
    <div className="np-upsell"><Sparkles size={20}/><div><h3>This is a free preview</h3><p>Your full report is prepared and reviewed by a numerologist. It covers how your name and birth numbers work together, whether a name correction would help, and answers to your own questions.</p><Link href="/reports">Compare all reports</Link></div></div>
  </>;
}

export function NumberProfileView(){
  const [profile,setProfile]=useState<NumberProfile|null|undefined>(undefined);
  const [step,setStep]=useState(0);
  useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem(profileStorageKey)||'null');setProfile(saved?numerologyProfile(saved.name,saved.dob):null);}catch{setProfile(null);}},[]);
  useEffect(()=>{window.scrollTo({top:0});},[step]);
  if(profile===undefined)return <section className="container section np-page"><p>Loading your numbers…</p></section>;
  if(!profile)return <section className="container section np-page np-empty"><h1>Check your numbers first</h1><p>Enter your name and date of birth on the home page to see your free numerology profile.</p><Link className="button" href="/#calculator">Check my numbers <ArrowRight size={17}/></Link></section>;
  const pct=Math.round((step+1)/steps.length*100);
  return <section className="np-page">
    <div className="container np-inner">
      <div className="np-progress"><div><span>Step {step+1} of {steps.length} · {steps[step]}</span><span>{pct}%</span></div><div className="np-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Profile progress"><i style={{width:pct+'%'}}/></div></div>
      {step===0&&<div className="np-intro"><span className="np-done"><CheckCircle2 size={16}/> Analysis complete</span><span className="np-kicker">Free preview for</span><h1>{profile.name}</h1><span className="np-rule" aria-hidden="true"><Sparkles size={14}/></span></div>}
      {step===0&&<CoreNumbers p={profile}/>}
      {step===1&&<NameNumber p={profile}/>}
      {step===2&&<Analysis p={profile}/>}
    </div>
    <div className="np-actions"><div className="container np-actions-inner">
      {step>0?<button type="button" className="np-back" onClick={()=>setStep(step-1)} aria-label="Previous step"><ArrowLeft size={20}/></button>:<Link className="np-back" href="/#calculator" aria-label="Back to calculator"><ArrowLeft size={20}/></Link>}
      {step<steps.length-1?<button type="button" className="np-next" onClick={()=>setStep(step+1)}>{nextLabel[step]} <ArrowRight size={18}/></button>:<Link className="np-next" href="/report-details?report=personal-numerology">Get your full report <ArrowRight size={18}/></Link>}
    </div></div>
  </section>;
}
