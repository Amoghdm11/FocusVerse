import React from 'react';

interface PixelFaceData {
  palette: Record<string, string>;
  rows: string[];
}

// 16x16 Pixel Art Matrices for all 20 Characters
export const CHARACTER_FACES: Record<string, PixelFaceData> = {
  // 1. Peter Parker (Spider-Man)
  'peter-parker': {
    palette: {
      '.': 'transparent',
      'R': '#D90429', // Spidey red
      'D': '#9E1A1A', // Dark red shadow
      'B': '#111827', // Black web line
      'W': '#FFFFFF', // Lens white
      'C': '#BAE6FD', // Lens cyan tint
    },
    rows: [
      '....RRRRRRRR....',
      '...RDBBRRBBRD...',
      '..RDBRRRRRRBRD..',
      '..RBRRRBBRRRBR..',
      '.RDBRRB..BRRBRD.',
      '.RBBRBWWWWBRBBR.',
      '.RBRBWWWWWCBRBR.',
      '.RBRWWWWWCCCBBR.',
      '.RBRWWWWCCCCBBR.',
      '.RBRBWWWWCCBBRD.',
      '.RDBRBWWWWBRBBD.',
      '..RBRRB..BRRBR..',
      '..RDBRRBBRRRBD..',
      '...RDBRRRRRBD...',
      '....RDBBBBRD....',
      '.....RDDDDDD....',
    ],
  },

  // 2. Batman (Bruce Wayne)
  'bruce-wayne': {
    palette: {
      '.': 'transparent',
      'C': '#181C24', // Cowl dark
      'H': '#2A303C', // Cowl highlight
      'S': '#F6D0B1', // Skin jaw
      'D': '#DDB194', // Skin shadow
      'W': '#FFFFFF', // Eye white
      'L': '#7C5E48', // Mouth
      'B': '#0E1116', // Ear pitch
    },
    rows: [
      '..B..........B..',
      '..CC........CC..',
      '..CCC......CCC..',
      '...CCHHHHHHCC...',
      '..CCHHHHHHHHCC..',
      '..CHHHHHHHHHHC..',
      '.CCHHHCCCHHHHCC.',
      '.CCHWWCCCWWCHCC.',
      '.CCHWWCCCWWCHCC.',
      '.CCHCCCCCCCCHCC.',
      '..CCCCDDDDCCCC..',
      '..CCCDSSSSDDCC..',
      '..CCDDSSSSDDCC..',
      '...CDDDLLDDDC...',
      '...CCDDDDDDCC...',
      '....CCCCCCCC....',
    ],
  },

  // 3. Tony Stark (Iron Man)
  'tony-stark': {
    palette: {
      '.': 'transparent',
      'R': '#B91C1C', // Dark Crimson helmet
      'M': '#DC2626', // Helmet red
      'G': '#F59E0B', // Faceplate gold
      'Y': '#FCD34D', // Gold highlight
      'C': '#06B6D4', // Arc eye cyan
      'W': '#FFFFFF', // Eye white
      'B': '#78350F', // Faceplate line
    },
    rows: [
      '....MMMMMMMM....',
      '...MMMMMMMMMM...',
      '..MMRMMMMMMRMM..',
      '..MRRGGGGGGFRM..',
      '.MMRGGYYYYGGFRM.',
      '.MMGYYYYYYYYFRM.',
      '.MMGYYYYYYYYFRM.',
      '.MMGYYBCCBBYGMM.',
      '.MMGYYCWWCGYGMM.',
      '.MMGYYBCCBBYGMM.',
      '.MMGYYYYYYYYGMM.',
      '..MGYYGBBGGYGM..',
      '..MGYYGGGGGYGM..',
      '...MMGGYYGGMM...',
      '....MMRRRRMM....',
      '.....MMMMMM.....',
    ],
  },

  // 4. Miles Morales
  'miles-morales': {
    palette: {
      '.': 'transparent',
      'K': '#111827', // Pitch mask
      'G': '#1F2937', // Charcoal mask
      'R': '#EF4444', // Neon red lens frame
      'P': '#F43F5E', // Pink-red
      'W': '#FFFFFF', // Lens white
      'S': '#7F1D1D', // Dark web
    },
    rows: [
      '....GGKKKKGG....',
      '...GKKSSSKKGG...',
      '..GKKSSSSSSKKG..',
      '..GKKKSSSSKKKG..',
      '.GGKKR...RKKKGG.',
      '.GKKRWWWWWRKKKG.',
      '.GKKRWPPPWWRKKG.',
      '.GKRWWPPPPWWRKG.',
      '.GKRWWPPPPWWRKG.',
      '.GKKRWPPPWWRKKG.',
      '.GGKKRWWWWWRKGG.',
      '..GKKKR...RKKKG..',
      '..GKKKSSSSSKKKG..',
      '...GKKKKKKKKGG...',
      '....GGKKKKGG....',
      '.....GGGGGG.....',
    ],
  },

  // 5. Gwen Stacy (Spider-Gwen)
  'gwen-stacy': {
    palette: {
      '.': 'transparent',
      'W': '#FFFFFF', // White hood outer
      'H': '#F1F5F9', // Hood shading
      'S': '#CBD5E1', // Hood deep shadow
      'M': '#831843', // Interior magenta lining
      'K': '#0F172A', // Mask dark
      'T': '#06B6D4', // Teal eye lens
      'P': '#EC4899', // Pink eye accent
    },
    rows: [
      '....HHHHHHHH....',
      '...HWWWWWWWWH...',
      '..HWWWWWWWWWWH..',
      '..HWWMMMMMMWWH..',
      '.HWWMMKKKKMMWWH.',
      '.HWSMKKKKKKMSWH.',
      '.HWSMKTKKTMMSWH.',
      '.HWSMKTPPTKMSWH.',
      '.HWSMKTPPTKMSWH.',
      '.HWSMKTKKTMMSWH.',
      '.HWSMKKKKKKMSWH.',
      '..HSMMKKKKMMSH..',
      '..HSSMMMMMMSSH..',
      '...HSSWWWWSSH...',
      '....SSSSSSSS....',
      '.....SSSSSS.....',
    ],
  },

  // 6. Naruto Uzumaki
  'naruto-uzumaki': {
    palette: {
      '.': 'transparent',
      'Y': '#FBBF24', // Spiky yellow hair
      'O': '#D97706', // Hair shadow
      'B': '#1E3A8A', // Blue headband
      'M': '#94A3B8', // Metal plate
      'P': '#CBD5E1', // Metal highlight
      'S': '#FDBA74', // Skin tone
      'W': '#78350F', // Whiskers / eyes
      'E': '#0284C7', // Blue eyes
      'L': '#EA580C', // Mouth
    },
    rows: [
      '.Y.Y..YY..Y.Y...',
      'YYYYYYYYYYYYYYY.',
      'YYYYYYYYYYYYYYYY',
      '.OYYBOOOOOBYYYYO',
      '..BBMMMMMMMMBB..',
      '..BBMPPMPPPMBB..',
      '..SSSSSSSSSSSS..',
      '.YSSWESSSEWSSY..',
      '.YSSWWSSSWWSSY..',
      '..SWWSWSSWWSW...',
      '..SSSSSSSSSSSS..',
      '..SWWSSSSSSWWS..',
      '...SSSSLLSSSS...',
      '...SSSSSSSSSS...',
      '....SSSSSSSS....',
      '.....SSSSSS.....',
    ],
  },

  // 7. Gojo Satoru
  'gojo-satoru': {
    palette: {
      '.': 'transparent',
      'W': '#FFFFFF', // Frost white hair
      'S': '#E2E8F0', // Hair shadow
      'K': '#09090B', // Pitch blindfold
      'G': '#27272A', // Blindfold highlight
      'C': '#38BDF8', // Cyan glow sliver
      'F': '#FEE2E2', // Pale skin
      'M': '#FCA5A5', // Lip smirk
    },
    rows: [
      '...W..WWW..W....',
      '..WWWWWWWWWWWW..',
      '.WWWWWWWWWWWWWW.',
      'SWWSWWWSWWWSSWWS',
      'SWWWWWWWWWWWWWWS',
      '.SWKKKKKKKKKKWS.',
      '..KKGGGGGGGGKK..',
      '..KKKKKKKKKKKK..',
      '..CCKKKKKKKKCC..',
      '..FFFFFFFFFFFF..',
      '..FFFFFFFFFFFF..',
      '..FFFFFMMFFFFF..',
      '...FFFFFFFFFF...',
      '...FFFFFFFFFF...',
      '....FFFFFFFF....',
      '.....FFFFFF.....',
    ],
  },

  // 8. Levi Ackerman
  'levi-ackerman': {
    palette: {
      '.': 'transparent',
      'K': '#18181B', // Parted dark undercut hair
      'D': '#27272A', // Hair highlight
      'S': '#FDE047', // Under-skin tone
      'F': '#FCE7D6', // Pale face
      'E': '#3F3F46', // Narrow stoic eyes
      'W': '#FFFFFF', // Cravat
      'G': '#166534', // Survey green cloak collar
      'L': '#991B1B', // Lip line
    },
    rows: [
      '....KKKKKKKK....',
      '...KKKKKKKKKK...',
      '..KKKKDDKKKKKK..',
      '.KKKKDDFFDDKKKK.',
      '.KKKDFFFFFDDKKK.',
      '.KKDFFFFFFFDDKK.',
      '.KKDFFEFFEEDKKK.',
      '.KKDFFFFFFFDKKK.',
      '..KDFFFFFFFDKK..',
      '..KDFFFLFFFDKK..',
      '...DFFFFFFFDD...',
      '....FFFFFFF.....',
      '...GGWWWWWGG....',
      '..GGGGWWWWGGGG..',
      '..GGGGWWWWGGGG..',
      '...GGGGGGGGGG...',
    ],
  },

  // 9. L Lawliet
  'l-lawliet': {
    palette: {
      '.': 'transparent',
      'K': '#09090B', // Wild messy jet hair
      'S': '#27272A', // Hair tips
      'F': '#FFF1F2', // Very pale skin
      'E': '#18181B', // Intense pupil
      'W': '#FFFFFF', // Eye white
      'P': '#475569', // Dark under-eye circles
      'L': '#E2E8F0', // Pale mouth
    },
    rows: [
      '.K...KK.KK...K..',
      'KKKKKKKKKKKKKKK.',
      'KKKKKKKKKKKKKKKK',
      'KKKSKKKSKKKSKKKK',
      'KKKFFFFFFFFFFKKK',
      'SKFFFFFFFFFFFFKS',
      'SKFFWWKFFWWKFFKS',
      'SKFFWWWFFWWWFFKS',
      'SKFFPPPFFPPPFFKS',
      '.KFFFFFFFFFFFFK.',
      '.KFFFFFFFFFFFFK.',
      '..KFFFFLLFFFFK..',
      '...FFFFFFFFFF...',
      '....FFFFFFFF....',
      '...WWWWWWWWWW...',
      '..WWWWWWWWWWWW..',
    ],
  },

  // 10. Elsa
  'elsa': {
    palette: {
      '.': 'transparent',
      'Y': '#FEF08A', // Platinum blonde hair
      'H': '#FEF9C3', // Pale blonde highlight
      'F': '#FDF2E9', // Pale porcelain skin
      'C': '#06B6D4', // Cyan crystal eyes
      'W': '#FFFFFF', // Eye highlight
      'T': '#38BDF8', // Tiara crystal
      'L': '#F43F5E', // Rose lips
      'B': '#BAE6FD', // Ice braid side
    },
    rows: [
      '....TTTTTTTT....',
      '...HHHHHHHHHH...',
      '..HHHHHHHHHHHH..',
      '.HYYYYYYYYYYYYH.',
      '.HYYYYYYYYYYYYH.',
      'BHYYFFFFFFFFYYH.',
      'BHYFCWFFFNCWYH..',
      'BHYFCCFFFCCYHB..',
      'BHYFFFFFFFFFFHB.',
      '.HYFFFFFFFFFFHB.',
      '.HYFFFFLLFFFFHB.',
      '..HYFFFFFFFFHB..',
      '..BHYYYYYYYHB...',
      '...BBBBBBBBB....',
      '....BBBBBBB.....',
      '.....BBBBB......',
    ],
  },

  // 11. Rapunzel
  'rapunzel': {
    palette: {
      '.': 'transparent',
      'G': '#FBBF24', // Golden hair
      'Y': '#FCD34D', // Bright gold
      'F': '#FDE0D2', // Warm face
      'E': '#10B981', // Emerald eyes
      'W': '#FFFFFF', // White gleam
      'P': '#F472B6', // Flower pink
      'V': '#C084FC', // Flower purple
      'L': '#FB7185', // Warm smile
    },
    rows: [
      '...GGGGGGGGGG...',
      '..GGGGYYYYGGGG..',
      '.GGGYFPPPFYYGGG.',
      'GGGYFFVVVFFYGGGG',
      'GGYFFFFFFFFFFYGG',
      'GGYFEWFFFFEWYFGG',
      'GGYFEEFFFFEEFFGG',
      'GGYFFFFFFFFFFYGG',
      'GGYFFFLLLLFFFYGG',
      'GGGYFFFFFFFFYGGG',
      'GGGGYYYYYYYYGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      '.GGGGGGGGGGGGGG.',
      '..GGGGGGGGGGGG..',
      '...GGGGGGGGGG...',
    ],
  },

  // 12. Moana
  'moana': {
    palette: {
      '.': 'transparent',
      'K': '#291811', // Dark wavy hair
      'H': '#451A03', // Hair highlight
      'S': '#C28452', // Island skin tone
      'R': '#EF4444', // Plumeria flower red
      'Y': '#FCD34D', // Flower yellow center
      'E': '#3E1C08', // Warm brown eyes
      'W': '#FFFFFF', // Eye highlight
      'L': '#A84E32', // Smile
    },
    rows: [
      '...KKKKKKKKKK...',
      '..KKKHHHHHHKKK..',
      '.KKKRRYHHHHHKKK.',
      'KKKKRRRYHHHHHKKK',
      'KKHSSSSSSSSSSSHK',
      'KKHSEWSSSSSEWSHK',
      'KKHSEEESSSSEESHK',
      'KKHSSSSSSSSSSSHK',
      'KKHSSSSLLSSSSHHK',
      '.KHSSSSSSSSSSHK.',
      '.KKHSSSSSSSSHHK.',
      '..KKHHSSSSHHKK..',
      '..KKKKKKKKKKKK..',
      '.KKKKKKKKKKKKKK.',
      'KKKKKKKKKKKKKKKK',
      '.KKKKKKKKKKKKKK.',
    ],
  },

  // 13. Hermione Granger
  'hermione-granger': {
    palette: {
      '.': 'transparent',
      'B': '#78350F', // Bushy chestnut hair
      'H': '#92400E', // Hair volume
      'F': '#FCE7D6', // Warm skin
      'E': '#451A03', // Warm brown eyes
      'W': '#FFFFFF', // Eye catch
      'R': '#991B1B', // Gryffindor red
      'G': '#F59E0B', // Gryffindor gold
      'L': '#B45309', // Lip line
    },
    rows: [
      '..BBBBBBBBBBBB..',
      '.BBHHHHHHHHHHBB.',
      'BBHHBBBBBBBBHHBB',
      'BBHFFFFFFFFFFHBB',
      'BBHFEWFFFFEWFFBB',
      'BBHFEEFFFFEEFFBB',
      'BBHFFFFFFFFFFHBB',
      'BBHFFFFLLFFFFHBB',
      'BBHFFFFFFFFFFHBB',
      '.BBHFFFFFFFFHBB.',
      '..BBHHHHHHHHBB..',
      '..RRRRGGGGRRRR..',
      '.RRRRRGGGGRRRRR.',
      '.GGGGRRRRRRGGGG.',
      '..RRRRGGGGRRRR..',
      '...RRRRRRRRRR...',
    ],
  },

  // 14. Wednesday Addams
  'wednesday-addams': {
    palette: {
      '.': 'transparent',
      'K': '#09090B', // Black hair & twin braids
      'S': '#18181B', // Hair edge
      'F': '#F5EBE6', // Gothic pale skin
      'E': '#09090B', // Deadpan eyes
      'W': '#FFFFFF', // Pointed white collar
      'D': '#1C1917', // Black dress
      'L': '#78716C', // Dark lips
    },
    rows: [
      '....KKKKKKKK....',
      '...KKKKKKKKKK...',
      '..KKKKKKKKKKKK..',
      '.KKKFFFFFFFFKKK.',
      '.KKKFFFFFFFFKKK.',
      'KKKFFEFFFFEFFKKK',
      'KKKFFEFFFFEFFKKK',
      'KKKFFFFFFFFFFKKK',
      'KKKFFFFLLFFFFKKK',
      'KKKFFFFFFFFFFKKK',
      'KKKWWFFFFFFWWKKK',
      'KK.WWWFFFFWWW.KK',
      'KK..WWWWWWWW..KK',
      'KK...DDDDDD...KK',
      'KK....DDDD....KK',
      'KK............KK',
    ],
  },

  // 15. Officer K
  'officer-k': {
    palette: {
      '.': 'transparent',
      'K': '#292524', // Dark tousled hair
      'H': '#44403C', // Hair edge
      'F': '#FCE7D6', // Face base
      'O': '#FB923C', // Amber cyberpunk rim light (left)
      'C': '#38BDF8', // Cyan phosphor rim light (right)
      'E': '#1C1917', // Focused gaze
      'T': '#1C1917', // High trench coat collar
      'S': '#78716C', // Shearling lining
    },
    rows: [
      '....KKKKKKKK....',
      '...KKKHHHHHKK...',
      '..KKKKKKKKKKKK..',
      '.OKKKKKKKKKKKKC.',
      '.OKFFFFFFFFFFKC.',
      '.OKFFEFFFFEFFKC.',
      '.OKFFEFFFFEFFKC.',
      '.OKFFFFFFFFFFKC.',
      '.OKFFFFFFFFFFKC.',
      '..KFFFFFFFFFFK..',
      '..TTFFFFFFFFTT..',
      '.TTTSFFFFFFSTTT.',
      '.TTTSSSSSSSSSTT.',
      '..TTTTTTTTTTTT..',
      '..TTTTTTTTTTTT..',
      '...TTTTTTTTTT...',
    ],
  },

  // 16. Neo (The One)
  'neo': {
    palette: {
      '.': 'transparent',
      'K': '#09090B', // Slick black hair
      'G': '#22C55E', // Matrix phosphor green glow
      'F': '#FDE6D2', // Pale skin
      'S': '#18181B', // Dark sunglasses
      'W': '#E4E4E7', // Specular lens shine
      'L': '#B45309', // Stoic mouth
      'C': '#09090B', // High black coat collar
    },
    rows: [
      '....KKKKKKKK....',
      '...KKKKKKKKKK...',
      '..KKKKKKKKKKKK..',
      '.GKKKKKKKKKKKKG.',
      '.GKFFFFFFFFFFKG.',
      '.GKSSWWFFSSWWKG.',
      '.GKSSSSFFSSSSKG.',
      '.GKFFFFFFFFFFKG.',
      '.GKFFFFLLFFFFKG.',
      '..KFFFFFFFFFFK..',
      '...FFFFFFFFFF...',
      '...CCCC..CCCC...',
      '..CCCCCC.CCCCCC.',
      '.CCCCCCCCCCCCCC.',
      'CCCCCCCCCCCCCCCC',
      '.CCCCCCCCCCCCCC.',
    ],
  },

  // 17. Cozy Study Girl
  'cozy-study-girl': {
    palette: {
      '.': 'transparent',
      'B': '#6B4226', // Warm brown hair bun
      'H': '#8C5935', // Hair highlight
      'F': '#FDE0D2', // Cozy skin
      'P': '#52796F', // Sage green headphones
      'C': '#CAD2C5', // Headphone pad
      'R': '#F87171', // Rosy cheek blush
      'E': '#5C3D2E', // Smiling eyes
      'S': '#E07A5F', // Terracotta sweater
      'L': '#B45309', // Smile
    },
    rows: [
      '....BBBBBBBB....',
      '...BBHHHHHHBB...',
      '..BBBBBBBBBBBB..',
      '.PBBFFFFFFFFBBP.',
      '.PBFEFFFFFEFFBP.',
      '.PCFRFFFFFRFCBP.',
      '.PCFFFFFFFFFFCBP.',
      '.PBFFFFLLFFFFFBP.',
      '..PBFFFFFFFFBP..',
      '..PPBFFFFFFBPP..',
      '...PPBBBBBBPP...',
      '...SSSSSSSSSS...',
      '..SSSSSSSSSSSS..',
      '.SSSSSSSSSSSSSS.',
      '.SSSSSSSSSSSSSS.',
      '..SSSSSSSSSSSS..',
    ],
  },

  // 18. Late-Night Study Boy
  'late-night-study-boy': {
    palette: {
      '.': 'transparent',
      'H': '#0F172A', // Dark hoodie
      'K': '#1E293B', // Hoodie inner
      'B': '#1E1B4B', // Dark messy hair
      'F': '#FCD5B5', // Late night face
      'C': '#38BDF8', // Cyan glowing glasses
      'W': '#FFFFFF', // Glasses reflection
      'L': '#78350F', // Calm mouth
      'A': '#FBBF24', // Amber monitor glow
    },
    rows: [
      '....HHHHHHHH....',
      '...HHHHHHHHHH...',
      '..HHBBBBBBBBHH..',
      '.HHBBFBBFBBBHHH.',
      '.HKFCWCFCWCFKKH.',
      '.HKFCCCCFCCFKKH.',
      'AHKFFFFFFFFFKKH.',
      'AHKFFFFLLFFFKKH.',
      'AHKFFFFFFFFFKKH.',
      '.HKKFFFFFFFKKH..',
      '..KKKFFFFFKKK...',
      '...HHHHHHHHHH...',
      '..HHHHHHHHHHHH..',
      '.HHHHHHHHHHHHHH.',
      '.HHHHHHHHHHHHHH.',
      '..HHHHHHHHHHHH..',
    ],
  },

  // 19. Purring Window Cat
  'purring-window-cat': {
    palette: {
      '.': 'transparent',
      'O': '#FB923C', // Honey orange ginger fur
      'D': '#EA580C', // Orange fur stripe
      'C': '#FFF7ED', // Cream muzzle & chest
      'P': '#FB7185', // Pink nose / ears
      'E': '#7C2D12', // Purring ^ ^ eyes
      'W': '#FFFFFF', // Whisker dots
    },
    rows: [
      '.O............O.',
      '.OP..........PO.',
      '.OOPD......DPOO.',
      '.OOPDD....DDPOO.',
      '..OODDOOOODDOO..',
      '.OOOOODDDDOOOOO.',
      '.OOOODDDDDOOOOO.',
      '.OOEEOOOOOEEOOO.',
      '.OOOOOOOOOOOOOO.',
      '.OOOWWWCCWWWOOO.',
      '.OOOWWPCCPWWOOO.',
      '..OOOCCPCOOOO...',
      '...OCCCCCCCOO...',
      '...CCCCCCCCCC...',
      '....CCCCCCCC....',
      '.....CCCCCC.....',
    ],
  },

  // 20. Loyal Fireplace Dog
  'loyal-fireplace-dog': {
    palette: {
      '.': 'transparent',
      'G': '#D97706', // Golden brown fur
      'Y': '#F59E0B', // Golden highlight
      'E': '#78350F', // Floppy ear dark brown
      'D': '#1C1917', // Dark nose / friendly eyes
      'W': '#FFFFFF', // Eye spark
      'T': '#F43F5E', // Happy pink tongue
      'C': '#DC2626', // Red collar
      'K': '#FBBF24', // Gold collar tag
    },
    rows: [
      '..EE........EE..',
      '.EEEE......EEEE.',
      '.EEEGGYYYYGGEEE.',
      '.EEEGGYYYYGGEEE.',
      '.EEGYGGGGGGYGEE.',
      '.EEGYDWGGYDWGEE.',
      '.EEGGDDGGYDDGEE.',
      '.EEGGGGGGGGGGEE.',
      '..EGGGGDDGGGGE..',
      '...GGGGDDGGGG...',
      '...GGGGTTGGGG...',
      '....GGTTTTGG....',
      '.....GGGGGG.....',
      '....CCCCKCCCC...',
      '...CCCCCCCCCCC..',
      '....CCCCCCCCC...',
    ],
  },
};

const DEFAULT_FACE: PixelFaceData = {
  palette: {
    '.': 'transparent',
    'X': '#F5C242',
    'B': '#120E24',
  },
  rows: [
    '................',
    '....XXXXXXXX....',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    '.XXBBXXXXXXBBXX.',
    '.XXBBXXXXXXBBXX.',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '.XXBXXXXXXXXBXX.',
    '.XXXBBBBBBBBXXX.',
    '..XXXXXXXXXXXX..',
    '....XXXXXXXX....',
    '................',
    '................',
    '................',
  ],
};

interface PixelFaceAvatarProps {
  characterId: string;
  size?: number;
  className?: string;
  title?: string;
}

export const PixelFaceAvatar: React.FC<PixelFaceAvatarProps> = ({
  characterId,
  size = 40,
  className = '',
  title,
}) => {
  const data = CHARACTER_FACES[characterId] || DEFAULT_FACE;

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      style={{
        imageRendering: 'pixelated',
        shapeRendering: 'crispEdges',
      }}
    >
      {title && <title>{title}</title>}
      {data.rows.map((row, y) =>
        row.split('').map((char, x) => {
          const color = data.palette[char];
          if (!color || color === 'transparent') return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
};
