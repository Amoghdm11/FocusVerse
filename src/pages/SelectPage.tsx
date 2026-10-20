import React from 'react';
import { Character } from '../types/character';
import { SpiderManCustomizationMenu } from '../components/SpiderManCustomizationMenu';
import { CustomAppearanceState } from '../utils/pixelSpriteCompositor';

export type SpiritGenderType = 'boy' | 'girl';
export type SpiritToggleOption = 'gender-only' | 'pets-only' | 'both';
export type SpiritFilterType = 'boy' | 'girl' | 'ALL' | 'neutral';

export interface SelectPageProps {
  onSelectCharacter: (
    character: Character,
    playerName?: string,
    customAppearance?: CustomAppearanceState
  ) => void;
  onBackToHome: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialCharacter?: Character;
  initialSpirit?: 'boy' | 'girl' | 'ALL' | 'neutral';
  onPreviewCharacterChange?: (character: Character) => void;
}

export const SelectPage: React.FC<SelectPageProps> = ({
  onSelectCharacter,
  onBackToHome,
  archetypeMode,
  initialCharacter,
  initialSpirit = 'boy',
}) => {
  const gender: 'boy' | 'girl' = initialSpirit === 'girl' ? 'girl' : 'boy';

  return (
    <SpiderManCustomizationMenu
      initialCharacter={initialCharacter}
      initialGender={gender}
      onBackToHome={onBackToHome}
      onConfirmAppearance={(char, appearance, playerName) => {
        onSelectCharacter(char, playerName, appearance);
      }}
      archetypeMode={archetypeMode}
    />
  );
};

export default SelectPage;
