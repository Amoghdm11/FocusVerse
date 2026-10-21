import React, { useState } from 'react';
import artManifest from '../data/sanctuaryArt.json';
import { SANCTUARY_OBJECTS, SanctuaryFeature } from '../data/sanctuaryObjects';
import { SanctuaryDesign } from '../data/sanctuaries';
import { SanctuaryActor } from './SanctuaryActor';

type Asset = { src: string; width: number; height: number };
export const sanctuaryArt = artManifest as Record<string, { room?: Asset; actor?: Asset }>;

export function IllustratedSanctuaryStage({ id, name, design, tool, frame, onCompanionClick, handlers }: {
  id: string; name: string; design: SanctuaryDesign; tool: string; frame: number;
  onCompanionClick: () => void; handlers: Record<SanctuaryFeature, () => void>;
}) {
  const [guide, setGuide] = useState(false);
  const [active, setActive] = useState<SanctuaryFeature | null>(null);
  const layout = SANCTUARY_OBJECTS[id];
  const art = sanctuaryArt[id];
  const actorWidth = art.actor ? layout.actor.height * art.actor.width / art.actor.height : 170;
  const actor = layout.actor;
  const activate = (feature: SanctuaryFeature) => { setActive(feature); handlers[feature](); };
  // The legacy actor is explicitly retained when replacement generation fails.
  // It is not classified as approved illustration in the acceptance audit.
  const fallback = { ...design, x: actor.x, y: actor.floor - 251 * (actor.height / 275), scale: actor.height / 275 };
  return <>
    <div className={`sanctuary-canvas ${guide ? 'show-object-guide' : ''}`}>
      <svg className="sanctuary-stage" viewBox="0 0 1000 660" aria-label={`${design.architecture}. ${design.props}.`} role="img">
        <image href={`${import.meta.env.BASE_URL}${art.room!.src}`} width="1000" height="660" preserveAspectRatio="xMidYMid meet" />
        <g className={`sanctuary-ambient ambient-${design.ambient}`} fill={design.palette[2]} opacity=".3">
          {Array.from({ length: 18 }, (_, i) => design.ambient === 'rain'
            ? <path key={i} d={`M${80 + (i * 137) % 840} ${45 + (i * 53) % 245}l-3 12`} stroke={design.palette[2]} />
            : <circle key={i} cx={80 + (i * 137) % 840} cy={45 + (i * 53) % 245} r={design.ambient === 'snow' ? 2 : 1} />)}
        </g>
        {id === 'gojo-satoru' && <g className="barrier-shimmer" fill="none" stroke="#a798ff" opacity=".2"><ellipse cx="810" cy="190" rx="45" ry="61"/><ellipse cx="810" cy="190" rx="61" ry="24"/></g>}
        {id === 'bruce-wayne' && <path className="sonar-sweep" d="M190 280L100 220A110 110 0 0 1 290 245Z" fill="#7ee9ef" opacity=".05"/>}
        {id === 'officer-k' && <rect className="neon-flicker" x="30" y="55" width="940" height="230" fill="#efb36e" opacity=".035"/>}
        {id === 'purring-window-cat' && <path className="greenhouse-light" d="M590 20L940 20L650 620H160Z" fill="#fff0b2" opacity=".045"/>}
        {id === 'loyal-fireplace-dog' && <ellipse className="hearth-glow" cx="815" cy="330" rx="170" ry="210" fill="#ffb958" opacity=".065"/>}
        <ellipse cx={actor.x} cy={actor.floor - 2} rx={actorWidth * .32} ry="10" fill="#070e19" opacity=".35" />
        {art.actor ? <g data-actor={id} className={`illustrated-actor actor-${id}`} style={{ transformOrigin: `${actor.x}px ${actor.floor}px` }}>
          <image href={`${import.meta.env.BASE_URL}${art.actor.src}`} x={actor.x - actorWidth / 2} y={actor.floor - actor.height} width={actorWidth} height={actor.height} preserveAspectRatio="xMidYMax meet" />
        </g> : <>
          <SanctuaryActor id={id} design={fallback} tool={tool} frame={frame} layer="body" />
          <SanctuaryActor id={id} design={fallback} tool={tool} frame={frame} layer="hands" />
        </>}
      </svg>
      <button className="sanctuary-companion-hit" aria-label={`Encourage ${name}`} style={{ left: `${(actor.x - actorWidth / 2) / 10}%`, top: `${(actor.floor - actor.height) / 6.6}%`, width: `${actorWidth / 10}%`, height: `${actor.height / 6.6}%` }} onClick={e => { e.stopPropagation(); onCompanionClick(); }} />
      {layout.objects.map(object => <button key={object.feature} className="sanctuary-object" data-feature={object.feature}
        aria-label={`${object.label} — Open ${object.feature}`} title={`${object.label} · ${object.feature}`}
        style={{ left: `${object.x / 10}%`, top: `${object.y / 6.6}%`, width: `${object.width / 10}%`, height: `${object.height / 6.6}%` }}
        onClick={e => { e.stopPropagation(); activate(object.feature); }}>
        <span className="sanctuary-object-marker" aria-hidden="true">+</span>
        <span className="sanctuary-object-label">{object.label}<small>Open {object.feature} ↗</small></span>
      </button>)}
    </div>
    <div className="sanctuary-object-toolbar"><span>{active ? `${layout.objects.find(o => o.feature === active)?.label} · ${active}` : 'Select an object to open your study tools'}</span><button aria-pressed={guide} onClick={() => setGuide(!guide)}>{guide ? 'Hide object guide' : 'Show object guide'}</button></div>
  </>;
}
