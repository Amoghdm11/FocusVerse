import React, { useEffect, useState } from 'react';
import { Headphones, NotebookPen, ListTodo, Sparkles, Radio, RotateCw, Wrench, ScanLine } from 'lucide-react';
import { UserFocusAction } from './AudioCodeFooter';
import './SpiderStudyRoom.css';
import './StarkWorkshop.css';

type Activity = 'reactor' | 'diagnostics';
// Same room-space scale as Peter: head y=270, desktop y=455, planted feet y=577.
// Body is behind the bench; articulated arms and tools are above its surface.
function StarkActor({ layer, activity, frame }: { layer: 'body' | 'hands'; activity: Activity; frame: number }) {
  const step = [0, .35, 0, -.35][frame % 4];
  return <g transform="translate(480 262) scale(3)" stroke="#242333" strokeWidth="1" strokeLinejoin="miter" data-stark-layer={layer}>
    {layer === 'body' ? <>
      <path d="M24 63H35V72L13 80L19 96L12 99L4 79V74Z" fill="#72343b"/>
      <path d="M12 91L19 91L22 100L25 102V105H8L5 103L9 100Z" fill="#a64a43"/>
      <path d="M17 62H29V71L5 78L2 94H-6L-7 76L-4 72Z" fill="#b65349"/>
      <path d="M16 69L0 77L-2 90" fill="none" stroke="#d4965f" strokeWidth="3"/>
      <path d="M-6 90H3L2 100L-1 104H-17V101L-9 98Z" fill="#ac4941"/>
      <path d="M-5 94H1M-10 100H1M12 95H19M10 102H22" stroke="#e2a169" fill="none"/>
      <path d="M18 27H28L38 33L36 51V64L29 68H17L12 61V48L10 34Z" fill="#ab4d47"/>
      <path d="M12 39L18 43L17 55L13 59ZM32 39L37 38L35 58L30 61L29 51Z" fill="#c69d5b"/>
      <path d="M15 34L21 37L19 43L15 41ZM28 36L33 33L35 40L29 43Z" fill="#cd7561" strokeWidth=".6"/>
      <path d="M20 48H28L30 52H18ZM18 55H31L29 58H19Z" fill="#793a40" strokeWidth=".6"/>
      <path d="M15 32L22 35H28L34 31M19 53H29L31 57H18L16 61H30" fill="none" stroke="#e2926b"/>
      <path d="M18 59H29M19 64H27" stroke="#5d3039" strokeWidth="2"/>
      <circle cx="24" cy="42" r="5" fill="#294c5a"/><circle cx="24" cy="42" r="3.5" fill="#a1e0dc" stroke="#689a9d"/><circle cx="24" cy="42" r="2" fill="#e1efe0" stroke="none"/>
      <path d="M19 24H28V30L24 32L19 29Z" fill="#65323a"/>
      <path d="M13 6L18 2H28L33 7V21L28 28H19L13 22Z" fill="#a84942"/>
      <path d="M15 6L19 3H27L31 7L30 20L27 25H20L15 20Z" fill="#80383e" stroke="none"/>
      <path d="M16 7L21 8H26L30 6L29 18L27 23H19L16 18Z" fill="#d0ab65"/>
      <path d="M16 7L19 9V17L21 20L20 23H19L16 18Z" fill="#957349" stroke="none"/>
      <path d="M27 9L29 8L28 16L26 18L27 21L25 23H27L29 18Z" fill="#b18a50" stroke="none"/>
      <path d="M14 10V19L17 23M31 9V20L28 25M19 5H27" fill="none" stroke="#df8c68" strokeWidth=".6"/>
      <path d="M17 8L20 10H27L29 8M18 19L20 22H26L28 19" fill="none" stroke="#edc58b"/>
      <path d="M16 13L22 14M25 14L30 12" stroke="#d4f3e6" strokeWidth="1.7"/>
      <path d="M21 21H26M23 15L22 18H25" fill="none" stroke="#765848"/>
    </> : [false, true].map(near => {
      const wrist = near ? [activity === 'reactor' ? 9 + step : 13 + step, 65 + step] : [-3, 64];
      const shoulder = near ? [34, 34] : [13, 34];
      const elbow = near ? [38, 54] : [7, 53];
      return <g key={String(near)} data-stark-hand={near ? 'near' : 'far'}>
        <path d={`M${shoulder}L${elbow}L${wrist}`} fill="none" stroke="#242333" strokeWidth="10"/>
        <path d={`M${shoulder}L${elbow}`} fill="none" stroke={near ? '#c49a5d' : '#976746'} strokeWidth="7"/>
        <path d={`M${elbow}L${wrist}`} fill="none" stroke={near ? '#b9574b' : '#853d40'} strokeWidth="8"/>
        <g transform={`translate(${elbow}) rotate(${Math.atan2(wrist[1]-elbow[1], wrist[0]-elbow[0])*180/Math.PI})`} fill="none" strokeWidth=".65">
          <path d="M5-3V3M10-3V3M15-3V3M1-2H19" stroke="#71353b"/>
          <path d="M5-2H9M11-2H15" stroke="#e3a170"/>
        </g>
        <path d={`M${elbow[0]} ${elbow[1]-2}L${wrist[0]} ${wrist[1]-2}`} stroke="#e19369" fill="none"/>
        <path d={`M${shoulder[0]-4} ${shoulder[1]-4}h8l2 5h-10Z`} fill="#b45348"/>
        <g transform={`translate(${wrist})`}><path d="M-4-3H3L5 0V3H1L-4 2Z" fill="#b9584c"/><path d="M-3 0H3M-2-2V2M1-2V2" stroke="#e8ac72" strokeWidth=".5"/>
          {near && (activity === 'reactor' ? <><path d="M0-7V5" stroke="#c8d1c8"/><path d="M0-7V-2" stroke="#d5aa65" strokeWidth="2"/></> : <path d="M0-5L3 6" stroke="#bce5df"/>)}
        </g>
      </g>;
    })}
  </g>;
}

export function StarkWorkshop({ action, onMusic, onNotes, onTasks, onCompanionClick }: {
  action: UserFocusAction; onMusic: () => void; onNotes: () => void; onTasks: () => void; onCompanionClick: () => void;
}) {
  const [manual, setManual] = useState<Activity | null>(null);
  const [tick, setTick] = useState(0);
  const [lamp, setLamp] = useState(true);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const resting = action === 'BREAK' || action === 'COMPLETED';
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const visibility = () => setHidden(document.hidden);
    const motion = () => setReduced(media.matches);
    document.addEventListener('visibilitychange', visibility); media.addEventListener('change', motion);
    return () => { document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motion); };
  }, []);
  useEffect(() => {
    if (resting || hidden || reduced) return;
    const timer = setInterval(() => setTick(t => t + 1), 240);
    return () => clearInterval(timer);
  }, [resting, hidden, reduced]);
  const activity = manual ?? (Math.floor(tick / 116) % 2 ? 'diagnostics' : 'reactor');
  const frame = resting || reduced ? 0 : tick;
  return <section className={`spider-study-room stark-workshop ${lamp ? 'lamp-on' : ''} ${hidden || resting ? 'room-hidden' : ''}`} data-sanctuary="tony-stark" data-activity={activity} aria-label="Tony Stark’s after-hours workshop">
    <header className="queens-heading"><div><div className="queens-caption"><span><i/> MALIBU, CALIFORNIA</span><span>STARK INDUSTRIES</span></div><h2>TONY’S WORKSHOP</h2><p>Music, notes, and tasks. Select an object to open it.</p></div><span className="queens-live"><Radio size={13}/>{action === 'FOCUSING' ? 'FOCUSING' : resting ? 'BREAK' : 'READY'}</span></header>
    <div className="queens-stage">
      <div className="room-scene-label"><span className="room-scene-dot"/> ARC REACTOR LAB <span> / </span> {resting ? 'TAKING A BREATHER' : activity === 'reactor' ? 'CALIBRATING' : 'DIAGNOSTICS'}</div>
      <svg viewBox="0 0 1000 660" role="img" aria-label="Illustrated ocean-side workshop with a seated Iron Man calibrating a reactor behind a workbench, armor alcove, shelves, and warm task lighting">
        <defs>
          <linearGradient id="st-wall" x2="1" y2="1"><stop stopColor="#192137"/><stop offset=".55" stopColor="#34303a"/><stop offset="1" stopColor="#674432"/></linearGradient>
          <linearGradient id="st-bench" x2="0" y2="1"><stop stopColor="#a18465"/><stop offset="1" stopColor="#635247"/></linearGradient>
          <radialGradient id="st-warm"><stop stopColor="#ffc46c" stopOpacity=".32"/><stop offset="1" stopColor="#ffc46c" stopOpacity="0"/></radialGradient>
          <clipPath id="st-window"><path d="M73 80H590V352H73Z"/></clipPath>
        </defs>
        <path d="M0 0H1000V660H0Z" fill="url(#st-wall)"/>
        <path d="M0 526H1000V660H0Z" fill="#29272f"/>
        <path d="M0 559H1000M0 606H1000M150 526L90 660M350 526L330 660M670 526L700 660M880 526L950 660" stroke="#70605b" strokeWidth="2" opacity=".4"/>
        <path d="M0 20H1000M24 0V526M645 0V526M980 0V526" stroke="#191e2b" strokeWidth="18"/>
        <path d="M32 202H60M604 202H641M32 392H641M654 403H975" fill="none" stroke="#95745e" strokeWidth="2" opacity=".2"/>
        <path d="M32 28H970M34 29V520M652 29V520" stroke="#786154" strokeWidth="2" opacity=".5"/>
        <path d="M60 66H603V365H60Z" fill="#171e2d" stroke="#947663" strokeWidth="6"/>
        <g clipPath="url(#st-window)">
          <image href={`${import.meta.env.BASE_URL}assets/room/malibu-night.jpg`} x="73" y="80" width="517" height="272" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <path d="M248 80V352M422 80V352M73 237H590" stroke="#292b38" strokeWidth="8"/><path d="M253 80V352M427 80V352" stroke="#9a7c68" strokeWidth="2"/>
        <path d="M50 364H618V378H50Z" fill="#8e725b"/>
        {/* Recessed armor service bay, drawn with the same planes and outlines as the room. */}
        <path d="M678 65H822V378H678Z" fill="#151e2b" stroke="#6f5d55" strokeWidth="5"/>
        <path d="M689 77H810V364H689Z" fill="#292a33"/><path d="M690 80H808M690 80V346M808 80V346" stroke="#d6a36c" strokeWidth="3"/>
        <path d="M716 354L702 370H800L784 354Z" fill="#746354"/>
        <g stroke="#242333" strokeWidth="3"><path d="M731 190H768L782 213L774 267H725L716 215Z" fill="#713d3e"/><path d="M729 269H746L742 338H721ZM752 269H771L781 338H758Z" fill="#925148"/><path d="M731 277H741L737 313H728ZM757 277H767L775 313H764Z" fill="#b19260"/><path d="M726 316H739V326H724ZM762 316H776V326H764Z" fill="#b56b50"/><path d="M721 337H742V351H713V346ZM758 338H780L787 347V351H758Z" fill="#b16f50"/><path d="M715 207L703 249L711 280L722 277L718 248L731 213M770 208L789 246L785 279L773 278L776 250L761 214" fill="#a68557"/><path d="M734 151H763L769 164V186L759 196H741L732 183V164Z" fill="#8c4942"/><path d="M739 161H762L759 181L752 187L741 181Z" fill="#bb9a62"/><path d="M737 170L747 172M754 172L764 169" stroke="#bddad0" strokeWidth="2"/><path d="M726 211L741 219M759 219L775 211M731 246H768M735 255H764" stroke="#bd8d61" strokeWidth="2" fill="none"/><circle cx="750" cy="228" r="8" fill="#8aaca7"/></g>
        <path d="M850 96H947V234H850Z" fill="#745440" stroke="#362c32" strokeWidth="5"/>
        <path d="M861 111L895 115L892 155L859 150ZM901 159L935 155L938 212L903 215Z" fill="#d4bb88"/>
        <path d="M868 125H887M866 135H885M909 173H928M910 184H930M910 195H928" stroke="#816950" strokeWidth="2"/>
        <path d="M835 294H958V305H835Z" fill="#997351"/>
        {[0,1,2,3].map(i => <g key={i}><path d={`M${846+i*18} ${252+i%2*8}h14v${41-i%2*8}h-14Z`} fill={['#a75750','#c7a379','#526f70','#785b69'][i]}/><path d={`M${849+i*18} 281h8`} stroke="#d5b88b" strokeWidth="2"/></g>)}
        <path d="M927 273V248L941 237M927 273L915 281H945" stroke="#adac98" strokeWidth="5" fill="none"/><circle cx="941" cy="237" r="5" fill="#d0ad71"/>
        <path d="M42 413H207V524H42Z" fill="#42434a" stroke="#232532" strokeWidth="4"/><path d="M49 439H199M49 469H199M49 499H199M106 426H140M106 455H140M106 485H140" stroke="#8c7b67" strokeWidth="3"/>
        <path d="M66 412V397H103V412M144 414L139 387L163 377L181 399L171 414" fill="#ab7c55" stroke="#3b3031" strokeWidth="3"/>
        <path d="M225 578H780L854 627H182Z" fill="#3e4148"/><path d="M245 586H766L802 614H221Z" fill="none" stroke="#89715d" strokeWidth="3"/>
        <ellipse cx="561" cy="573" rx="200" ry="32" fill="#0c1422" opacity=".4"/>
        <path d="M535 364Q565 347 595 364L604 479H537Z" fill="#464955" stroke="#232334" strokeWidth="8"/><path d="M490 474H604V492H490Z" fill="#75645c"/><path d="M507 492L498 574M590 492L607 574" stroke="#222533" strokeWidth="10"/>
        <StarkActor layer="body" activity={activity} frame={frame}/>
        <path d="M256 444H810L838 506H228Z" fill="url(#st-bench)" stroke="#302d32" strokeWidth="4"/><path d="M229 505H837V521H229Z" fill="#41424b"/><path d="M235 506H831" stroke="#b49c7c" strokeWidth="3"/>
        <path d="M253 520L246 612M806 520L815 612" stroke="#292b36" strokeWidth="18"/><path d="M259 522L253 605M799 522L806 605" stroke="#847568" strokeWidth="4"/>
        <path d="M697 522H792V582H697Z" fill="#4d4850" stroke="#282936" strokeWidth="4"/><path d="M700 549H790M733 535H755M733 562H755" stroke="#ad9271" strokeWidth="3"/>
        <path d="M371 412L369 453L350 461H399L386 451V412Z" fill="#61767b" stroke="#243442" strokeWidth="3"/>
        <path d="M303 337L427 326L442 420L319 432Z" fill="#263445" stroke="#101e2d" strokeWidth="6"/><path d="M313 346L419 337L432 412L328 422Z" fill="#173c4b"/>
        <g fill="none" stroke="#8fc7c4" strokeWidth="2"><ellipse cx="373" cy="378" rx="23" ry="25"/><ellipse cx="373" cy="378" rx="15" ry="17"/><path d="M373 349V360M373 396V407M344 380H356M391 376H410M327 354L344 353M403 403L420 401"/></g>
        {activity === 'diagnostics' && <path d="M330 398L343 385L352 393L365 367L376 389L391 373L407 381" fill="none" stroke="#e7b87b" strokeWidth="2"/>}
        <path d="M463 449H548L563 482H463Z" fill="#29434b" stroke="#8aa59d" strokeWidth="2"/>
        <ellipse cx="513" cy="464" rx="20" ry="12" fill="#a5a494" stroke="#344553" strokeWidth="3"/><ellipse cx="513" cy="462" rx="12" ry="7" fill="#99d9d3"/><path d="M505 462H521M513 456V469" stroke="#e2ecda" strokeWidth="2"/>
        <path d="M565 451L598 454L620 479L583 480Z" fill="#d3bd92"/><path d="M576 458L598 461M581 465L604 468" stroke="#84745b" strokeWidth="2"/>
        <StarkActor layer="hands" activity={activity} frame={frame}/>
        <path d="M647 475V371L705 330" fill="none" stroke="#172835" strokeWidth="12"/><path d="M647 475V371L705 330" fill="none" stroke="#81918a" strokeWidth="5"/><path d="M684 322L716 317L740 344L676 355Z" fill="#be7147" stroke="#402f31" strokeWidth="4"/><path d="M679 354L737 344" stroke="#ffe1a1" strokeWidth="5"/><ellipse cx="648" cy="480" rx="30" ry="7" fill="#3d494b"/>
        <ellipse className="desk-light" cx="638" cy="438" rx="250" ry="190" fill="url(#st-warm)"/>
        <path d="M620 449H638V472H620ZM638 454H648V464H638" fill="#b77e59" stroke="#523e34" strokeWidth="3"/>
        <path d="M748 455L783 452L788 465L752 469Z" fill="#68817b"/><path d="M746 445L778 442L783 452L748 456Z" fill="#aa6654"/>
        {/* Foreground tool trolley gives the bench a second depth plane. */}
        <path d="M867 478H960V491H867ZM876 491V596M950 491V596M876 565H951" stroke="#242b36" strokeWidth="7" fill="#7e6855"/>
        <path d="M884 477V451H911V477M922 476L925 446H936L939 476" fill="#ae8057" stroke="#3c3438" strokeWidth="3"/><circle cx="880" cy="600" r="9" fill="#171e2d"/><circle cx="947" cy="600" r="9" fill="#171e2d"/>
        <g className="queens-dust" fill="#f5c58a" opacity=".4">{[0,1,2,3,4,5].map(i => <circle key={i} cx={440+i*39} cy={180+(i*47)%220} r="1.3"/>)}</g>
      </svg>
      <button className="room-object object-computer" aria-label="Open workshop console music player" onClick={onMusic}><span>Lab console · Music</span></button>
      <button className="room-object stark-notebook" aria-label="Open engineering notebook" onClick={onNotes}><span>Engineering notes</span></button>
      <button className="room-object object-board" aria-label="Open workshop task board" onClick={onTasks}><span>Build queue · Tasks</span></button>
      <button className="room-object object-lamp" aria-label="Toggle desk lamp" aria-pressed={lamp} onClick={() => setLamp(v => !v)}><span>Desk light</span></button>
      <button className="room-object stark-companion" aria-label="Encourage Tony Stark" onClick={onCompanionClick}><span>Tony Stark</span></button>
    </div>
    <div className="room-activity-bar"><span className="room-activity-label"><Sparkles size={13}/> COMPANION ACTIVITY</span><div className="room-activity-options" role="group" aria-label="Companion activity"><button aria-pressed={manual === null} onClick={() => setManual(null)}><RotateCw size={13}/>Auto</button><button aria-pressed={manual === 'reactor'} disabled={resting} onClick={() => setManual('reactor')}><Wrench size={13}/>Calibrate</button><button aria-pressed={manual === 'diagnostics'} disabled={resting} onClick={() => setManual('diagnostics')}><ScanLine size={13}/>Diagnostics</button></div></div>
    <div className="queens-footer"><div><span className="queens-kicker">TONY // ACTIVITY</span><p aria-live="polite">{resting ? 'Taking a break.' : activity === 'reactor' ? 'Calibrating the arc reactor.' : 'Checking reactor diagnostics.'}</p></div><div className="room-shortcuts"><button onClick={onMusic}><Headphones size={14}/>Music</button><button onClick={onNotes}><NotebookPen size={14}/>Notes</button><button onClick={onTasks}><ListTodo size={14}/>Tasks</button></div></div>
  </section>;
}
