'use client';
import {BookOpen,HeartHandshake,UserRound} from 'lucide-react';
import {usePublic} from './provider';
const fallbackTeam=[
 {id:'role-life',name:'[Add numerologist name]',specialty:'Lead Numerologist · Individual Life',bio:'Prepares personal life-path and name-analysis reports.'},
 {id:'role-relationship',name:'[Add numerologist name]',specialty:'Relationship & Compatibility',bio:'Focuses on relationship compatibility and family reports.'},
 {id:'role-business',name:'[Add numerologist name]',specialty:'Name & Business Numerology',bio:'Works on baby names, name correction and business-name numerology.'}
];
export function Experts(){const {data}=usePublic();const team=data?.experts.length?data.experts:fallbackTeam;return <section className="expert-section" id="numerologists"><div className="container expert-grid"><div><div className="eyebrow">THE PEOPLE BEHIND YOUR PERSPECTIVE</div><h2>Ancient wisdom.<br/><em>A human connection.</em></h2><p>A personal report begins with someone taking the time to understand your questions. Our numerologists bring care and perspective to your story — every report is prepared and reviewed by a real person.</p><div className="feature-line"><BookOpen size={19}/> Personal interpretation, clearly explained</div><div className="feature-line"><HeartHandshake size={19}/> Prepared and reviewed by a real person</div></div><div className="team-grid" aria-label="Our numerologists">{team.map(expert=><div className="team-card" key={expert.id}><span className="team-mark" aria-hidden="true"><UserRound size={20}/></span><div><h3>{expert.name}</h3><span className="role">{expert.specialty}</span>{expert.bio&&<p>{expert.bio}</p>}</div></div>)}</div></div></section>;}
