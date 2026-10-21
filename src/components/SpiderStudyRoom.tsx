import React, { useEffect, useRef, useState } from 'react';
import { Headphones, NotebookPen, ListTodo, Sparkles, Radio, PencilRuler, Wrench, Keyboard, RotateCw } from 'lucide-react';
import { SeatedSpiderMan, StudyPose } from './SeatedSpiderMan';
import { UserFocusAction } from './AudioCodeFooter';
import './SpiderStudyRoom.css';

const workingPoses: StudyPose[] = ['repairing', 'designing', 'typing', 'reading', 'writing', 'thinking'];
const activities = [
  { pose: 'repairing', label: 'Tinker', icon: Wrench },
  { pose: 'designing', label: 'Sketch', icon: PencilRuler },
  { pose: 'typing', label: 'Code', icon: Keyboard },
  { pose: 'writing', label: 'Write', icon: NotebookPen },
  { pose: 'reading', label: 'Read', icon: NotebookPen },
  { pose: 'thinking', label: 'Think', icon: Sparkles },
] as const;
export function SpiderStudyRoom({ action, completion, onMusic, onNotes, onTasks }: {
  action: UserFocusAction; completion: number; onMusic: () => void; onNotes: () => void; onTasks: () => void;
}) {
  const lastCompletion = useRef(completion);
  const wasCompleted = useRef(false);
  const celebrationTimer = useRef(0);
  const [activity, setActivity] = useState(0);
  const [manualPose, setManualPose] = useState<StudyPose | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [lamp, setLamp] = useState(true);
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (action === 'BREAK' || action === 'COMPLETED' || hidden || manualPose) return;
    const id = window.setInterval(() => setActivity(a => (a + 1) % workingPoses.length), 28000);
    return () => clearInterval(id);
  }, [action, hidden, manualPose]);
  useEffect(() => {
    const sessionEnded = action === 'COMPLETED';
    if (completion !== lastCompletion.current || (sessionEnded && !wasCompleted.current)) {
      clearTimeout(celebrationTimer.current);
      setCelebrating(true);
      celebrationTimer.current = window.setTimeout(() => setCelebrating(false), 2200);
    }
    lastCompletion.current = completion;
    wasCompleted.current = sessionEnded;
  }, [completion, action]);
  useEffect(() => () => clearTimeout(celebrationTimer.current), []);
  const pose: StudyPose = celebrating ? 'complete' : action === 'BREAK' || action === 'COMPLETED' ? 'idle' : manualPose ?? workingPoses[activity];
  return <section className={`spider-study-room workshop-${pose} ${lamp ? 'lamp-on' : ''} ${hidden ? 'room-hidden' : ''}`} aria-label="Spider-Man’s after-hours study room">
    <header className="queens-heading">
      <div><div className="queens-caption"><span><i/> QUEENS, NEW YORK</span><span>EARTH-616</span></div>
      <h2>PETER’S STUDY</h2>
      <p>Music, notes, and tasks. Select an object to open it.</p></div>
      <span className="queens-live"><Radio size={13}/>{action === 'FOCUSING' ? 'FOCUSING' : action === 'BREAK' ? 'BREAK' : action === 'COMPLETED' ? 'COMPLETE' : 'READY'}</span>
    </header>
    <div className="queens-stage">
      <div className="room-scene-label"><span className="room-scene-dot"/> PETER’S WORKBENCH <span> / </span> {pose === 'complete' ? 'NICE WORK!' : pose === 'idle' ? 'TAKING A BREATHER' : pose.toUpperCase()}</div>
      <svg viewBox="0 0 1000 660" aria-label="A warm attic study, a nighttime skyline, and pixel-art Spider-Man repairing web shooters and designing a suit at his workbench" role="img">
        <defs>
          <linearGradient id="qr-wall" x2="1" y2="1"><stop stopColor="#192137"/><stop offset=".55" stopColor="#3b2b34"/><stop offset="1" stopColor="#684032"/></linearGradient>
          <linearGradient id="qr-sky" x2="0" y2="1"><stop stopColor="#142840"/><stop offset="1" stopColor="#75505b"/></linearGradient>
          <linearGradient id="qr-desk" x2="0" y2="1"><stop stopColor="#b98051"/><stop offset="1" stopColor="#67412f"/></linearGradient>
          <radialGradient id="qr-glow"><stop stopColor="#ffc46c" stopOpacity=".32"/><stop offset="1" stopColor="#ffc46c" stopOpacity="0"/></radialGradient>
          <pattern id="qr-brick" width="100" height="52" patternUnits="userSpaceOnUse"><path d="M0 51H100M50 0V51" stroke="#d09872" opacity=".08" strokeWidth="2"/></pattern>
          <pattern id="qr-windows" width="29" height="34" patternUnits="userSpaceOnUse"><rect x="7" y="9" width="7" height="11" fill="#e8b77b" opacity=".55"/></pattern>
          <clipPath id="qr-window"><rect x="90" y="63" width="510" height="291"/></clipPath>
        </defs>
        <rect width="1000" height="660" fill="url(#qr-wall)"/><rect width="1000" height="540" fill="url(#qr-brick)"/>
        <path d="M0 0L1000 0L1000 29L0 19Z" fill="#171d2c"/><path d="M0 526H1000V660H0Z" fill="#29252b"/>
        <path d="M0 559H1000M0 606H1000M150 526L90 660M350 526L330 660M670 526L700 660M880 526L950 660" stroke="#705049" strokeWidth="2" opacity=".4"/>
        <path d="M250 576L760 576L842 628H188Z" fill="#674347"/><path d="M269 585H742L787 616H231Z" fill="none" stroke="#ae7964" strokeWidth="3"/>
        <rect x="77" y="50" width="536" height="319" rx="4" fill="#161d2c" stroke="#92705b" strokeWidth="6"/>
        <g clipPath="url(#qr-window)"><rect x="90" y="63" width="510" height="291" fill="url(#qr-sky)"/>
          <circle cx="506" cy="110" r="21" fill="#e0d9b5"/>
          {Array.from({length:10},(_,i)=><g key={i}><rect x={88+i*53} y={199+(i*23)%70} width="49" height="170" fill={i%2 ? '#1f2941' : '#293146'}/><rect x={88+i*53} y={199+(i*23)%70} width="49" height="170" fill="url(#qr-windows)"/></g>)}
          <image href={`${import.meta.env.BASE_URL}assets/room/queens-night.jpg`} x="90" y="63" width="510" height="291" preserveAspectRatio="xMidYMid slice"/>
          <g className="queens-rain" stroke="#b1c8d0" strokeWidth="1" opacity=".14">{Array.from({length:30},(_,i)=><path key={i} d={`M${100+i*17} ${55+(i*41)%280}l-7 22`}/>)}</g>
        </g>
        <path d="M259 62V356M431 62V356M87 234H604" stroke="#2c2934" strokeWidth="9"/><path d="M264 64V353M436 64V353" stroke="#9c7764" strokeWidth="2"/>
        <path d="M65 363H626V377H65Z" fill="#94664d"/>
        <path d="M49 44H111L97 311L72 353H47Z M580 44H644V353H622L600 311Z" fill="#593c4b"/><path d="M62 53L61 320M85 54L75 315M606 53L621 320M628 52L634 328" stroke="#8b5260" strokeWidth="5"/>
        <path d="M70 36Q300 85 620 35Q785 89 947 53" fill="none" stroke="#1d1c28" strokeWidth="3"/>
        {[90,150,214,280,350,420,490,560,632,702,775,848,921].map((x,i)=><g key={x}><circle cx={x} cy={43+Math.sin(i/3)*18} r="9" fill="#ffb96d" opacity=".08"/><circle cx={x} cy={43+Math.sin(i/3)*18} r="3" fill="#edb274"/></g>)}
        <rect x="701" y="96" width="111" height="141" fill="#1e2634" stroke="#aa7758" strokeWidth="5"/><path d="M717 194L752 122L795 194Z" fill="#b8544b"/><circle cx="755" cy="163" r="19" fill="#25394d"/><path d="M739 157L751 163L745 170M771 157L759 163L765 170" stroke="#f3d7b0" strokeWidth="4"/><text x="756" y="218" textAnchor="middle" fontSize="10" fill="#dfbe93" letterSpacing="3">STAY AMAZING</text>
        <rect x="840" y="107" width="105" height="126" fill="#7c5442" stroke="#3d2c30" strokeWidth="6"/>
        <g transform="rotate(5 867 144)"><rect x="853" y="123" width="32" height="38" fill="#dbb575"/><path d="M859 136H878M859 144H874" stroke="#8c674c" strokeWidth="2"/></g><g transform="rotate(-6 912 184)"><rect x="892" y="165" width="37" height="40" fill="#9ca895"/><path d="M898 176H922M898 184H919M898 193H914" stroke="#526e68" strokeWidth="2"/></g>
        <path d="M678 289H955V300H678Z" fill="#9b6c4f"/>
        {[0,1,2,3,4,5].map(i=><g key={i}><rect x={697+i*18} y={244+(i%3)*8} width="15" height={44-(i%3)*8} fill={['#a75750','#c7a379','#526f70'][i%3]}/><path d={`M${700+i*18} 277h9`} stroke="#d1b890" strokeWidth="2"/></g>)}
        <path d="M865 263H909L902 289H872Z" fill="#b36b4b"/><path d="M887 264V218M887 246Q860 247 861 228Q883 224 887 246M887 236Q916 239 916 217Q892 215 887 236" fill="#617f68" stroke="#3f5c55" strokeWidth="3"/>
        <path d="M911 1V63M865 1L950 75M999 3L929 67M871 13Q916 58 986 24M886 0Q916 38 965 0" fill="none" stroke="#b4a6a2" strokeWidth="1.5" opacity=".22"/>
        <ellipse cx="561" cy="573" rx="200" ry="32" fill="#0c1422" opacity=".4"/>
        <path d="M535 364Q565 347 595 364L604 479L537 479Z" fill="#5c3b39" stroke="#232334" strokeWidth="8"/><path d="M490 474L604 474L604 492L490 492Z" fill="#795044"/><path d="M507 492L498 574M590 492L607 574" stroke="#222533" strokeWidth="10"/>
        {/* The character is behind the desk; hands are drawn at the tabletop plane. */}
        <SeatedSpiderMan pose={pose}/>
        <path d="M256 444L810 444L838 506H228Z" fill="url(#qr-desk)" stroke="#3c2d2c" strokeWidth="4"/><path d="M229 505H837V521H229Z" fill="#613d2f"/><path d="M235 506H831" stroke="#c68d5d" strokeWidth="3"/>
        <path d="M253 520L246 612M806 520L815 612" stroke="#342b2d" strokeWidth="18"/><path d="M259 522L253 605M799 522L806 605" stroke="#976548" strokeWidth="4"/>
        <path d="M697 522H792V582H697Z" fill="#65432f" stroke="#382b2c" strokeWidth="4"/><path d="M700 549H790M733 535H755M733 562H755" stroke="#b58359" strokeWidth="3"/>
        {/* Work surface sits below the fingers, with the left-facing monitor clear of the character. */}
        <g className="suit-blueprint">
          <path d="M474 449L564 449L587 483L474 483Z" fill="#234454" stroke="#9ab9b8" strokeWidth="2"/>
          <path d="M482 458H565M482 469H575M494 452L498 480M512 452L517 480M533 452L539 480M552 452L559 480" stroke="#59808a" strokeWidth=".6"/>
          <path d="M523 454L514 458L506 469L513 472L521 463L520 475L540 475L536 463L545 472L551 469L541 457L533 454L530 458Z" fill="#983d4c" stroke="#d6bc9e" strokeWidth="1"/>
          <path className="blueprint-mark" d="M551 458h10m-7 5h11m-15 13h17" stroke="#c5e7dc" strokeWidth="1.5"/>
        </g>
        <g className="repair-kit">
          <path d="M466 448H525L535 474H467Z" fill="#263c43" stroke="#728b83" strokeWidth="2"/>
          <path d="M480 450L485 445H502L510 454L505 464H488Z" fill="#9baabb" stroke="#263044" strokeWidth="2"/>
          <path d="M488 448H499V460H488Z" fill="#344960"/><path d="M490 450H497V455H490Z" fill="#93d7da"/>
          <path d="M516 454v10m-3-7h6" stroke="#dfbd82" strokeWidth="2"/>
          <circle cx="476" cy="466" r="2" fill="#b2bac2"/><circle cx="519" cy="468" r="2" fill="#b2bac2"/>
        </g>
        <g className="workshop-keyboard" transform="translate(35 -8)"><path d="M406 455L455 451L476 474L414 481Z" fill="#394653" stroke="#182737" strokeWidth="3"/>{[0,1,2].map(i=><path key={i} d={`M${414+i*3} ${459+i*6}l38 -3`} stroke="#9aafa8" strokeWidth="3" strokeDasharray="4 3"/>)}</g>
        <g className="workshop-monitor">
          <ellipse cx="380" cy="464" rx="41" ry="6" fill="#302d31" opacity=".5"/>
          <path d="M371 412L369 453L350 461L399 461L386 451L386 412Z" fill="#61767b" stroke="#243442" strokeWidth="3"/>
          <path d="M303 337L427 326L442 420L319 432Z" fill="#263445" stroke="#101e2d" strokeWidth="6"/>
          <path d="M313 346L419 337L432 412L328 422Z" fill="#173c4b"/>
          <g stroke="#44707d" strokeWidth=".6"><path d="M320 361L421 352M324 378L424 369M327 396L428 386M338 344L349 418M361 342L372 416M386 340L397 414M409 338L420 412"/></g>
          <g className="monitor-suit" stroke="#9cd7d7" strokeWidth="1.5" fill="#30596c"><path d="M365 355L353 365L342 388L351 391L364 374L365 392L361 407L373 406L378 393L386 405L398 404L389 389L383 372L399 384L404 377L385 360L377 354L374 361Z"/><path d="M368 369l13 13m-1-14-11 15" stroke="#dd9184"/></g>
          <g className="monitor-shooter" fill="none" stroke="#9cd7d7" strokeWidth="2"><path d="M355 367L381 358L400 374L390 399L366 404L351 386Z"/><path d="M367 370L382 366L391 378L385 391L371 394Z"/><path d="M333 362h15m48 37h23M342 405l12-9" strokeWidth="1"/></g>
          <path className="monitor-scan" d="M322 361L421 352" stroke="#b9f6e1" opacity=".45"/>
          <circle cx="433" cy="419" r="2" fill="#a2e4cf"/>
        </g>
        {(pose === 'reading' || pose === 'writing') && <g aria-label="Open study book"><path d="M473 446L512 451L551 446V475L512 481L473 475Z" fill="#ead7aa" stroke="#80644d" strokeWidth="2"/><path d="M512 452V479M480 455L504 459M480 463L504 467M520 459L543 455M520 467L543 463" stroke="#967d60" fill="none"/></g>}
        <SeatedSpiderMan pose={pose} layer="hands"/>
        <ellipse cx="629" cy="476" rx="18" ry="4" fill="#30252a" opacity=".4"/>
        <path d="M647 475V371L705 330" fill="none" stroke="#172835" strokeWidth="12"/><path d="M647 475V371L705 330" fill="none" stroke="#81918a" strokeWidth="5"/><path d="M684 322L716 317L740 344L676 355Z" fill="#be7147" stroke="#402f31" strokeWidth="4"/><path d="M679 354L737 344" stroke="#ffe1a1" strokeWidth="5"/><ellipse cx="648" cy="480" rx="30" ry="7" fill="#3d494b"/>
        <ellipse className="desk-light" cx="638" cy="438" rx="250" ry="190" fill="url(#qr-glow)"/>
        <path d="M618 449H640V472Q629 480 618 472Z M640 453Q654 449 651 460Q649 466 640 466" fill="#b77e59" stroke="#523e34" strokeWidth="3"/><path className="queens-steam" d="M623 441Q616 432 624 422M635 440Q628 429 637 417" stroke="#ead3aa" strokeWidth="2" opacity=".35" fill="none"/>
        <path d="M748 455L783 452L788 465L752 469Z" fill="#68817b"/><path d="M746 445L778 442L783 452L748 456Z" fill="#aa6654"/><path d="M752 448L778 446" stroke="#debe8c" strokeWidth="3"/>
        <path d="M269 457Q248 431 272 422Q296 418 302 444" fill="none" stroke="#1a2c3a" strokeWidth="7"/><path d="M265 444L271 458M299 439L304 451" stroke="#b99167" strokeWidth="9"/>
        <path d="M859 510H926L917 564H871Z" fill="#8a543f"/><path d="M890 513L894 419M893 477Q853 475 848 443Q880 438 893 477M894 457Q932 459 945 425Q910 422 894 457M892 497Q925 499 941 478Q912 470 892 497" fill="#4d7064" stroke="#294c48" strokeWidth="3"/>
        <g className="room-string-glow" fill="#ffd59c" opacity=".25">{[150,280,420,560,702,848].map((x,i)=><circle key={x} cx={x} cy={43+Math.sin((i*2+1)/3)*18} r="5"/>)}</g>
        <g className="queens-dust" fill="#f5c58a" opacity=".45">{[0,1,2,3,4,5,6].map(i=><circle key={i} cx={440+i*39} cy={180+(i*47)%220} r="1.3"/>)}</g>
      </svg>
      <button className="room-object object-computer" aria-label="Open computer music player" title="Computer · music & soundscapes" onClick={onMusic}><span>Music & soundscapes</span></button>
      <button className="room-object object-notebook" aria-label="Open notebook" title="Notebook · saved scratchpad" onClick={onNotes}><span>Notebook</span></button>
      <button className="room-object object-board" aria-label="Open task board" title="Task board · your objectives" onClick={onTasks}><span>Task board</span></button>
      <button className="room-object object-lamp" aria-label="Toggle desk lamp" aria-pressed={lamp} title="Toggle warm desk light" onClick={() => setLamp(l => !l)}><span>Desk light</span></button>
    </div>
    <div className="room-activity-bar">
      <span className="room-activity-label"><Sparkles size={13}/> COMPANION ACTIVITY</span>
      <div className="room-activity-options" role="group" aria-label="Companion activity">
        <button aria-pressed={manualPose === null} onClick={() => setManualPose(null)}><RotateCw size={13}/>Auto</button>
        {activities.map(({pose: choice, label, icon: Icon}) => <button key={choice} aria-pressed={manualPose === choice} disabled={action === 'BREAK' || action === 'COMPLETED'} onClick={() => setManualPose(choice)}><Icon size={13}/>{label}</button>)}
      </div>
    </div>
    <div className="queens-footer"><div><span className="queens-kicker">PETER // ACTIVITY</span><p aria-live="polite">{pose === 'complete' ? 'Session complete.' : pose === 'repairing' ? 'Repairing web shooters.' : pose === 'designing' ? 'Sketching suit upgrades.' : pose === 'reading' ? 'Reading research notes.' : pose === 'thinking' ? 'Planning the next upgrade.' : pose === 'writing' ? 'Writing lab notes.' : pose === 'typing' ? 'Running suit diagnostics.' : 'Taking a break.'}</p></div><div className="room-shortcuts"><button onClick={onMusic}><Headphones size={14}/>Music</button><button onClick={onNotes}><NotebookPen size={14}/>Notes</button><button onClick={onTasks}><ListTodo size={14}/>Tasks</button></div></div>
  </section>;
}
