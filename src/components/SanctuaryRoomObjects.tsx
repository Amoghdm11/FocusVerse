import React from 'react';
import { SanctuaryObject } from '../data/sanctuaryObjects';

// Each hit region is also the drawing's own coordinate box, so they cannot drift apart.
const themes: Record<string,[string,string,string]> = {
 'bruce-wayne':['Sonar receiver','Case notebook','Gotham mission board'],
 'miles-morales':['Rooftop boombox','Mural sketchbook','Mural project board'],
 'gwen-stacy':['Rehearsal amplifier','Sheet music','Set list'],
 'naruto-uzumaki':['Orange radio','Sealing scroll','Mission scroll'],
 'gojo-satoru':['Temple speaker','Talisman journal','Barrier assignments'],
 'levi-ackerman':['Regiment radio','Scout field notes','Expedition orders'],
 'l-lawliet':['Surveillance audio','Case notebook','Evidence board'],
 'elsa':['Crystal chimes','Frost journal','Crystal plans'],
 'rapunzel':['Music box','Painting journal','Lantern plans'],
 'moana':['Shell chimes','Wayfinder chart','Voyage chart'],
 'hermione-granger':['Enchanted gramophone','Study grimoire','Assignment parchment'],
 'wednesday-addams':['Gramophone','Manuscript','Chapter outline'],
 'officer-k':['Baseline receiver','Memory journal','Case assignments'],
 'neo':['Operator telephone','Operator log','Mission feed'],
 'cozy-study-girl':['Vinyl player','Study journal','Study plans'],
 'late-night-study-boy':['Desk speakers','Debug notebook','Study schedule'],
 'purring-window-cat':['Garden radio','Garden journal','Plant care board'],
 'loyal-fireplace-dog':['Cabin radio','Hearthside journal','Cabin checklist'],
};
export function roomObjectLayout(id:string):SanctuaryObject[] {
 const labels=themes[id];
 const music:Record<string,[number,number]>={'gwen-stacy':[87,365],'miles-morales':[790,398],'cozy-study-girl':[90,415],'neo':[780,377],'elsa':[125,398],'moana':[90,385],'purring-window-cat':[90,500],'loyal-fireplace-dog':[110,351]};
 const tasks:Record<string,[number,number]>={'bruce-wayne':[827,70],'miles-morales':[725,185],'gwen-stacy':[832,80],'naruto-uzumaki':[754,69],'gojo-satoru':[799,96],'levi-ackerman':[829,180],'l-lawliet':[807,88],'elsa':[801,181],'rapunzel':[830,75],'moana':[796,285],'hermione-granger':[755,92],'wednesday-addams':[798,80],'officer-k':[800,92],'neo':[830,230],'cozy-study-girl':[535,130],'late-night-study-boy':[763,225],'purring-window-cat':[803,95],'loyal-fireplace-dog':[430,87]};
 const [mx,my]=music[id]??[125,393], [tx,ty]=tasks[id];
 return [{feature:'music',label:labels[0],x:mx,y:my,width:130,height:85},{feature:'notes',label:labels[1],x:id==='miles-morales'?280:762,y:520,width:120,height:66},{feature:'tasks',label:labels[2],x:id==='l-lawliet'?638:id==='late-night-study-boy'?742:tx,y:id==='l-lawliet'?61:id==='late-night-study-boy'?230:ty,width:id==='l-lawliet'?293:id==='late-night-study-boy'?155:112,height:id==='l-lawliet'?216:id==='late-night-study-boy'?116:142}];
}
export function SanctuaryRoomObjects({id,objects}:{id:string;objects:SanctuaryObject[]}) {
 const fantasy=['elsa','moana','rapunzel','hermione-granger'].includes(id);
 const scroll=['naruto-uzumaki','moana','hermione-granger','levi-ackerman'].includes(id);
 const terminal=['neo','officer-k','bruce-wayne'].includes(id);
 const separateLight=['gwen-stacy','elsa','gojo-satoru','moana','purring-window-cat','loyal-fireplace-dog'].includes(id);
 return <g stroke="#2b2a37" strokeWidth="3" strokeLinejoin="miter">
 {separateLight&&<path d={id==='moana'?"M847 255L675 300V320":"M675 55V320"} fill="none" stroke="#7c807b" strokeWidth="2"/>}
 {separateLight&&<g transform="translate(675 350)"><path d="M0-30V-9M-19-6H19L15 38H-15Z" fill="#a77b50" stroke="#41333a"/><path d="M-12 1H12L9 30H-9Z" fill="#edce8c"/><path d="M0 2V29" stroke="#fff0b8" strokeWidth="3"/><path d="M-19 38H19" stroke="#73533d" strokeWidth="5"/></g>}
 {objects.filter(o=>!(o.feature==='tasks'&&['l-lawliet','late-night-study-boy'].includes(id))).map(o=><g key={o.feature} transform={`translate(${o.x} ${o.y})`} data-room-prop={o.feature}>
 {o.feature==='music'?<>
  {id!=='miles-morales'&&<><path d="M-9 80H140V90H-9Z" fill="#97765b"/><path d="M0 90L-5 137M129 90L134 137" fill="none" stroke="#5b514b" strokeWidth="7"/></>}
  {id==='gwen-stacy'?<><path d="M4 0H125V80H4Z" fill="#2d3147"/><path d="M12 22H117V70H12Z" fill="#53536a"/>{[0,1,2,3,4,5].map(i=><path key={i} d={`M17 ${28+i*7}H111`} stroke="#85808d" strokeWidth="2"/>)}<circle cx="22" cy="12" r="3" fill="#dcc59b"/><circle cx="40" cy="12" r="3" fill="#dcc59b"/></>:id==='elsa'||id==='moana'?<><path d="M5 15Q65-15 125 15M12 15V80M118 15V80" fill="none" stroke="#b3a77f" strokeWidth="5"/>{[0,1,2,3,4].map(i=><g key={i}><path d={`M${30+i*18} 8V${31+i%3*8}`} stroke="#ddc59c" strokeWidth="1"/><path d={`M${24+i*18} ${31+i%3*8}l6-6l6 6v27l-6 9l-6-9Z`} fill={id==='elsa'?'#a7d8e1':'#d7b58a'}/></g>)}</>:id==='hermione-granger'||id==='wednesday-addams'?<><path d="M15 60H114V80H15Z" fill="#704f46"/><ellipse cx="62" cy="61" rx="36" ry="9" fill="#232b35"/><path d="M73 60Q125 37 85 26" fill="none" stroke="#b19866" strokeWidth="6"/><path d="M85 26L40 10L30 44Z" fill="#c0a26c"/><ellipse cx="35" cy="27" rx="9" ry="18" fill="#685344"/></>:id==='cozy-study-girl'||id==='rapunzel'?<><path d="M5 42H124V79H5Z" fill="#895f54"/><path d="M5 42V4H124V42" fill="#664551"/><ellipse cx="60" cy="51" rx="38" ry="17" fill="#26323c"/><ellipse cx="60" cy="51" rx="11" ry="5" fill="#c89467"/><path d="M110 45L95 65H77" fill="none" stroke="#bdc4af" strokeWidth="4"/></>:id==='neo'?<><path d="M20 40Q65 15 110 40L125 77H4Z" fill="#263e38"/><path d="M16 34Q65 6 114 34" fill="none" stroke="#b9c8a8" strokeWidth="13"/><circle cx="65" cy="57" r="13" fill="#738778"/><circle cx="65" cy="57" r="6" fill="#293d35"/></>:<><path d="M4 20H126V79H4Z" fill={id==='naruto-uzumaki'?'#bd7b43':'#334451'}/><path d="M21 20V8H107V20" fill="none" stroke="#9eaa9c" strokeWidth="5"/>{[28,102].map(x=><g key={x}><circle cx={x} cy="52" r="20" fill="#172634"/><circle cx={x} cy="52" r="12" fill="#637f86"/><circle cx={x} cy="52" r="4" fill="#a1b3ab"/></g>)}<path d="M53 35H77V51H53Z" fill="#94c6bd"/><path d="M54 63H77" stroke="#dbb783" strokeWidth="4"/></>}
 </>:o.feature==='notes'?<>
  <path d="M-12 58H132V70H-12ZM-3 70L-7 112M124 70L130 112" fill="#775d51" strokeWidth="5"/>
  <path d="M0 7L58 12L118 4V55L58 63L0 55Z" fill={id==='elsa'?'#c3e0e2':'#e0c69b'}/><path d="M58 13V62M9 22L47 27M9 33L47 38M9 44L38 48M68 25L108 20M68 36L108 31M68 47L99 43" fill="none" stroke="#9b8666" strokeWidth="2"/>
  {scroll&&<path d="M0 3V59M117 0V58" stroke="#9c7553" strokeWidth="7"/>}
 </>:<>
  {id==='moana'&&<path d="M56-30V220" stroke="#9c7951" strokeWidth="9"/>}
  <path d={id==='elsa'?"M0 10L15 0H98L112 15V128L99 142H12L0 127Z":"M0 0H112V142H0Z"} fill={id==='elsa'?'#608fa6':terminal?'#314651':fantasy?'#8c806c':'#88634e'} stroke="#a88a68" strokeWidth="5"/>
  {scroll?<g><path d="M13 13H99V129H13Z" fill="#dbc392"/><path d="M8 13H104M8 129H104" stroke="#73563f" strokeWidth="8"/>{id==='moana'?<g fill="none" stroke="#587c81" strokeWidth="2"><path d="M25 104L45 77L34 47L77 32L85 82L63 107Z"/>{[[25,104],[45,77],[34,47],[77,32],[85,82],[63,107]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3" fill="#587c81"/>)}</g>:<g stroke="#897050" strokeWidth="2"><path d="M26 37H87M26 53H80M26 69H87M26 85H73M26 101H85"/><circle cx="56" cy="116" r="4" fill="#a25c4e"/></g>}</g>:id==='elsa'?<g fill="none" stroke="#c6eaf0" strokeWidth="2"><path d="M55 20V70M30 45H80M37 27L73 63M73 27L37 63M18 91H94M18 106H80M18 121H91"/></g>:terminal?<><path d="M9 10H103V128H9Z" fill="#183c43"/>{[0,1,2,3,4,5].map(i=><path key={i} d={`M20 ${26+i*17}h${i%2?52:72}`} stroke="#99c8bc" strokeWidth="3"/>)}<circle cx="96" cy="134" r="2" fill="#d0b17b"/></>:<><path d="M12 14L61 18L57 71L9 67ZM55 78L102 72L107 125L60 132Z" fill="#e1c58f"/><path d="M21 29L51 32M20 40L45 43M67 90L96 87M68 101L96 98M69 112L90 110" stroke="#957b58" strokeWidth="2"/><circle cx="35" cy="19" r="3" fill="#a65c50"/><circle cx="80" cy="79" r="3" fill="#6a8e87"/></>}
 </>}
 </g>)}
 </g>;
}
