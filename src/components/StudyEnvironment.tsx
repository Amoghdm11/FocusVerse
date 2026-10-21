import React from 'react';
import { SpiderManGameplaySprite } from './SpiderManGameplaySprite';
import { PixelCharacterSprite } from './PixelCharacterSprite';
import { FullBodyPixelSprite } from './FullBodyPixelSprite';
import { CustomAppearanceState } from '../utils/pixelSpriteCompositor';
import { isSpiderManCostume } from '../utils/spidermanAssets';
import { Character } from '../types/character';

export function StudyEnvironment({ character, appearance, studying, onCompanionClick }: { character: Character; appearance?: CustomAppearanceState | null; studying: boolean; onCompanionClick: () => void }) {
  const spider = appearance ? isSpiderManCostume(appearance) : character.id === 'peter-parker';
  return <section className={`study-environment ${studying ? 'is-studying' : ''}`} aria-label={spider ? 'Spider-Man’s animated Queens study room' : 'Animated evening study room'}>
    <div className="scene-caption"><span className="scene-live" />{spider ? 'QUEENS, NEW YORK' : 'YOUR STUDY SANCTUARY'}<span>AFTER HOURS</span></div>
    <svg viewBox="0 0 640 560" className="study-room-art" role="img" aria-label="Pixel art bedroom with a rainy city window, books, a warm desk lamp and study desk" shapeRendering="crispEdges">
      <defs><pattern id="wall-bricks" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#252038"/><path d="M0 39H80M40 0V39" stroke="#30283e" strokeWidth="2"/></pattern><pattern id="city-windows" width="24" height="32" patternUnits="userSpaceOnUse"><rect x="7" y="8" width="6" height="10" fill="#eebc7a" opacity=".65"/></pattern></defs>
      <rect width="640" height="560" fill="url(#wall-bricks)"/>
      <rect x="72" y="55" width="370" height="300" fill="#100f24" stroke="#59455b" strokeWidth="12"/>
      <rect x="82" y="65" width="350" height="278" fill="#242d50"/>
      <rect x="351" y="88" width="26" height="26" fill="#f4d9ae"/><rect x="345" y="94" width="38" height="14" fill="#f4d9ae"/>
      {[0,1,2,3,4,5,6].map(i => <g key={i}><rect x={82+i*50} y={180+(i%3)*27} width="47" height={164-(i%3)*27} fill={i%2 ? '#151c36' : '#1b2340'}/><rect x={82+i*50} y={180+(i%3)*27} width="47" height={164-(i%3)*27} fill="url(#city-windows)"/></g>)}
      <g className="room-rain" stroke="#8fabc5" opacity=".35" strokeWidth="2">{Array.from({length:22},(_,i)=><path key={i} d={`M${92+i*15} ${80+(i*37)%220}l-5 18`}/>)}</g>
      <path d="M257 60V350M78 201H436" stroke="#675168" strokeWidth="10"/>
      <rect x="59" y="350" width="398" height="14" fill="#94706e"/>
      <path d="M52 49H94V335H78V320H65V290H52ZM420 49H463V290H451V320H438V335H420Z" fill="#694657"/>
      <path d="M65 55V290M81 55V315M433 55V315M449 55V290" stroke="#825266" strokeWidth="5"/>
      <rect x="494" y="95" width="103" height="134" fill="#141729" stroke="#a58071" strokeWidth="6"/>
      <path d="M515 127L531 118L554 125L568 118L581 128V174L551 208L515 174Z" fill="#bb4656"/>
      <path d="M521 142L542 151L536 167L523 162ZM575 142L554 151L560 167L573 162Z" fill="#eee2ce"/>
      <rect x="482" y="277" width="128" height="10" fill="#94706e"/>
      {[0,1,2,3,4,5].map(i=><rect key={i} x={493+i*16} y={239+(i%3)*7} width="12" height={38-(i%3)*7} fill={['#a55d68','#d4ab71','#618b92'][i%3]}/>)}
      <rect y="453" width="640" height="107" fill="#382b3c"/>
      <path d="M0 483H640M0 521H640M80 453V483M290 453V483M500 453V483M170 483V521M390 483V521M600 483V521" stroke="#534051" strokeWidth="3"/>
      <rect x="161" y="509" width="354" height="24" fill="#675063"/><rect x="177" y="515" width="322" height="12" fill="#8b6470"/>
      <rect x="270" y="368" width="69" height="109" fill="#674453" stroke="#352b40" strokeWidth="7"/>
      <path d="M277 472V515M332 472V515" stroke="#201e32" strokeWidth="9"/>
      <path className="lamp-glow" d="M390 303L300 427H494L414 303Z" fill="#f9ca7c" opacity=".12"/>
      <path d="M409 390V317L388 294" fill="none" stroke="#96aaa4" strokeWidth="7"/>
      <path d="M372 289H398L411 309H358Z" fill="#e3b778"/>
      <rect x="393" y="389" width="32" height="6" fill="#96aaa4"/>
      <rect x="161" y="421" width="329" height="16" fill="#a57c75"/><rect x="161" y="437" width="329" height="9" fill="#654756"/>
      <path d="M177 445V519M473 445V519" stroke="#94706e" strokeWidth="12"/>
      <rect x="415" y="449" width="55" height="42" fill="#654756"/><rect x="434" y="464" width="15" height="4" fill="#b9947f"/>
      <path className="study-book" d="M268 406L300 411L334 405V420H268Z" fill="#eee0b2"/><path d="M300 411V420" stroke="#a18b78" strokeWidth="2"/>
      <rect x="189" y="403" width="47" height="14" fill="#71949d"/><rect x="195" y="394" width="45" height="9" fill="#bb6872"/>
      <path d="M365 399H384V418H365ZM384 403H391V413H384" fill="#d6ad85"/>
      <g className="coffee-steam" fill="#e8d4bd" opacity=".5"><rect x="369" y="384" width="3" height="9"/><rect x="378" y="378" width="3" height="11"/></g>
      <rect x="47" y="430" width="46" height="52" fill="#a46e68"/><path d="M70 434V377M70 410L46 388M71 401L94 375" stroke="#688779" strokeWidth="9"/>
      <path d="M0 0L52 49M0 49L52 0M0 25H51M26 0V50" stroke="#b5acc5" opacity=".25" strokeWidth="2"/>
    </svg>
    <div className="room-companion">{spider ? <SpiderManGameplaySprite studying={studying} onClick={onCompanionClick} /> : appearance ? <FullBodyPixelSprite appearance={appearance} size={96} animated onClick={onCompanionClick}/> : <PixelCharacterSprite characterId={character.id} size={96} animated onClick={onCompanionClick}/>}</div>
    <div className="scene-story"><span className="font-pixel">{studying ? 'A LITTLE FOCUS. A LITTLE SUPERPOWER.' : 'EVEN HEROES HAVE HOMEWORK.'}</span><p>{studying ? 'Working together, one page at a time.' : 'Start your timer. Your study buddy is ready.'}</p></div>
  </section>;
}
