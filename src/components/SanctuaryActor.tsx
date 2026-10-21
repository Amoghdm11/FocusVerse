import React from 'react';
import { SanctuaryCostumeDetails } from './SanctuaryCostumeDetails';
import { SanctuaryDesign } from '../data/sanctuaries';

// Tools are drawn at the wrist. Arm segments are rebuilt each frame from fixed
// shoulder/elbow joints, so the body and planted feet never slide with the action.
function Tool({kind,color,frame}:{kind:string;color:string;frame:number}) {
 const wave=[0,.5,1,.5,0,-.5,-1,-.5][frame%8];
 const ink='#192331';
 switch(kind) {
 case 'wrench': return <path d="M0 8V-17L-7-24V-32L-3-27H3L7-32V-24L0-17" fill="none" stroke="#bed0d5" strokeWidth="5"/>;
 case 'brush': case 'pencil': case 'quill': return <g><path d="M-3-24L4 16" stroke="#e9bd79" strokeWidth="4"/><path d="M4 16L5 23" stroke={color} strokeWidth="3"/>{kind==='quill'&&<path d="M-3-20Q-26-52-3-42Q10-38-3-20" fill="#e9d8b3"/>}</g>;
 case 'cup': return <g fill="#e4d4b6" stroke={ink} strokeWidth="2"><path d="M-12-12H10V7Q0 18-12 7Z"/><path d="M10-8Q26-10 21 3L10 6" fill="none"/><path d="M-5-17Q-12-25-5-34" stroke="#d7d9cc" fill="none"/></g>;
 case 'scanner': return <g><rect x="-17" y="-24" width="30" height="40" rx="4" fill="#263d49" stroke="#9cb9c3" strokeWidth="2"/><path d="M-10-12H7M-10-4H4M-10 4H9" stroke={color} strokeWidth="3"/></g>;
 case 'spray': return <g><rect x="-9" y="-14" width="18" height="33" rx="3" fill="#c95282" stroke={ink} strokeWidth="2"/><path d="M-3-14V-21H5" stroke="#d9e1dd" strokeWidth="5"/><path d="M8-22L33-29M8-22H36M8-22L33-15" stroke={color} opacity=".65"/></g>;
 case 'sticks': case 'cymbal': return <path d="M-10 14L17-31" stroke="#e7bd8e" strokeWidth="5"/>;
 case 'blade': return <path d="M0 15V-10L-7-12V-61L4-70L7-12H0M-12-8H12" fill="#c6d3cb" stroke="#6f8490" strokeWidth="3"/>;
 case 'sugar': return <path d="M-8-8H7V7H-8Z" fill="#f9eee0" stroke="#b4c0c5" strokeWidth="2"/>;
 case 'snow': return <g stroke="#d9fcff" strokeWidth="3"><path d="M0-46V0M-23-23H23M-16-39L16-7M16-39L-16-7M-7-39L0-32L7-39M-7-7L0-14L7-7"/></g>;
 case 'ribbon': return <path d="M0 0Q-70-45-25-65Q30-78 34-105" fill="none" stroke="#9bdcef" strokeWidth="9" opacity=".8"/>;
 case 'lantern': return <g><path d="M0 0V-14" stroke="#f5d891"/><path d="M-17-45H17L13-14H-13Z" fill="#eebc71" stroke="#a97b65" strokeWidth="2"/><path d="M-5-40V-20" stroke="#fff1b8" strokeWidth="6"/></g>;
 case 'paddle': return <g transform={`rotate(${25+wave*8})`}><path d="M0-65V65" stroke="#c0905c" strokeWidth="6"/><path d="M0 25Q-27 62 0 88Q27 62 0 25" fill="#af784d" stroke="#e2bb82" strokeWidth="3"/></g>;
 case 'compass': return <g><circle cy="-8" r="17" fill="#c6a77b" stroke="#294a55" strokeWidth="3"/><path d="M0-22L5-8L0 7L-5-8Z" fill="#e7e1c3"/></g>;
 case 'wand': return <g><path d="M-3 12L15-40" stroke="#b7936b" strokeWidth="4"/><path d="M15-53V-43M5-43L12-40M24-43L19-40" stroke={color} strokeWidth="3"/></g>;
 case 'bow': return <g><path d="M-45-20L45 20" stroke="#b08a67" strokeWidth="4"/><path d="M-44-15L44 24" stroke="#e6d7bd" strokeWidth="2"/></g>;
 case 'horse': return <path d="M-20 3L-12-8H8L13-24L23-17L18-2L12 3V19H7V5H-9V19H-14V5Z" fill="#bc9165" stroke="#674c39" strokeWidth="2"/>;
 case 'spoon': return <g><path d={`M0 16Q${-12-wave*13} -9 ${2-wave*10} -20`} stroke="#c3d4cd" strokeWidth="4" fill="none"/><ellipse cx={4-wave*10} cy="-28" rx="8" ry="13" fill="#c3d4cd"/></g>;
 case 'hologram': return <g transform={`scale(${1+wave*.14} 1)`} stroke={color} fill="#366778" strokeWidth="2"><path d="M-9-63H9L19-53L30-25L20-20L10-40V-16L16 8H4L0-9L-5 8H-17L-11-16V-40L-21-20L-31-25L-19-53Z"/><ellipse cy="16" rx="38" ry="8" fill="none"/><circle cy="-42" r="5" fill={color}/></g>;
 case 'orb': case 'infinity': case 'spark': return <g fill="none" stroke={color}><circle cy="-30" r="24" strokeWidth="2"/><ellipse cy="-30" rx="33" ry="10" strokeWidth="2" transform="rotate(-25 0 -30)"/><path d="M-17-30L-5-45L0-22L15-36" strokeWidth="4"/><circle cy="-30" r="35" strokeWidth="6" opacity=".12"/></g>;
 default: return null;
 }
}
export function SanctuaryActor({id,design:d,tool,frame,layer}:{id:string;design:SanctuaryDesign;tool:string;frame:number;layer:'body'|'hands'}) {
 const v=[0, .5,1,.5,0,-.5,-1,-.5][frame%8];
 const pet=id.endsWith('-cat')||id.endsWith('-dog');
 const cat=id.endsWith('-cat');
 const masked=['bruce-wayne','miles-morales','gwen-stacy','tony-stark'].includes(id);
 const seated=!['elsa','moana','gojo-satoru','miles-morales'].includes(id);
 const longHair=['elsa','rapunzel','hermione-granger','wednesday-addams','moana','cozy-study-girl'].includes(id);
 if(pet) return layer==='hands'?null:<g transform={`translate(${d.x} ${d.y}) scale(${d.scale})`} stroke="#273035" strokeWidth="3" data-actor={id}>
  <ellipse cx="0" cy="112" rx="108" ry="18" fill="#151d26" opacity=".35" stroke="none"/>
  <path d={`M50 75Q${cat?140:110} ${30+v*15} ${cat?65:94} ${cat?5:58}`} fill="none" stroke={d.hair} strokeWidth="18"/>
  <path d="M-65 90Q-79 0 0 7Q67 5 62 94Z" fill={d.suit}/>
  <path d={tool==='paw'?'M28 55V105H54':'M-45 50V105H-73M28 55V105H54'} fill="none" stroke={d.skin} strokeWidth="22"/>
  <g transform={`rotate(${tool==='ear'?v*5:tool==='leaf'?v*7:0} -38 18)`}>
   <path d={cat?'M-79 25V-38L-53-19L-21-21L0-39L6 26Q-36 59-79 25':'M-83 19Q-88-36-37-32Q7-32 7 21L-15 46H-57Z'} fill={d.skin}/>
   {!cat&&<path d={`M-77-24Q-115 ${20+v*5}-77 42M-5-23Q28 ${20-v*5}-4 43`} fill={d.hair}/>}
   {cat&&<g fill="none" stroke="#866648" strokeWidth="4"><path d="M-60-20L-54-5M-43-23V-7M-26-22L-31-6M-76 14L-63 18M-5 14L-19 18"/></g>}
   <path d="M-66 22Q-57 12-44 24Q-29 12-20 24L-27 37H-58Z" fill="#e7cfaa" stroke="none"/>
   <path d="M-68 6h10M-31 6h10" stroke="#292c2b" strokeWidth="5"/><path d="M-48 18L-40 23L-33 18" fill="#6d4940"/>
   {cat&&<path d="M-60 23L-94 18M-60 29L-93 33M-22 23L13 18M-22 29L12 33" strokeWidth="1.5"/>}
  </g>
  <path d="M-50 52Q-13 76 24 49L14 72Q-16 86-48 69Z" fill="#765b47" stroke="none"/>
  <path d="M-48 59Q-12 81 21 57" stroke="#9b4946" strokeWidth="6" fill="none"/><path d="M-10 76L-4 80L-10 89L-16 80Z" fill="#d7b66f" strokeWidth="1"/>
  <path d="M-54 97v9m7-9v9m85-9v9m7-9v9" stroke="#876746" strokeWidth="1.5"/>
  {tool==='paw'&&<path d={cat?`M-24 76Q-45 ${55-v*14}-52 ${27-v*8}`:`M-45 55Q-60 ${75-v*8}-92 ${70-v*9}`} stroke={d.skin} strokeWidth="19" fill="none" data-joint="paw"/>}
  {tool==='leaf'&&<path d={`M${-100+v*16} -40q25-28 38-10q-7 26-38 10`} fill="#a9c07b"/>}
 </g>;
 let left:[number,number]=[-62,146],right:[number,number]=[18,140];
 if(['orb','hologram','spark','infinity','snow','ribbon','lantern','compass'].includes(tool)) {right=[52,100-v*9];left=[-35,128+v*3];}
 else if(['blindfold','headphones'].includes(tool)) right=[27,20+v*4];
 else if(['cup','sugar'].includes(tool)) {right=[8,63-v*12];if(id==='cozy-study-girl')left=[-4,66-v*12];}
 else if(tool==='blade') {right=[-12,135];left=[-10,100+v*10];}
 else if(tool==='bow') {right=[-26+v*18,143+v*8];left=[-43,96];}
 else if(tool==='paddle') right=[42,100+v*8];
 else if(tool==='cymbal') {left=[-48,143+v*9];right=[130,120-v*8];}
 else if(tool==='sticks') {left=[-48,143+v*9];right=[-20,143-v*9];}
 else if(tool==='type') {left=[-48,155+v*3];right=[25,155-v*3];}
 else {right=[-10+v*7,146+v*3];}
 if(id==='wednesday-addams'&&tool==='type'){left=[-100,155+v*3];right=[-65,155-v*3];}
 const arm=(near:boolean)=>{const wrist=near?right:left; const shoulder=near?[25,69]:[-25,69];const elbow=id==='wednesday-addams'&&tool==='type'?(near?[5,110]:[-55,110]):near?[42,111]:[-43,110];return <g key={String(near)} data-joint={near?'near':'far'}>
 <path d={`M${shoulder}L${elbow}L${wrist}`} stroke="#142333" strokeWidth="19" fill="none"/><path d={`M${shoulder}L${elbow}L${wrist}`} stroke={id==='moana'?d.skin:d.suit} strokeWidth="14" fill="none"/>
 <path d={`M${shoulder[0]-2} ${shoulder[1]}L${elbow[0]-2} ${elbow[1]-2}L${wrist[0]} ${wrist[1]-2}`} fill="none" stroke={d.palette[1]} strokeWidth="2" opacity=".65"/>
 <g transform={`translate(${wrist})`}><path d="M-8-6H5L10-2V5L4 7H-7L-10 2Z" fill={masked?d.suit:d.skin}/><path d="M-5-2H5M-5 2H5" stroke="#725d57" strokeWidth=".8"/>{tool==='blade'&&!near&&<path d="M-10-10L13-6L10 14L-12 8Z" fill="#c5d1b7"/>}{(near||tool==='sticks')&&<Tool kind={tool} color={d.palette[2]} frame={frame}/>}</g></g>};
 return <g transform={`translate(${d.x} ${d.y}) scale(${d.scale})`} stroke="#182633" strokeWidth="2.5" strokeLinejoin="miter" data-actor={layer==='body'?id:undefined}>
 {layer==='body'?<>
 {id==='l-lawliet'&&<path d="M-50 207H50V224H-50ZM-40 224V253M40 224V253" fill="#4e626a" strokeWidth="6"/>}<ellipse cy="251" rx="64" ry="13" fill="#111d2b" opacity=".4" stroke="none"/>
 {['bruce-wayne','levi-ackerman','neo','elsa'].includes(id)&&<path d="M-33 62Q-70 150-62 229L-36 214L-13 230L16 215L47 229L38 62Z" fill={id==='elsa'?'#74afc1':'#1c2a32'}/>}
 {longHair&&<path d={`M-32 15Q-59 65-40 ${id==='rapunzel'?235:145}L42 ${id==='rapunzel'?235:145}Q58 60 31 10Z`} fill={d.hair}/>}
 <path d={id==='l-lawliet'?'M-27 129L-52 113L-72 139L-33 204H-11L-40 147L-8 160L16 137L35 154L12 224H33L58 147L34 113L9 137Z':seated?'M-27 129H29L33 157L-15 177L-6 229H-26L-43 168L-40 156L5 145L-24 151L-56 174L-57 229H-78L-79 163L-72 153Z':'M-27 129L-29 229H-8L0 160L14 229H36L28 129Z'} fill={id==='naruto-uzumaki'?d.suit:'#2b3540'}/>
 <path d={id==='l-lawliet'?'M-34 198H-10V212H-49V206ZM12 219H34L44 228V235H10Z':seated?'M-79 223H-56V244H-96V237ZM-27 223H-5L7 239V244H-27Z':'M-30 224H-7V244H-47V237ZM13 224H37L49 239V244H13Z'} fill={['l-lawliet','moana','rapunzel'].includes(id)?d.skin:id==='elsa'?'#a9dbe1':id==='miles-morales'?'#a84651':id==='gwen-stacy'?'#73bac0':'#22303a'}/>
 {['elsa','rapunzel','hermione-granger','wednesday-addams','moana'].includes(id)&&<path d={seated?"M-27 115H28L33 150L-37 189L-77 180L-63 155Z":"M-27 115H28L51 222Q0 240-48 222Z"} fill={d.suit}/>}
 <path d="M-16 50H17L33 64L30 138Q0 149-31 138L-33 64Z" fill={d.suit}/>
 <path d="M-22 77L-19 125M15 75L20 131" stroke={d.palette[1]} opacity=".65" strokeWidth="4"/>
 <path d="M-10 42V58Q0 68 10 58V42" fill={masked?d.suit:d.skin}/>
 <g transform={`translate(0 7) scale(.88) rotate(${tool==='blindfold'?v:tool==='sugar'?-5:0} 0 45)`}>
 <path d="M-29 9L-22-8H18L29 8V35L17 50H-14L-29 35Z" fill={masked?d.suit:d.skin}/>
 {!masked&&<path d={id==='naruto-uzumaki'?'M-32 12L-39-6L-21-3L-17-22L-2-10L12-24L18-9L34-13L29 15L11 5L-10 9Z':id==='elsa'?'M-30 24Q-36-12-9-19Q29-27 32 12L22 20L17 2Q-10 15-27 6Z':id==='levi-ackerman'?'M-30 30V-2Q-6-23 20-11L31 0V28L18 4L8 12L1 2L-18 23L-17 6Z':id==='moana'||id==='hermione-granger'?'M-31 32Q-43 10-32-9Q-20-26-7-16Q9-30 23-15Q40-13 36 12L29 31L21 13L9 7L-4 15L-18 8L-24 29Z':id==='officer-k'?'M-29 21L-30 0Q-9-20 18-12L30 0V20L18 2L-6 3L-22 15Z':'M-30 23L-31 3Q-26-24 8-17Q39-15 30 23L19 8L9 10L-4 1L-21 18Z'} fill={d.hair}/>}
 {!masked&&<g fill="none" stroke="#fff1d3" strokeOpacity=".22" strokeWidth="2"><path d="M-23 1Q-17-13-4-10M-15 7Q-8-8 5-10M5-7Q20-10 24 3"/></g>}
 {['gojo-satoru','l-lawliet'].includes(id)&&<path d="M-30 10L-38-5L-26-4L-23-22L-12-14L-4-27L4-16L18-25L20-12L33-15L28 4L18 0L12 12L2 1L-8 15L-15 3Z" fill={d.hair}/>}
 {id==='bruce-wayne'&&<path d="M-29 9V-28L-11-8H13L29-28V9" fill={d.suit}/ >}
 {id==='bruce-wayne'&&<path d="M-19 29L-8 26L0 32L8 26L19 29L16 42L8 49H-9L-19 41Z" fill={d.skin}/>}
 {id==='miles-morales'&&<g fill="none" stroke="#a94a5d" strokeWidth=".75"><path d="M0-8V48M-25 5L25 37M25 5L-25 37M-28 11Q0-1 28 11M-29 28Q0 38 29 28M-16-7L-12 46M16-7L12 46"/></g>}
 {id==='gwen-stacy'&&<path d="M-33 42Q-51-15 0-24Q51-15 33 42L25 18Q20-12 0-8Q-23-10-27 22Z" fill="#eee9e5" stroke="#d591b6" strokeWidth="5"/>}
 {id==='tony-stark'&&<path d="M-22 0H22L17 32L10 41H-10L-18 32Z" fill="#d5ad63"/>}
 {['miles-morales','gwen-stacy'].includes(id)?<g fill="#e6ede5" stroke={id==='miles-morales'?'#b34c62':'#cb6e9b'} strokeWidth="2.5"><path d="M-24 12L-5 23L-10 32L-20 29Z"/><path d="M24 12L5 23L10 32L20 29Z"/></g>:!masked&&id!=='gojo-satoru'?<g><path d="M-22 14L-10 13M10 13L22 14" fill="none" stroke={d.hair} strokeWidth="2"/><path d="M-21 20Q-15 16-8 21M8 21Q15 16 22 20" fill="none" stroke="#3c3440" strokeWidth="2"/><path d="M-15 19V24M15 19V24" stroke="#303644" strokeWidth="3"/></g>:id==='gojo-satoru'?<path d="M-29 12H29V29H-29Z" fill="#1c2032"/>:<path d="M-20 19L-7 22M8 22L21 19" stroke={id==='gwen-stacy'?'#28334c':masked?'#e6f6e8':'#28343c'} strokeWidth={masked?6:4}/>}
 {id==='naruto-uzumaki'&&<g><path d="M-28 7H28" stroke="#526572" strokeWidth="9"/><path d="M-13 2H13V12H-13Z" fill="#b1b8ad" strokeWidth="1"/><path d="M-4 9Q5 14 6 7Q5 2 0 4Q-4 5-1 8L-7 8L-3 3" fill="none" stroke="#4a555c" strokeWidth="1"/></g>}
 {id==='late-night-study-boy'&&<g><path d="M-34 23V6Q0-40 34 6V23" fill="none" stroke="#9cacae" strokeWidth="5"/><path d="M-34 14V33M34 14V33" stroke="#243847" strokeWidth="10"/></g>}
 {!masked&&<g fill="none" strokeWidth="1.5"><path d="M2 23L0 30L4 31" stroke="#a77765"/><path d="M-23 29L-15 31M14 31L22 28" stroke="#b27e70" opacity=".65"/>{id==='naruto-uzumaki'&&<path d="M-26 29L-16 31M-25 34L-16 35M16 31L26 29M16 35L25 34" stroke="#805e4d"/>}{id==='l-lawliet'&&<path d="M-21 25L-9 28M9 28L22 25" stroke="#796d79"/>}{id==='neo'&&<path d="M-24 17H-6V27H-23ZM6 17H24L23 27H6ZM-6 20H6" fill="#131d22" stroke="#74837d"/>}</g>}
 {!['miles-morales','gwen-stacy'].includes(id)&&<path d="M-5 36H7" stroke={masked?'#627887':'#986e65'} strokeWidth="2"/>}
 </g>
 {id==='tony-stark'&&<circle cy="88" r="12" fill="#acf8ef" stroke="#5da7b4" strokeWidth="4"/>}
 {id==='bruce-wayne'&&<g><ellipse cy="91" rx="25" ry="12" fill="#b5a06c"/><path d="M-23 83L-15 90L-9 87L-5 91L-3 83L0 87L3 83L5 91L9 87L15 90L23 83L19 95L12 94L7 98L0 103L-7 98L-12 94L-19 95Z" fill="#202c39" stroke="none"/></g>}
 {['miles-morales','gwen-stacy'].includes(id)&&<path d="M0 78V108M-15 81L15 102M15 81L-15 102M-17 93H17" stroke={id==='miles-morales'?'#d24b69':'#32374f'} strokeWidth="4"/>}
 {id==='wednesday-addams'&&<g fill="#1b212b"><path d="M-27 24L-37 82L-28 98L-20 82L-23 24ZM27 24L37 82L28 98L20 82L23 24Z"/></g>}{id==='wednesday-addams'&&<path d="M-22 59L-8 78L0 61L8 78L22 59" fill="#e1d9cc"/>}
 {id==='hermione-granger'&&<path d="M-22 56Q0 75 23 56L21 72H4V123H-8V71L-21 70Z" fill="#ad6460"/>}
 <SanctuaryCostumeDetails id={id}/>
 </>:<>{arm(false)}{arm(true)}</>}
 </g>;
}
