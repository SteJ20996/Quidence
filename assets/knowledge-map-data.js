(function(root){'use strict';
const data={
  "words": {
    "en": {
      "title": "Knowledge Map",
      "chapters": [
        "Foundations",
        "University Maths",
        "Physics and Applications",
        "Computer Science"
      ],
      "layers": [
        [
          "Basics",
          "Algebra",
          "Geometry",
          "University Entry"
        ],
        [
          "Entry Points",
          "Analysis",
          "Algebra and Numbers",
          "Geometry and Topology",
          "Computing and Probability"
        ],
        [
          "Maths Tools",
          "Physics Foundations",
          "Modern Physics",
          "Deeper Directions",
          "Applications"
        ],
        [
          "Entry Points",
          "Methods",
          "Further Directions"
        ]
      ],
      "next": "Next step ↑",
      "back": "↓ Previous",
      "continue": "Continue upward ↗",
      "focus": "Focus: ",
      "toward": "Connects upward to: ",
      "end": "Choose another topic to explore",
      "group": "Connected branches: ",
      "topics": "topics",
      "solid": "Common foundations",
      "dashed": "Connections / applications",
      "lit": "Selected connections",
      "scope": "Concept map · Course prerequisites vary",
      "cards": "Course Cards",
      "mapView": "Knowledge Map",
      "concept": "Concept Preview",
      "learn": "Start Learning ↗",
      "diagnose": "Test Your Understanding ↗",
      "available": "Course entry",
      "explore": "Explore only",
      "course": "Course: ",
      "report": "Report scope: the selected course",
      "planned": "Topic-level diagnosis: planned",
      "future": "Explore This Direction",
      "futureMeta": "Courses and topic diagnostics for this direction are not yet available",
      "pick": "Select one topic to see its courses",
      "preview": "Entry preview: ",
      "linked": "Same course · Same learning history",
      "levels": [
        "Middle School",
        "High School",
        "College Level"
      ],
      "grouped": "Courses by level · Choose any course"
    }
  },
  "courses": [
    {
      "id": "number-theory",
      "chapter": 1,
      "node": "number",
      "en": "Number Theory",
      "scope": {
        "en": "Ten bilingual projects · Proof review stays open"
      },
      "module": "number-theory"
    },
    {
      "id": "discrete-math",
      "chapter": 1,
      "node": "proof",
      "en": "Discrete Mathematics",
      "scope": {
        "en": "Ten bilingual projects on graphs, counting, recurrences and induction"
      },
      "module": "discrete-math"
    },
    {
      "id": "prealgebra",
      "chapter": 0,
      "node": "prealgebra",
      "en": "Pre-Algebra",
      "scope": {
        "en": "Number relationships, variables and equations"
      },
      "module": "pre-algebra"
    },
    {
      "id": "algebra1",
      "chapter": 0,
      "node": "algebra1",
      "en": "Algebra I",
      "scope": {
        "en": "Linear relationships, equations and graphs"
      },
      "module": "algebra-1"
    },
    {
      "id": "algebra2",
      "chapter": 0,
      "node": "algebra2",
      "en": "Algebra II",
      "scope": {
        "en": "Functions, nonlinear relationships and models"
      },
      "module": "algebra-2"
    },
    {
      "id": "basic-logic",
      "chapter": 0,
      "node": "logic",
      "en": "Basic Logic",
      "scope": {
        "en": "Statements, conditionals, valid arguments and syllogisms"
      },
      "module": "basic-logic"
    },
    {
      "id": "geometry",
      "chapter": 0,
      "node": "geometry",
      "en": "Geometry",
      "scope": {
        "en": "Shapes, measurement and geometric reasoning"
      },
      "module": "geometry"
    },
    {
      "id": "coordinate-geometry",
      "chapter": 0,
      "node": "coordinate",
      "en": "Coordinate Geometry",
      "scope": {
        "en": "Four lessons · Two guided projects · Foundation and understanding checks"
      },
      "module": "coordinate-geometry"
    },
    {
      "id": "precalculus",
      "chapter": 0,
      "node": "precalculus",
      "en": "Precalculus",
      "scope": {
        "en": "Functions and trigonometry foundations"
      },
      "module": "af01"
    },
    {
      "id": "linear",
      "chapter": 0,
      "node": "linear",
      "en": "Linear Algebra Foundations",
      "scope": {
        "en": "Vectors, linear combinations and matrices"
      },
      "module": "ab01"
    },
    {
      "id": "calculus",
      "chapter": 0,
      "node": "calculus",
      "en": "Visual Calculus",
      "scope": {
        "en": "Rates of change, derivatives and integrals"
      },
      "module": "ad01"
    },
    {
      "id": "statistics",
      "chapter": 0,
      "node": "statistics",
      "en": "Statistics Foundations",
      "scope": {
        "en": "Data, probability and introductory inference"
      },
      "module": "ae01"
    },
    {
      "id": "probability",
      "chapter": 0,
      "node": "probability",
      "en": "Probability",
      "scope": {
        "en": "Ten bilingual proof projects on chance, conditional probability, expected value and the law of large numbers"
      },
      "module": "probability"
    },
    {
      "id": "physics1",
      "chapter": 2,
      "node": "mechanics",
      "en": "Physics 1 Foundations",
      "scope": {
        "en": "Forces, motion and energy"
      },
      "module": "physics-1"
    },
    {
      "id": "physics2",
      "chapter": 2,
      "node": "em",
      "en": "Physics 2 Foundations",
      "scope": {
        "en": "Electromagnetism and related physics foundations"
      },
      "module": "physics-2"
    },
    {
      "id": "gametheory",
      "chapter": 1,
      "node": "gametheory",
      "en": "Game Theory Foundations",
      "scope": {
        "en": "Four English lessons · 15-question foundation check"
      },
      "module": "ac01"
    },
    {
      "id": "algorithms",
      "chapter": 3,
      "node": "algorithms",
      "en": "Algorithms",
      "scope": {
        "en": "Algorithms 1 to 16 open · Flowcharts, steps and code in Python, Java and MATLAB"
      },
      "module": "algorithms"
    }
  ],
  "bindings": {
    "number": [
      "number-theory"
    ],
    "proof": [
      "discrete-math"
    ],
    "operations": [
      "prealgebra"
    ],
    "fractions": [
      "prealgebra"
    ],
    "signed": [
      "prealgebra"
    ],
    "prealgebra": [
      "prealgebra"
    ],
    "shapes": [
      "geometry"
    ],
    "geometry": [
      "geometry"
    ],
    "coordinate": [
      "coordinate-geometry"
    ],
    "algebra1": [
      "algebra1"
    ],
    "algebra2": [
      "algebra2"
    ],
    "logic": [
      "basic-logic"
    ],
    "data": [
      "statistics"
    ],
    "probability": [
      "probability"
    ],
    "statistics": [
      "statistics"
    ],
    "trig": [
      "precalculus"
    ],
    "precalculus": [
      "precalculus"
    ],
    "linear": [
      "linear"
    ],
    "calculus": [
      "calculus"
    ],
    "physics": [
      "physics1",
      "physics2"
    ],
    "mechanics": [
      "physics1"
    ],
    "em": [
      "physics2"
    ],
    "waves": [
      "physics2"
    ],
    "thermo": [
      "physics2"
    ],
    "mathstats": [
      "statistics"
    ],
    "calclinear": [
      "calculus",
      "linear"
    ],
    "gametheory": [
      "gametheory"
    ],
    "algorithms": [
      "algorithms"
    ],
    "searching": [
      "algorithms"
    ],
    "sorting": [
      "algorithms"
    ],
    "numberalgo": [
      "algorithms",
      "number-theory"
    ],
    "recursion": [
      "algorithms",
      "discrete-math"
    ],
    "graphalgo": [
      "algorithms",
      "discrete-math"
    ],
    "dynamic": [
      "algorithms"
    ],
    "complexity": [
      "algorithms"
    ]
  },
  "chapters": [
    {
      "initial": [
        "operations"
      ],
      "groups": [
        "base",
        "algebra",
        "geometry",
        "entry"
      ],
      "height": 960,
      "regions": [
        [
          "operations",
          "fractions",
          "signed",
          "prealgebra"
        ],
        [
          "shapes",
          "geometry",
          "trig",
          "coordinate"
        ]
      ],
      "nodes": [
        {
          "id": "operations",
          "x": 0.48,
          "y": 0.95,
          "layer": "base",
          "en": "Operations"
        },
        {
          "id": "fractions",
          "x": 0.25,
          "y": 0.835,
          "layer": "base",
          "en": "Fractions & ratios"
        },
        {
          "id": "signed",
          "x": 0.57,
          "y": 0.867,
          "layer": "base",
          "en": "Signed numbers"
        },
        {
          "id": "shapes",
          "x": 0.82,
          "y": 0.78,
          "layer": "base",
          "en": "Shapes & measurement"
        },
        {
          "id": "prealgebra",
          "x": 0.43,
          "y": 0.742,
          "layer": "base",
          "en": "Pre-algebra"
        },
        {
          "id": "data",
          "x": 0.105,
          "y": 0.705,
          "layer": "base",
          "en": "Data & graphs"
        },
        {
          "id": "algebra1",
          "x": 0.255,
          "y": 0.618,
          "layer": "algebra",
          "en": "Algebra I"
        },
        {
          "id": "geometry",
          "x": 0.7,
          "y": 0.638,
          "layer": "geometry",
          "en": "Geometry"
        },
        {
          "id": "coordinate",
          "x": 0.53,
          "y": 0.54,
          "layer": "geometry",
          "en": "Coordinate geometry"
        },
        {
          "id": "logic",
          "x": 0.31,
          "y": 0.33,
          "layer": "algebra",
          "en": "Logic"
        },
        {
          "id": "probability",
          "x": 0.13,
          "y": 0.523,
          "layer": "entry",
          "en": "Probability"
        },
        {
          "id": "algebra2",
          "x": 0.33,
          "y": 0.487,
          "layer": "algebra",
          "en": "Algebra II"
        },
        {
          "id": "trig",
          "x": 0.825,
          "y": 0.458,
          "layer": "geometry",
          "en": "Trigonometry"
        },
        {
          "id": "precalculus",
          "x": 0.675,
          "y": 0.355,
          "layer": "entry",
          "en": "Precalculus"
        },
        {
          "id": "linear",
          "x": 0.415,
          "y": 0.22,
          "layer": "entry",
          "en": "Linear algebra"
        },
        {
          "id": "statistics",
          "x": 0.09,
          "y": 0.28,
          "layer": "entry",
          "en": "Statistics"
        },
        {
          "id": "calculus",
          "x": 0.65,
          "y": 0.16,
          "layer": "entry",
          "en": "Calculus"
        },
        {
          "id": "proof",
          "x": 0.22,
          "y": 0.075,
          "layer": "entry",
          "en": "Proof & discrete math"
        },
        {
          "id": "ode",
          "x": 0.865,
          "y": 0.075,
          "layer": "entry",
          "en": "Ordinary differential equations"
        }
      ],
      "links": [
        [
          "operations",
          "fractions"
        ],
        [
          "operations",
          "signed"
        ],
        [
          "operations",
          "shapes"
        ],
        [
          "fractions",
          "prealgebra"
        ],
        [
          "signed",
          "prealgebra"
        ],
        [
          "fractions",
          "data",
          "r"
        ],
        [
          "shapes",
          "geometry"
        ],
        [
          "prealgebra",
          "algebra1"
        ],
        [
          "algebra1",
          "algebra2"
        ],
        [
          "algebra1",
          "coordinate"
        ],
        [
          "geometry",
          "coordinate"
        ],
        [
          "geometry",
          "trig"
        ],
        [
          "data",
          "probability",
          "r"
        ],
        [
          "probability",
          "statistics"
        ],
        [
          "algebra2",
          "precalculus"
        ],
        [
          "trig",
          "precalculus"
        ],
        [
          "coordinate",
          "linear",
          "r"
        ],
        [
          "algebra2",
          "linear"
        ],
        [
          "algebra1",
          "logic",
          "r"
        ],
        [
          "logic",
          "proof"
        ],
        [
          "geometry",
          "proof",
          "r"
        ],
        [
          "precalculus",
          "calculus"
        ],
        [
          "calculus",
          "ode"
        ]
      ]
    },
    {
      "initial": [
        "real"
      ],
      "groups": [
        "entry",
        "analysis",
        "algebra",
        "space",
        "applied"
      ],
      "height": 960,
      "regions": [
        [
          "proof",
          "abstract",
          "groups",
          "rings",
          "number"
        ],
        [
          "calculus",
          "real",
          "measure",
          "complex",
          "harmonic"
        ]
      ],
      "nodes": [
        {
          "id": "proof",
          "x": 0.115,
          "y": 0.94,
          "layer": "entry",
          "en": "Proof & discrete math"
        },
        {
          "id": "linear",
          "x": 0.38,
          "y": 0.955,
          "layer": "entry",
          "en": "Linear algebra"
        },
        {
          "id": "calculus",
          "x": 0.72,
          "y": 0.92,
          "layer": "entry",
          "en": "Calculus"
        },
        {
          "id": "number",
          "x": 0.08,
          "y": 0.785,
          "layer": "algebra",
          "en": "Elementary number theory"
        },
        {
          "id": "advancedlinear",
          "x": 0.35,
          "y": 0.79,
          "layer": "algebra",
          "en": "Advanced linear algebra"
        },
        {
          "id": "multivariable",
          "x": 0.67,
          "y": 0.77,
          "layer": "analysis",
          "en": "Multivariable calculus"
        },
        {
          "id": "ode",
          "x": 0.895,
          "y": 0.8,
          "layer": "analysis",
          "en": "Ordinary differential equations"
        },
        {
          "id": "abstract",
          "x": 0.215,
          "y": 0.65,
          "layer": "algebra",
          "en": "Abstract algebra"
        },
        {
          "id": "real",
          "x": 0.51,
          "y": 0.645,
          "layer": "analysis",
          "en": "Real analysis"
        },
        {
          "id": "numerical",
          "x": 0.09,
          "y": 0.47,
          "layer": "applied",
          "en": "Numerical analysis"
        },
        {
          "id": "groups",
          "x": 0.11,
          "y": 0.545,
          "layer": "algebra",
          "en": "Group theory"
        },
        {
          "id": "rings",
          "x": 0.325,
          "y": 0.485,
          "layer": "algebra",
          "en": "Rings & fields"
        },
        {
          "id": "optimization",
          "x": 0.34,
          "y": 0.335,
          "layer": "applied",
          "en": "Optimization"
        },
        {
          "id": "topology",
          "x": 0.46,
          "y": 0.425,
          "layer": "space",
          "en": "Topology"
        },
        {
          "id": "complex",
          "x": 0.78,
          "y": 0.56,
          "layer": "analysis",
          "en": "Complex analysis"
        },
        {
          "id": "measure",
          "x": 0.62,
          "y": 0.36,
          "layer": "analysis",
          "en": "Measure & integration"
        },
        {
          "id": "pde",
          "x": 0.91,
          "y": 0.38,
          "layer": "analysis",
          "en": "Partial differential equations"
        },
        {
          "id": "algebraicnumber",
          "x": 0.16,
          "y": 0.23,
          "layer": "algebra",
          "en": "Algebraic number theory"
        },
        {
          "id": "functional",
          "x": 0.425,
          "y": 0.18,
          "layer": "analysis",
          "en": "Functional analysis"
        },
        {
          "id": "diffgeometry",
          "x": 0.63,
          "y": 0.205,
          "layer": "space",
          "en": "Differential geometry"
        },
        {
          "id": "probtheory",
          "x": 0.87,
          "y": 0.185,
          "layer": "applied",
          "en": "Probability theory"
        },
        {
          "id": "harmonic",
          "x": 0.59,
          "y": 0.065,
          "layer": "analysis",
          "en": "Harmonic analysis"
        },
        {
          "id": "mathstats",
          "x": 0.855,
          "y": 0.045,
          "layer": "applied",
          "en": "Mathematical statistics"
        },
        {
          "id": "gametheory",
          "x": 0.875,
          "y": 0.665,
          "layer": "applied",
          "en": "Game theory"
        }
      ],
      "links": [
        [
          "calculus",
          "multivariable"
        ],
        [
          "calculus",
          "ode"
        ],
        [
          "calculus",
          "real"
        ],
        [
          "proof",
          "real"
        ],
        [
          "linear",
          "advancedlinear"
        ],
        [
          "proof",
          "abstract"
        ],
        [
          "advancedlinear",
          "abstract",
          "r"
        ],
        [
          "proof",
          "number"
        ],
        [
          "abstract",
          "groups"
        ],
        [
          "abstract",
          "rings"
        ],
        [
          "number",
          "algebraicnumber"
        ],
        [
          "rings",
          "algebraicnumber"
        ],
        [
          "proof",
          "topology"
        ],
        [
          "real",
          "topology",
          "r"
        ],
        [
          "real",
          "complex"
        ],
        [
          "real",
          "measure"
        ],
        [
          "measure",
          "functional"
        ],
        [
          "advancedlinear",
          "functional"
        ],
        [
          "multivariable",
          "diffgeometry"
        ],
        [
          "linear",
          "diffgeometry"
        ],
        [
          "topology",
          "diffgeometry",
          "r"
        ],
        [
          "ode",
          "pde"
        ],
        [
          "multivariable",
          "pde"
        ],
        [
          "real",
          "pde",
          "r"
        ],
        [
          "measure",
          "probtheory"
        ],
        [
          "probtheory",
          "mathstats"
        ],
        [
          "linear",
          "numerical"
        ],
        [
          "calculus",
          "numerical"
        ],
        [
          "linear",
          "optimization"
        ],
        [
          "calculus",
          "optimization"
        ],
        [
          "measure",
          "harmonic"
        ],
        [
          "complex",
          "harmonic",
          "r"
        ],
        [
          "proof",
          "gametheory",
          "r"
        ],
        [
          "linear",
          "gametheory",
          "r"
        ],
        [
          "gametheory",
          "optimization",
          "r"
        ]
      ]
    },
    {
      "initial": [
        "nuclear"
      ],
      "groups": [
        "math",
        "core",
        "modern",
        "frontier",
        "application"
      ],
      "height": 960,
      "regions": [
        [
          "physics",
          "mechanics",
          "em",
          "waves"
        ],
        [
          "quantum",
          "nuclear",
          "particle",
          "qft"
        ]
      ],
      "nodes": [
        {
          "id": "mathstats",
          "x": 0.1,
          "y": 0.94,
          "layer": "math",
          "en": "Probability & statistics"
        },
        {
          "id": "calclinear",
          "x": 0.43,
          "y": 0.95,
          "layer": "math",
          "en": "Calculus & linear algebra"
        },
        {
          "id": "ode",
          "x": 0.82,
          "y": 0.93,
          "layer": "math",
          "en": "Differential equations"
        },
        {
          "id": "number",
          "x": 0.09,
          "y": 0.765,
          "layer": "math",
          "en": "Number theory"
        },
        {
          "id": "physics",
          "x": 0.63,
          "y": 0.785,
          "layer": "core",
          "en": "University physics foundations"
        },
        {
          "id": "ml",
          "x": 0.285,
          "y": 0.66,
          "layer": "application",
          "en": "Machine learning"
        },
        {
          "id": "economics",
          "x": 0.08,
          "y": 0.565,
          "layer": "application",
          "en": "Economics & econometrics"
        },
        {
          "id": "mechanics",
          "x": 0.425,
          "y": 0.655,
          "layer": "core",
          "en": "Classical mechanics"
        },
        {
          "id": "em",
          "x": 0.7,
          "y": 0.63,
          "layer": "core",
          "en": "Electromagnetism"
        },
        {
          "id": "waves",
          "x": 0.875,
          "y": 0.74,
          "layer": "core",
          "en": "Waves & optics"
        },
        {
          "id": "thermo",
          "x": 0.925,
          "y": 0.565,
          "layer": "core",
          "en": "Thermodynamics"
        },
        {
          "id": "special",
          "x": 0.37,
          "y": 0.46,
          "layer": "modern",
          "en": "Special relativity"
        },
        {
          "id": "quantum",
          "x": 0.65,
          "y": 0.435,
          "layer": "modern",
          "en": "Quantum mechanics"
        },
        {
          "id": "statphysics",
          "x": 0.865,
          "y": 0.33,
          "layer": "modern",
          "en": "Statistical physics"
        },
        {
          "id": "diffgeometry",
          "x": 0.195,
          "y": 0.39,
          "layer": "math",
          "en": "Differential geometry"
        },
        {
          "id": "crypto",
          "x": 0.07,
          "y": 0.23,
          "layer": "application",
          "en": "Cryptography"
        },
        {
          "id": "general",
          "x": 0.33,
          "y": 0.245,
          "layer": "frontier",
          "en": "General relativity"
        },
        {
          "id": "nuclear",
          "x": 0.53,
          "y": 0.26,
          "layer": "frontier",
          "en": "Nuclear physics"
        },
        {
          "id": "plasma",
          "x": 0.945,
          "y": 0.16,
          "layer": "frontier",
          "en": "Plasma physics"
        },
        {
          "id": "condensed",
          "x": 0.805,
          "y": 0.115,
          "layer": "frontier",
          "en": "Condensed matter physics"
        },
        {
          "id": "qft",
          "x": 0.49,
          "y": 0.125,
          "layer": "frontier",
          "en": "Quantum field theory"
        },
        {
          "id": "astro",
          "x": 0.16,
          "y": 0.08,
          "layer": "frontier",
          "en": "Astrophysics"
        },
        {
          "id": "particle",
          "x": 0.66,
          "y": 0.025,
          "layer": "frontier",
          "en": "Particle physics"
        }
      ],
      "links": [
        [
          "calclinear",
          "physics",
          "r"
        ],
        [
          "physics",
          "mechanics"
        ],
        [
          "physics",
          "em"
        ],
        [
          "physics",
          "waves"
        ],
        [
          "physics",
          "thermo"
        ],
        [
          "calclinear",
          "quantum",
          "r"
        ],
        [
          "ode",
          "quantum",
          "r"
        ],
        [
          "waves",
          "quantum"
        ],
        [
          "mechanics",
          "special",
          "r"
        ],
        [
          "quantum",
          "nuclear"
        ],
        [
          "special",
          "nuclear"
        ],
        [
          "quantum",
          "particle"
        ],
        [
          "special",
          "particle"
        ],
        [
          "quantum",
          "qft"
        ],
        [
          "special",
          "qft"
        ],
        [
          "qft",
          "particle",
          "r"
        ],
        [
          "thermo",
          "statphysics"
        ],
        [
          "mathstats",
          "statphysics",
          "r"
        ],
        [
          "statphysics",
          "condensed"
        ],
        [
          "quantum",
          "condensed"
        ],
        [
          "statphysics",
          "plasma",
          "r"
        ],
        [
          "em",
          "plasma"
        ],
        [
          "special",
          "general"
        ],
        [
          "diffgeometry",
          "general"
        ],
        [
          "mechanics",
          "astro"
        ],
        [
          "general",
          "astro",
          "r"
        ],
        [
          "mathstats",
          "ml",
          "r"
        ],
        [
          "calclinear",
          "ml",
          "r"
        ],
        [
          "mathstats",
          "economics",
          "r"
        ],
        [
          "number",
          "crypto",
          "r"
        ]
      ]
    },
    {
      "initial": [
        "algorithms"
      ],
      "groups": [
        "entry",
        "methods",
        "frontier"
      ],
      "height": 860,
      "regions": [
        [
          "searching",
          "sorting",
          "numberalgo"
        ],
        [
          "dynamic",
          "complexity"
        ]
      ],
      "nodes": [
        {
          "id": "logic",
          "x": 0.2,
          "y": 0.94,
          "layer": "entry",
          "en": "Logic"
        },
        {
          "id": "algorithms",
          "x": 0.5,
          "y": 0.9,
          "layer": "entry",
          "en": "Algorithms"
        },
        {
          "id": "proof",
          "x": 0.82,
          "y": 0.94,
          "layer": "entry",
          "en": "Proof & discrete math"
        },
        {
          "id": "searching",
          "x": 0.17,
          "y": 0.66,
          "layer": "methods",
          "en": "Searching"
        },
        {
          "id": "sorting",
          "x": 0.43,
          "y": 0.63,
          "layer": "methods",
          "en": "Sorting"
        },
        {
          "id": "numberalgo",
          "x": 0.69,
          "y": 0.67,
          "layer": "methods",
          "en": "Number algorithms"
        },
        {
          "id": "datastructures",
          "x": 0.24,
          "y": 0.4,
          "layer": "methods",
          "en": "Data structures"
        },
        {
          "id": "recursion",
          "x": 0.56,
          "y": 0.41,
          "layer": "methods",
          "en": "Recursion"
        },
        {
          "id": "graphalgo",
          "x": 0.84,
          "y": 0.43,
          "layer": "methods",
          "en": "Graph algorithms"
        },
        {
          "id": "dynamic",
          "x": 0.42,
          "y": 0.17,
          "layer": "frontier",
          "en": "Dynamic programming"
        },
        {
          "id": "complexity",
          "x": 0.75,
          "y": 0.12,
          "layer": "frontier",
          "en": "Complexity and P vs NP"
        }
      ],
      "links": [
        [
          "logic",
          "algorithms"
        ],
        [
          "algorithms",
          "searching"
        ],
        [
          "algorithms",
          "sorting"
        ],
        [
          "algorithms",
          "numberalgo"
        ],
        [
          "proof",
          "recursion",
          "r"
        ],
        [
          "proof",
          "graphalgo",
          "r"
        ],
        [
          "searching",
          "datastructures"
        ],
        [
          "sorting",
          "datastructures",
          "r"
        ],
        [
          "sorting",
          "recursion"
        ],
        [
          "numberalgo",
          "recursion",
          "r"
        ],
        [
          "datastructures",
          "graphalgo"
        ],
        [
          "recursion",
          "dynamic"
        ],
        [
          "graphalgo",
          "dynamic",
          "r"
        ],
        [
          "graphalgo",
          "complexity",
          "r"
        ],
        [
          "dynamic",
          "complexity"
        ]
      ],
      "separate": true
    }
  ],
  "bridges": [
    {
      "calculus": "calculus",
      "linear": "linear",
      "proof": "proof",
      "ode": "ode"
    },
    {
      "calculus": "calclinear",
      "linear": "calclinear",
      "ode": "ode",
      "diffgeometry": "diffgeometry",
      "mathstats": "mathstats",
      "number": "number",
      "algebraicnumber": "number"
    }
  ],
  "previews": {
    "operations": {
      "en": "Combine and compare numbers using addition, subtraction, multiplication and division.",
      "relatedModule": "pre-algebra"
    },
    "fractions": {
      "en": "Fractions describe parts of a whole; ratios compare quantities, including quantities with different units.",
      "relatedModule": "pre-algebra"
    },
    "signed": {
      "en": "Positive and negative numbers describe positions, changes and opposite directions relative to zero.",
      "relatedModule": "pre-algebra"
    },
    "shapes": {
      "en": "Describe figures and measure lengths, angles, areas and volumes.",
      "relatedModule": "geometry"
    },
    "prealgebra": {
      "en": "Use variables and expressions to describe numerical relationships and prepare for equations.",
      "relatedModule": "pre-algebra"
    },
    "data": {
      "en": "Use tables and graphs to represent data, compare patterns and question what a display shows.",
      "relatedModule": "ae01"
    },
    "algebra1": {
      "en": "Model relationships with equations, linear functions, systems and introductory quadratics.",
      "relatedModule": "algebra-1"
    },
    "geometry": {
      "en": "Study shapes, angles and spatial relationships, and explain why geometric claims hold.",
      "relatedModule": "geometry"
    },
    "coordinate": {
      "en": "Use coordinates and equations to connect geometric figures with algebra.",
      "relatedModule": "coordinate-geometry"
    },
    "probability": {
      "en": "Describe uncertainty by studying events, their possible outcomes and their likelihoods.",
      "relatedModule": "probability"
    },
    "algebra2": {
      "en": "Explore polynomial, rational, exponential and logarithmic relationships and their restrictions.",
      "relatedModule": "algebra-2"
    },
    "logic": {
      "en": "Decide when statements are true, test whether a conclusion follows, and spot common fallacies.",
      "relatedModule": "basic-logic"
    },
    "trig": {
      "en": "Connect angles, triangles and periodic functions such as sine and cosine.",
      "relatedModule": "af01"
    },
    "precalculus": {
      "en": "Connect functions, graphs, trigonometry and growth before studying change with calculus.",
      "relatedModule": "af01"
    },
    "linear": {
      "en": "Study vectors, linear combinations and matrices as tools for describing linear relationships.",
      "relatedModule": "ab01"
    },
    "statistics": {
      "en": "Describe variation in data and use evidence to investigate questions about a population.",
      "relatedModule": "ae01"
    },
    "calculus": {
      "en": "Use derivatives to study instantaneous change and integrals to study accumulation.",
      "relatedModule": "ad01"
    },
    "proof": {
      "en": "Build arguments from definitions and assumptions; use examples and counterexamples to test claims.",
      "relatedModule": "discrete-math"
    },
    "ode": {
      "en": "Relate an unknown function of one variable to its derivatives to model how a quantity changes.",
      "relatedModule": "ad01"
    },
    "number": {
      "en": "Explore integers, primes, divisibility and congruences, often through proof.",
      "relatedModule": "number-theory"
    },
    "advancedlinear": {
      "en": "Study vector spaces and linear maps, including eigenvalues, bases and structure beyond basic matrix calculations.",
      "relatedModule": "ab01"
    },
    "multivariable": {
      "en": "Extend derivatives and integrals to functions of several variables, curves and surfaces.",
      "relatedModule": "ad01"
    },
    "abstract": {
      "en": "Study algebraic structures and the rules their operations obey, rather than only particular numbers.",
      "relatedModule": "number-theory"
    },
    "real": {
      "en": "Make ideas about real numbers, limits, continuity, derivatives and integrals precise through proof.",
      "relatedModule": "ad01"
    },
    "numerical": {
      "en": "Design and analyze approximate computational methods, including their errors and stability.",
      "relatedModule": "ad01"
    },
    "groups": {
      "en": "Study operations with identity elements and inverses, including structures that describe symmetry.",
      "relatedModule": "number-theory"
    },
    "rings": {
      "en": "Study systems with addition and multiplication, and how the availability of division changes their structure.",
      "relatedModule": "number-theory"
    },
    "optimization": {
      "en": "Find choices that maximize or minimize an objective, often while satisfying constraints.",
      "relatedModule": "ad01"
    },
    "topology": {
      "en": "Study continuity and properties of spaces that survive suitable continuous deformations.",
      "relatedModule": "geometry"
    },
    "complex": {
      "en": "Study functions of complex numbers, where differentiability creates strong geometric and analytic relationships.",
      "relatedModule": "ad01"
    },
    "measure": {
      "en": "Develop notions of size and integration that handle more general sets and functions.",
      "relatedModule": "ad01"
    },
    "pde": {
      "en": "Relate functions of several variables to partial derivatives to model phenomena such as heat and waves.",
      "relatedModule": "ad01"
    },
    "algebraicnumber": {
      "en": "Use algebraic structures to study number systems extending the integers and rational numbers.",
      "relatedModule": "number-theory"
    },
    "functional": {
      "en": "Study spaces of functions and operators, often using ideas from linear algebra and analysis.",
      "relatedModule": "ab01"
    },
    "diffgeometry": {
      "en": "Use calculus to study curves, surfaces and more general curved spaces.",
      "relatedModule": "ad01"
    },
    "probtheory": {
      "en": "Build mathematical models of random variables, distributions and relationships between random events.",
      "relatedModule": "ae01"
    },
    "harmonic": {
      "en": "Study functions through oscillations and frequency components, including Fourier methods.",
      "relatedModule": "ad01"
    },
    "mathstats": {
      "en": "Use probability models to study estimation, uncertainty and inference from data.",
      "relatedModule": "ae01"
    },
    "gametheory": {
      "en": "Study strategic choices when each participant's outcome depends on other participants' choices.",
      "relatedModule": "ac01"
    },
    "calclinear": {
      "en": "Combine tools for continuous change with vectors and linear models in more advanced applications.",
      "relatedModule": "ad01"
    },
    "physics": {
      "en": "Build models of motion, forces, energy and fields, and compare their predictions with evidence.",
      "relatedModule": "physics-1"
    },
    "ml": {
      "en": "Fit models to examples and examine how well they make predictions on new data.",
      "relatedModule": "ae01"
    },
    "economics": {
      "en": "Study choices and interactions under constraints; econometrics uses data to estimate and test economic relationships.",
      "relatedModule": "ae01"
    },
    "mechanics": {
      "en": "Model how forces, motion, momentum and energy relate in physical systems.",
      "relatedModule": "physics-1"
    },
    "em": {
      "en": "Study electric and magnetic fields, charges, currents and how they interact.",
      "relatedModule": "physics-2"
    },
    "waves": {
      "en": "Study disturbances that propagate and how wave ideas help explain light and other phenomena.",
      "relatedModule": "physics-2"
    },
    "thermo": {
      "en": "Relate temperature, energy transfer, work and constraints on physical processes.",
      "relatedModule": "physics-2"
    },
    "special": {
      "en": "Study space and time when relative motion matters and the speed of light is invariant in inertial frames.",
      "relatedModule": "physics-1"
    },
    "quantum": {
      "en": "Use quantum states and probabilities to describe measurements and behavior at atomic and related scales.",
      "relatedModule": "physics-2"
    },
    "statphysics": {
      "en": "Connect the statistical behavior of many microscopic constituents with large-scale physical properties.",
      "relatedModule": "physics-2"
    },
    "crypto": {
      "en": "Study methods for protecting information and checking authenticity, including mathematical constructions and their limits.",
      "relatedModule": "number-theory"
    },
    "general": {
      "en": "Describe gravity through the geometry of spacetime and its relationship with matter and energy.",
      "relatedModule": "physics-1"
    },
    "nuclear": {
      "en": "Study atomic nuclei, their structures, interactions and transformations.",
      "relatedModule": "physics-2"
    },
    "plasma": {
      "en": "Study ionized matter and collective behavior involving charged particles and electromagnetic fields.",
      "relatedModule": "physics-2"
    },
    "condensed": {
      "en": "Study the collective behavior and properties of matter such as solids and liquids.",
      "relatedModule": "physics-2"
    },
    "qft": {
      "en": "Use quantum fields to describe particles and interactions in a framework consistent with special relativity.",
      "relatedModule": "physics-2"
    },
    "astro": {
      "en": "Apply physics to stars, galaxies and other astronomical objects and processes.",
      "relatedModule": "physics-1"
    },
    "particle": {
      "en": "Study elementary particles and their interactions, using experiments and mathematical models.",
      "relatedModule": "physics-2"
    },
    "algorithms": {
      "en": "Follow a method step by step as a flowchart, numbered steps and code, then question it and improve it.",
      "relatedModule": "algorithms"
    },
    "searching": {
      "en": "Find an item in a list: check the items one by one, or halve a sorted list again and again.",
      "relatedModule": "algorithms"
    },
    "sorting": {
      "en": "Put a list in order and compare how many comparisons different methods need.",
      "relatedModule": "algorithms"
    },
    "numberalgo": {
      "en": "Compute with whole numbers efficiently, such as Euclid’s algorithm for the greatest common divisor.",
      "relatedModule": "algorithms"
    },
    "datastructures": {
      "en": "Organize data so that the steps an algorithm needs, such as finding or adding an item, are fast.",
      "relatedModule": "algorithms"
    },
    "recursion": {
      "en": "Solve a problem by first solving a smaller case of the same problem, as in the Tower of Hanoi.",
      "relatedModule": "algorithms"
    },
    "graphalgo": {
      "en": "Explore networks with breadth-first and depth-first search, shortest paths and spanning trees.",
      "relatedModule": "algorithms"
    },
    "dynamic": {
      "en": "Reuse the answers to smaller problems instead of solving them again, and see when greedy choices fail.",
      "relatedModule": "algorithms"
    },
    "complexity": {
      "en": "Compare how fast the cost of a method grows with its input, up to the open question P versus NP.",
      "relatedModule": "algorithms"
    }
  }
};
if(typeof module==='object'&&module.exports)module.exports=data;else root.QuidenceKnowledgeMapData=data;
})(typeof window==='object'?window:globalThis);
