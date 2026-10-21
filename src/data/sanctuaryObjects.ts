export type SanctuaryFeature = 'music' | 'notes' | 'tasks';
export interface SanctuaryObject { feature: SanctuaryFeature; label: string; x: number; y: number; width: number; height: number }
export interface SanctuaryComposition { actor: { x: number; floor: number; height: number }; objects: SanctuaryObject[] }
// All bounds use the same 1000 × 660 scene space; visual and hit areas scale together.
export const SANCTUARY_OBJECTS: Record<string, SanctuaryComposition> = {
  "bruce-wayne": {
    "actor": {
      "x": 560,
      "floor": 580,
      "height": 360
    },
    "objects": [
      {
        "feature": "music",
        "label": "sonar audio console",
        "x": 75,
        "y": 190,
        "width": 270,
        "height": 190
      },
      {
        "feature": "notes",
        "label": "detective evidence notes board",
        "x": 710,
        "y": 95,
        "width": 210,
        "height": 190
      },
      {
        "feature": "tasks",
        "label": "grapnel mission terminal",
        "x": 730,
        "y": 360,
        "width": 210,
        "height": 150
      }
    ]
  },
  "tony-stark": {
    "actor": {
      "x": 580,
      "floor": 580,
      "height": 365
    },
    "objects": [
      {
        "feature": "music",
        "label": "audio mixing console",
        "x": 60,
        "y": 300,
        "width": 260,
        "height": 165
      },
      {
        "feature": "notes",
        "label": "engineering blueprint clipboard",
        "x": 700,
        "y": 485,
        "width": 275,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "holographic suit planning terminal",
        "x": 800,
        "y": 125,
        "width": 185,
        "height": 200
      }
    ]
  },
  "miles-morales": {
    "actor": {
      "x": 540,
      "floor": 580,
      "height": 340
    },
    "objects": [
      {
        "feature": "music",
        "label": "boombox",
        "x": 120,
        "y": 300,
        "width": 200,
        "height": 160
      },
      {
        "feature": "notes",
        "label": "sketch journal",
        "x": 785,
        "y": 370,
        "width": 195,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "mural project board",
        "x": 735,
        "y": 110,
        "width": 235,
        "height": 195
      }
    ]
  },
  "gwen-stacy": {
    "actor": {
      "x": 550,
      "floor": 580,
      "height": 345
    },
    "objects": [
      {
        "feature": "music",
        "label": "amplifier and headphones",
        "x": 65,
        "y": 300,
        "width": 160,
        "height": 160
      },
      {
        "feature": "notes",
        "label": "sheet music notebook",
        "x": 800,
        "y": 395,
        "width": 185,
        "height": 135
      },
      {
        "feature": "tasks",
        "label": "rehearsal planning board",
        "x": 765,
        "y": 120,
        "width": 210,
        "height": 155
      }
    ]
  },
  "naruto-uzumaki": {
    "actor": {
      "x": 560,
      "floor": 582,
      "height": 355
    },
    "objects": [
      {
        "feature": "music",
        "label": "portable orange radio",
        "x": 120,
        "y": 280,
        "width": 180,
        "height": 145
      },
      {
        "feature": "notes",
        "label": "unrolled sealing scroll",
        "x": 710,
        "y": 360,
        "width": 180,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "shinobi mission board",
        "x": 710,
        "y": 100,
        "width": 210,
        "height": 190
      }
    ]
  },
  "gojo-satoru": {
    "actor": {
      "x": 610,
      "floor": 575,
      "height": 380
    },
    "objects": [
      {
        "feature": "music",
        "label": "small wireless speaker",
        "x": 130,
        "y": 300,
        "width": 170,
        "height": 145
      },
      {
        "feature": "notes",
        "label": "talisman journal",
        "x": 710,
        "y": 360,
        "width": 180,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "barrier planning display",
        "x": 710,
        "y": 100,
        "width": 210,
        "height": 190
      }
    ]
  },
  "levi-ackerman": {
    "actor": {
      "x": 565,
      "floor": 590,
      "height": 340
    },
    "objects": [
      {
        "feature": "music",
        "label": "vintage field radio",
        "x": 100,
        "y": 300,
        "width": 200,
        "height": 160
      },
      {
        "feature": "notes",
        "label": "expedition logbook",
        "x": 785,
        "y": 370,
        "width": 190,
        "height": 150
      },
      {
        "feature": "tasks",
        "label": "Scout expedition map board",
        "x": 740,
        "y": 90,
        "width": 230,
        "height": 210
      }
    ]
  },
  "l-lawliet": {
    "actor": {
      "x": 550,
      "floor": 565,
      "height": 305
    },
    "objects": [
      {
        "feature": "music",
        "label": "surveillance audio console",
        "x": 110,
        "y": 295,
        "width": 220,
        "height": 185
      },
      {
        "feature": "notes",
        "label": "case notebook",
        "x": 750,
        "y": 365,
        "width": 225,
        "height": 155
      },
      {
        "feature": "tasks",
        "label": "deduction evidence board",
        "x": 740,
        "y": 80,
        "width": 235,
        "height": 220
      }
    ]
  },
  "elsa": {
    "actor": {
      "x": 565,
      "floor": 580,
      "height": 365
    },
    "objects": [
      {
        "feature": "music",
        "label": "crystal music box",
        "x": 150,
        "y": 310,
        "width": 190,
        "height": 140
      },
      {
        "feature": "notes",
        "label": "frost-bound journal",
        "x": 760,
        "y": 360,
        "width": 210,
        "height": 150
      },
      {
        "feature": "tasks",
        "label": "etched ice planning tablet",
        "x": 715,
        "y": 85,
        "width": 240,
        "height": 215
      }
    ]
  },
  "rapunzel": {
    "actor": {
      "x": 570,
      "floor": 580,
      "height": 350
    },
    "objects": [
      {
        "feature": "music",
        "label": "wooden music box",
        "x": 115,
        "y": 300,
        "width": 200,
        "height": 175
      },
      {
        "feature": "notes",
        "label": "painting journal",
        "x": 750,
        "y": 355,
        "width": 225,
        "height": 150
      },
      {
        "feature": "tasks",
        "label": "easel with project sketches",
        "x": 680,
        "y": 125,
        "width": 230,
        "height": 240
      }
    ]
  },
  "moana": {
    "actor": {
      "x": 570,
      "floor": 580,
      "height": 345
    },
    "objects": [
      {
        "feature": "music",
        "label": "shell chime instrument",
        "x": 110,
        "y": 135,
        "width": 200,
        "height": 280
      },
      {
        "feature": "notes",
        "label": "wayfinder chart journal",
        "x": 740,
        "y": 370,
        "width": 235,
        "height": 150
      },
      {
        "feature": "tasks",
        "label": "star navigation planning board",
        "x": 740,
        "y": 90,
        "width": 235,
        "height": 220
      }
    ]
  },
  "hermione-granger": {
    "actor": {
      "x": 550,
      "floor": 580,
      "height": 340
    },
    "objects": [
      {
        "feature": "music",
        "label": "enchanted brass gramophone",
        "x": 130,
        "y": 290,
        "width": 190,
        "height": 175
      },
      {
        "feature": "notes",
        "label": "open annotated grimoire",
        "x": 760,
        "y": 365,
        "width": 220,
        "height": 155
      },
      {
        "feature": "tasks",
        "label": "study timetable parchment board",
        "x": 725,
        "y": 100,
        "width": 240,
        "height": 190
      }
    ]
  },
  "wednesday-addams": {
    "actor": {
      "x": 600,
      "floor": 580,
      "height": 345
    },
    "objects": [
      {
        "feature": "music",
        "label": "antique gramophone",
        "x": 105,
        "y": 290,
        "width": 215,
        "height": 175
      },
      {
        "feature": "notes",
        "label": "typewriter manuscript",
        "x": 780,
        "y": 350,
        "width": 200,
        "height": 155
      },
      {
        "feature": "tasks",
        "label": "investigation pinboard",
        "x": 730,
        "y": 100,
        "width": 235,
        "height": 200
      }
    ]
  },
  "officer-k": {
    "actor": {
      "x": 540,
      "floor": 580,
      "height": 370
    },
    "objects": [
      {
        "feature": "music",
        "label": "baseline audio console",
        "x": 110,
        "y": 275,
        "width": 215,
        "height": 195
      },
      {
        "feature": "notes",
        "label": "memory research file",
        "x": 775,
        "y": 360,
        "width": 205,
        "height": 160
      },
      {
        "feature": "tasks",
        "label": "investigation planning terminal",
        "x": 775,
        "y": 95,
        "width": 205,
        "height": 200
      }
    ]
  },
  "neo": {
    "actor": {
      "x": 595,
      "floor": 570,
      "height": 380
    },
    "objects": [
      {
        "feature": "music",
        "label": "operator audio console",
        "x": 110,
        "y": 285,
        "width": 215,
        "height": 180
      },
      {
        "feature": "notes",
        "label": "code research notebook",
        "x": 765,
        "y": 350,
        "width": 215,
        "height": 160
      },
      {
        "feature": "tasks",
        "label": "operator planning terminal",
        "x": 745,
        "y": 100,
        "width": 235,
        "height": 190
      }
    ]
  },
  "cozy-study-girl": {
    "actor": {
      "x": 545,
      "floor": 578,
      "height": 345
    },
    "objects": [
      {
        "feature": "music",
        "label": "vinyl record player",
        "x": 120,
        "y": 270,
        "width": 200,
        "height": 170
      },
      {
        "feature": "notes",
        "label": "handwritten journal",
        "x": 760,
        "y": 340,
        "width": 220,
        "height": 175
      },
      {
        "feature": "tasks",
        "label": "weekly planner board",
        "x": 735,
        "y": 85,
        "width": 235,
        "height": 200
      }
    ]
  },
  "late-night-study-boy": {
    "actor": {
      "x": 570,
      "floor": 580,
      "height": 345
    },
    "objects": [
      {
        "feature": "music",
        "label": "headphone audio dock",
        "x": 130,
        "y": 270,
        "width": 200,
        "height": 170
      },
      {
        "feature": "notes",
        "label": "coding notebook",
        "x": 710,
        "y": 360,
        "width": 180,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "project planning board",
        "x": 710,
        "y": 100,
        "width": 210,
        "height": 190
      }
    ]
  },
  "purring-window-cat": {
    "actor": {
      "x": 550,
      "floor": 580,
      "height": 210
    },
    "objects": [
      {
        "feature": "music",
        "label": "small vintage radio",
        "x": 130,
        "y": 270,
        "width": 200,
        "height": 170
      },
      {
        "feature": "notes",
        "label": "botanical field journal",
        "x": 710,
        "y": 360,
        "width": 180,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "gardening planner board",
        "x": 710,
        "y": 100,
        "width": 210,
        "height": 190
      }
    ]
  },
  "loyal-fireplace-dog": {
    "actor": {
      "x": 555,
      "floor": 580,
      "height": 265
    },
    "objects": [
      {
        "feature": "music",
        "label": "wooden tabletop radio",
        "x": 130,
        "y": 270,
        "width": 200,
        "height": 170
      },
      {
        "feature": "notes",
        "label": "hearthside journal",
        "x": 710,
        "y": 360,
        "width": 180,
        "height": 140
      },
      {
        "feature": "tasks",
        "label": "walking route planner board",
        "x": 710,
        "y": 100,
        "width": 210,
        "height": 190
      }
    ]
  }
};
