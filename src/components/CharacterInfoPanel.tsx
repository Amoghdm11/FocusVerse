import React, { useState } from 'react';
import { Play, Star, Music, Sparkles, Volume2, ShieldCheck, Compass, Check } from 'lucide-react';
import { Character } from '../types/character';
import { PixelFaceAvatar } from './PixelFaceAvatar';
import { audioEngine } from '../utils/audioEngine';

interface CharacterInfoPanelProps {
  character: Character;
  onEnterWorkspace: (character: Character) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  archetypeMode?: boolean;
}

export const CharacterInfoPanel: React.FC<CharacterInfoPanelProps> = ({
  character,
  onEnterWorkspace,
  isFavorite,
  onToggleFavorite,
  archetypeMode = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSampleAudio = () => {
    audioEngine.playClick();
    setIsPlayingAudio(true);
    audioEngine.playVictoryJingle(character.synthNotes);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  return (
    <div className="backdrop-blur-md bg-[#0E0B1C]/90 border-2 border-[#3E356B] shadow-[8px_8px_0px_rgba(0,0,0,0.65)] p-4 flex flex-col justify-between h-full select-none">
      {/* Top Header: Category Tag & Favorite Toggle */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#241E3E] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider"
              style={{
                borderColor: character.palette.borderPrimary,
                color: character.palette.borderPrimary,
                backgroundColor: `${character.palette.borderPrimary}15`,
              }}
            >
              {character.category}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-arcade-gold font-pixel text-[10px]">{character.index}</span>
          </div>

          <button
            onClick={() => onToggleFavorite(character.id)}
            className={`px-2 py-0.5 border text-[10px] font-mono flex items-center gap-1 transition-all ${
              isFavorite
                ? 'border-arcade-gold bg-amber-950/40 text-arcade-gold'
                : 'border-arcade-border text-gray-500 hover:text-white'
            }`}
            title={isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
          >
            <Star size={12} fill={isFavorite ? '#F5C242' : 'none'} color={isFavorite ? '#F5C242' : 'currentColor'} />
            <span>{isFavorite ? 'FAVORITE' : 'SAVE'}</span>
          </button>
        </div>

        {/* Character Title & 64x64 Pixel Face */}
        <div className="flex items-start gap-3 mb-3">
          <PixelFaceAvatar
            characterId={character.id}
            size={56}
            className="w-14 h-14 border-2 border-arcade-gold/80 shadow-[0_0_8px_rgba(245,194,66,0.4)] p-0 bg-black/60 shrink-0 mt-0.5"
            title={character.name}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest truncate">
              {character.universe}
            </div>
            <h2 className="font-pixel text-xs sm:text-sm text-white uppercase mt-0.5 mb-0.5 leading-normal break-words drop-shadow-[0_2px_8px_rgba(245,194,66,0.25)]">
              {archetypeMode ? character.archetypeName : character.name}
            </h2>
            {archetypeMode && (
              <div className="text-[10px] font-mono text-arcade-cyan truncate">
                // CANON: {character.name}
              </div>
            )}
          </div>
        </div>

        {/* Personality Quote */}
        <div className="bg-void-darkest/90 p-2.5 border border-arcade-border/80 mb-3 text-xs font-mono text-arcade-gold italic leading-relaxed">
          {character.quote}
        </div>

        {/* Workspace Atmosphere & Soundscape Readout */}
        <div className="space-y-2 mb-4 text-xs font-mono">
          <div className="flex items-center justify-between p-1.5 bg-void-darkest border border-arcade-border/60 text-[11px]">
            <span className="text-gray-400">CANVAS FX:</span>
            <span className="text-arcade-cyan font-bold uppercase">[ {character.environmentFX} ]</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-void-darkest border border-arcade-border/60 text-[11px]">
            <span className="text-gray-400">ACOUSTIC PROFILE:</span>
            <span className="text-arcade-gold uppercase font-bold">[ {character.ambienceProfile} ]</span>
          </div>

          <div className="text-[10px] text-gray-400 p-2 bg-[#120E22] border border-[#241E3E]">
            <span className="text-gray-500">&gt; </span>
            <span>{character.tagline}</span>
          </div>
        </div>

        {/* Palette Swatches & Audio Sample Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#241E3E] mb-4">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-gray-500">TINT:</span>
            <div
              className="w-4 h-4 border border-black shadow-pixel-sm"
              style={{ backgroundColor: character.palette.borderPrimary }}
              title={`Primary: ${character.palette.borderPrimary}`}
            />
            <div
              className="w-4 h-4 border border-black shadow-pixel-sm"
              style={{ backgroundColor: character.palette.accentGold }}
              title={`Gold: ${character.palette.accentGold}`}
            />
            <div
              className="w-4 h-4 border border-black shadow-pixel-sm"
              style={{ backgroundColor: character.palette.accentSecondary }}
              title={`Secondary: ${character.palette.accentSecondary}`}
            />
          </div>

          {/* Audio preview button */}
          <button
            onClick={handleSampleAudio}
            className={`px-2.5 py-1 text-[10px] font-mono border flex items-center gap-1.5 transition-all ${
              isPlayingAudio
                ? 'border-arcade-cyan bg-arcade-cyan text-black font-bold'
                : 'border-arcade-border text-gray-300 hover:border-arcade-gold hover:text-arcade-gold'
            }`}
            title="Sample character audio frequencies"
          >
            <Music size={12} className={isPlayingAudio ? 'animate-bounce' : ''} />
            <span>{isPlayingAudio ? 'PLAYING...' : 'SAMPLE AUDIO'}</span>
          </button>
        </div>
      </div>

      {/* PRIMARY ACTION BUTTON: STUDY WITH THIS COMPANION */}
      <div>
        <button
          onClick={() => {
            audioEngine.playClick();
            onEnterWorkspace(character);
          }}
          className="w-full pixel-btn-primary py-3 px-3 font-silkscreen text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-pixel hover:shadow-pixel-gold whitespace-nowrap"
        >
          <Play size={14} fill="currentColor" />
          <span>STUDY WITH THIS COMPANION ▶</span>
        </button>
      </div>
    </div>
  );
};
