(function(root){'use strict';
const data={
  "words": {
    "en": {
      "title": "Mathematics Knowledge Map",
      "chapters": [
        "Foundations",
        "University Maths",
        "Physics and Applications"
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
    },
    "es": {
      "title": "Mapa de conocimientos matemáticos",
      "chapters": [
        "Fundamentos",
        "Matemáticas universitarias",
        "Física y aplicaciones"
      ],
      "layers": [
        [
          "Bases",
          "Álgebra",
          "Geometría",
          "Inicio universitario"
        ],
        [
          "Puntos de partida",
          "Análisis",
          "Álgebra y números",
          "Geometría y topología",
          "Cálculo numérico y probabilidad"
        ],
        [
          "Herramientas matemáticas",
          "Fundamentos de física",
          "Física moderna",
          "Áreas avanzadas",
          "Aplicaciones"
        ]
      ],
      "next": "Siguiente ↑",
      "back": "↓ Anterior",
      "continue": "Seguir creciendo ↗",
      "focus": "Tema actual: ",
      "toward": "Se conecta con: ",
      "end": "Elige otro tema para explorar",
      "group": "Ramas relacionadas: ",
      "topics": "temas",
      "solid": "Bases habituales",
      "dashed": "Conexiones / aplicaciones",
      "lit": "Conexiones seleccionadas",
      "scope": "Mapa conceptual · Los requisitos previos varían según el curso",
      "cards": "Tarjetas de cursos",
      "mapView": "Mapa de conocimientos",
      "concept": "Vista conceptual",
      "learn": "Empezar a aprender ↗",
      "diagnose": "Comprobar tu comprensión ↗",
      "available": "Acceso al curso",
      "explore": "Solo exploración",
      "course": "Curso: ",
      "report": "Alcance del informe: el curso seleccionado",
      "planned": "Diagnóstico por tema: previsto",
      "future": "Explora esta área",
      "futureMeta": "Los cursos y diagnósticos de esta área aún no están disponibles",
      "pick": "Selecciona un tema para ver sus cursos",
      "preview": "Vista previa del acceso: ",
      "linked": "Mismo curso · Mismo historial de aprendizaje",
      "levels": [
        "Secundaria inicial",
        "Secundaria superior",
        "Nivel universitario"
      ],
      "grouped": "Cursos por nivel · Puedes elegir cualquier curso"
    }
  },
  "courses": [
    {"id":"number-theory","chapter":1,"node":"number","en":"Number Theory","es":"Teoría de números","scope":{"en":"Ten English projects · Proof review stays open","es":"Diez proyectos en inglés · Las demostraciones quedan pendientes de revisión"},"module":"number-theory"},
    {
      "id": "prealgebra",
      "chapter": 0,
      "node": "prealgebra",
      "en": "Pre-Algebra",
      "es": "Preálgebra",
      "scope": {
        "en": "Number relationships, variables and equations",
        "es": "Relaciones numéricas, variables y ecuaciones"
      },
      "module": "pre-algebra"
    },
    {
      "id": "algebra1",
      "chapter": 0,
      "node": "algebra1",
      "en": "Algebra I",
      "es": "Álgebra I",
      "scope": {
        "en": "Linear relationships, equations and graphs",
        "es": "Relaciones lineales, ecuaciones y gráficas"
      },
      "module": "algebra-1"
    },
    {
      "id": "algebra2",
      "chapter": 0,
      "node": "algebra2",
      "en": "Algebra II",
      "es": "Álgebra II",
      "scope": {
        "en": "Functions, nonlinear relationships and models",
        "es": "Funciones, relaciones no lineales y modelos"
      },
      "module": "algebra-2"
    },
    {
      "id": "geometry",
      "chapter": 0,
      "node": "geometry",
      "en": "Geometry",
      "es": "Geometría",
      "scope": {
        "en": "Shapes, measurement and geometric reasoning",
        "es": "Figuras, medición y razonamiento geométrico"
      },
      "module": "geometry"
    },
    {
      "id": "precalculus",
      "chapter": 0,
      "node": "precalculus",
      "en": "Precalculus",
      "es": "Precálculo",
      "scope": {
        "en": "Functions and trigonometry foundations",
        "es": "Fundamentos de funciones y trigonometría"
      },
      "module": "af01"
    },
    {
      "id": "linear",
      "chapter": 0,
      "node": "linear",
      "en": "Linear Algebra Foundations",
      "es": "Fundamentos de álgebra lineal",
      "scope": {
        "en": "Vectors, linear combinations and matrices",
        "es": "Vectores, combinaciones lineales y matrices"
      },
      "module": "ab01"
    },
    {
      "id": "calculus",
      "chapter": 0,
      "node": "calculus",
      "en": "Visual Calculus",
      "es": "Cálculo visual",
      "scope": {
        "en": "Rates of change, derivatives and integrals",
        "es": "Tasas de cambio, derivadas e integrales"
      },
      "module": "ad01"
    },
    {
      "id": "statistics",
      "chapter": 0,
      "node": "statistics",
      "en": "Statistics Foundations",
      "es": "Fundamentos de estadística",
      "scope": {
        "en": "Data, probability and introductory inference",
        "es": "Datos, probabilidad e inferencia básica"
      },
      "module": "ae01"
    },
    {
      "id": "physics1",
      "chapter": 2,
      "node": "mechanics",
      "en": "Physics 1 Foundations",
      "es": "Fundamentos de física 1",
      "scope": {
        "en": "Forces, motion and energy",
        "es": "Fuerzas, movimiento y energía"
      },
      "module": "physics-1"
    },
    {
      "id": "physics2",
      "chapter": 2,
      "node": "em",
      "en": "Physics 2 Foundations",
      "es": "Fundamentos de física 2",
      "scope": {
        "en": "Electromagnetism and related physics foundations",
        "es": "Electromagnetismo y fundamentos físicos relacionados"
      },
      "module": "physics-2"
    }
  ],
  "bindings": {
    "number": ["number-theory"],
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
      "geometry"
    ],
    "algebra1": [
      "algebra1"
    ],
    "algebra2": [
      "algebra2"
    ],
    "data": [
      "statistics"
    ],
    "probability": [
      "statistics"
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
          "en": "Operations",
          "es": "Operaciones"
        },
        {
          "id": "fractions",
          "x": 0.25,
          "y": 0.835,
          "layer": "base",
          "en": "Fractions & ratios",
          "es": "Fracciones y razones"
        },
        {
          "id": "signed",
          "x": 0.57,
          "y": 0.867,
          "layer": "base",
          "en": "Signed numbers",
          "es": "Números con signo"
        },
        {
          "id": "shapes",
          "x": 0.82,
          "y": 0.78,
          "layer": "base",
          "en": "Shapes & measurement",
          "es": "Figuras y medición"
        },
        {
          "id": "prealgebra",
          "x": 0.43,
          "y": 0.742,
          "layer": "base",
          "en": "Pre-algebra",
          "es": "Preálgebra"
        },
        {
          "id": "data",
          "x": 0.105,
          "y": 0.705,
          "layer": "base",
          "en": "Data & graphs",
          "es": "Datos y gráficas"
        },
        {
          "id": "algebra1",
          "x": 0.255,
          "y": 0.618,
          "layer": "algebra",
          "en": "Algebra I",
          "es": "Álgebra I"
        },
        {
          "id": "geometry",
          "x": 0.7,
          "y": 0.638,
          "layer": "geometry",
          "en": "Geometry",
          "es": "Geometría"
        },
        {
          "id": "coordinate",
          "x": 0.53,
          "y": 0.54,
          "layer": "geometry",
          "en": "Coordinate geometry",
          "es": "Geometría analítica"
        },
        {
          "id": "probability",
          "x": 0.13,
          "y": 0.523,
          "layer": "entry",
          "en": "Probability",
          "es": "Probabilidad"
        },
        {
          "id": "algebra2",
          "x": 0.33,
          "y": 0.487,
          "layer": "algebra",
          "en": "Algebra II",
          "es": "Álgebra II"
        },
        {
          "id": "trig",
          "x": 0.825,
          "y": 0.458,
          "layer": "geometry",
          "en": "Trigonometry",
          "es": "Trigonometría"
        },
        {
          "id": "precalculus",
          "x": 0.675,
          "y": 0.355,
          "layer": "entry",
          "en": "Precalculus",
          "es": "Precálculo"
        },
        {
          "id": "linear",
          "x": 0.415,
          "y": 0.22,
          "layer": "entry",
          "en": "Linear algebra",
          "es": "Álgebra lineal"
        },
        {
          "id": "statistics",
          "x": 0.09,
          "y": 0.28,
          "layer": "entry",
          "en": "Statistics",
          "es": "Estadística"
        },
        {
          "id": "calculus",
          "x": 0.65,
          "y": 0.16,
          "layer": "entry",
          "en": "Calculus",
          "es": "Cálculo"
        },
        {
          "id": "proof",
          "x": 0.22,
          "y": 0.075,
          "layer": "entry",
          "en": "Proof & discrete math",
          "es": "Demostración y matemática discreta"
        },
        {
          "id": "ode",
          "x": 0.865,
          "y": 0.075,
          "layer": "entry",
          "en": "Ordinary differential equations",
          "es": "Ecuaciones diferenciales ordinarias"
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
          "proof",
          "r"
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
          "en": "Proof & discrete math",
          "es": "Demostración y matemática discreta"
        },
        {
          "id": "linear",
          "x": 0.38,
          "y": 0.955,
          "layer": "entry",
          "en": "Linear algebra",
          "es": "Álgebra lineal"
        },
        {
          "id": "calculus",
          "x": 0.72,
          "y": 0.92,
          "layer": "entry",
          "en": "Calculus",
          "es": "Cálculo"
        },
        {
          "id": "number",
          "x": 0.08,
          "y": 0.785,
          "layer": "algebra",
          "en": "Elementary number theory",
          "es": "Teoría elemental de números"
        },
        {
          "id": "advancedlinear",
          "x": 0.35,
          "y": 0.79,
          "layer": "algebra",
          "en": "Advanced linear algebra",
          "es": "Álgebra lineal avanzada"
        },
        {
          "id": "multivariable",
          "x": 0.67,
          "y": 0.77,
          "layer": "analysis",
          "en": "Multivariable calculus",
          "es": "Cálculo multivariable"
        },
        {
          "id": "ode",
          "x": 0.895,
          "y": 0.8,
          "layer": "analysis",
          "en": "Ordinary differential equations",
          "es": "Ecuaciones diferenciales ordinarias"
        },
        {
          "id": "abstract",
          "x": 0.215,
          "y": 0.65,
          "layer": "algebra",
          "en": "Abstract algebra",
          "es": "Álgebra abstracta"
        },
        {
          "id": "real",
          "x": 0.51,
          "y": 0.645,
          "layer": "analysis",
          "en": "Real analysis",
          "es": "Análisis real"
        },
        {
          "id": "numerical",
          "x": 0.09,
          "y": 0.47,
          "layer": "applied",
          "en": "Numerical analysis",
          "es": "Análisis numérico"
        },
        {
          "id": "groups",
          "x": 0.11,
          "y": 0.545,
          "layer": "algebra",
          "en": "Group theory",
          "es": "Teoría de grupos"
        },
        {
          "id": "rings",
          "x": 0.325,
          "y": 0.485,
          "layer": "algebra",
          "en": "Rings & fields",
          "es": "Anillos y cuerpos"
        },
        {
          "id": "optimization",
          "x": 0.34,
          "y": 0.335,
          "layer": "applied",
          "en": "Optimization",
          "es": "Optimización"
        },
        {
          "id": "topology",
          "x": 0.46,
          "y": 0.425,
          "layer": "space",
          "en": "Topology",
          "es": "Topología"
        },
        {
          "id": "complex",
          "x": 0.78,
          "y": 0.56,
          "layer": "analysis",
          "en": "Complex analysis",
          "es": "Análisis complejo"
        },
        {
          "id": "measure",
          "x": 0.62,
          "y": 0.36,
          "layer": "analysis",
          "en": "Measure & integration",
          "es": "Medida e integración"
        },
        {
          "id": "pde",
          "x": 0.91,
          "y": 0.38,
          "layer": "analysis",
          "en": "Partial differential equations",
          "es": "Ecuaciones diferenciales parciales"
        },
        {
          "id": "algebraicnumber",
          "x": 0.16,
          "y": 0.23,
          "layer": "algebra",
          "en": "Algebraic number theory",
          "es": "Teoría algebraica de números"
        },
        {
          "id": "functional",
          "x": 0.425,
          "y": 0.18,
          "layer": "analysis",
          "en": "Functional analysis",
          "es": "Análisis funcional"
        },
        {
          "id": "diffgeometry",
          "x": 0.63,
          "y": 0.205,
          "layer": "space",
          "en": "Differential geometry",
          "es": "Geometría diferencial"
        },
        {
          "id": "probtheory",
          "x": 0.87,
          "y": 0.185,
          "layer": "applied",
          "en": "Probability theory",
          "es": "Teoría de la probabilidad"
        },
        {
          "id": "harmonic",
          "x": 0.59,
          "y": 0.065,
          "layer": "analysis",
          "en": "Harmonic analysis",
          "es": "Análisis armónico"
        },
        {
          "id": "mathstats",
          "x": 0.855,
          "y": 0.045,
          "layer": "applied",
          "en": "Mathematical statistics",
          "es": "Estadística matemática"
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
          "en": "Probability & statistics",
          "es": "Probabilidad y estadística"
        },
        {
          "id": "calclinear",
          "x": 0.43,
          "y": 0.95,
          "layer": "math",
          "en": "Calculus & linear algebra",
          "es": "Cálculo y álgebra lineal"
        },
        {
          "id": "ode",
          "x": 0.82,
          "y": 0.93,
          "layer": "math",
          "en": "Differential equations",
          "es": "Ecuaciones diferenciales"
        },
        {
          "id": "number",
          "x": 0.09,
          "y": 0.765,
          "layer": "math",
          "en": "Number theory",
          "es": "Teoría de números"
        },
        {
          "id": "physics",
          "x": 0.63,
          "y": 0.785,
          "layer": "core",
          "en": "University physics foundations",
          "es": "Fundamentos de física universitaria"
        },
        {
          "id": "ml",
          "x": 0.285,
          "y": 0.66,
          "layer": "application",
          "en": "Machine learning",
          "es": "Aprendizaje automático"
        },
        {
          "id": "economics",
          "x": 0.08,
          "y": 0.565,
          "layer": "application",
          "en": "Economics & econometrics",
          "es": "Economía y econometría"
        },
        {
          "id": "mechanics",
          "x": 0.425,
          "y": 0.655,
          "layer": "core",
          "en": "Classical mechanics",
          "es": "Mecánica clásica"
        },
        {
          "id": "em",
          "x": 0.7,
          "y": 0.63,
          "layer": "core",
          "en": "Electromagnetism",
          "es": "Electromagnetismo"
        },
        {
          "id": "waves",
          "x": 0.875,
          "y": 0.74,
          "layer": "core",
          "en": "Waves & optics",
          "es": "Ondas y óptica"
        },
        {
          "id": "thermo",
          "x": 0.925,
          "y": 0.565,
          "layer": "core",
          "en": "Thermodynamics",
          "es": "Termodinámica"
        },
        {
          "id": "special",
          "x": 0.37,
          "y": 0.46,
          "layer": "modern",
          "en": "Special relativity",
          "es": "Relatividad especial"
        },
        {
          "id": "quantum",
          "x": 0.65,
          "y": 0.435,
          "layer": "modern",
          "en": "Quantum mechanics",
          "es": "Mecánica cuántica"
        },
        {
          "id": "statphysics",
          "x": 0.865,
          "y": 0.33,
          "layer": "modern",
          "en": "Statistical physics",
          "es": "Física estadística"
        },
        {
          "id": "diffgeometry",
          "x": 0.195,
          "y": 0.39,
          "layer": "math",
          "en": "Differential geometry",
          "es": "Geometría diferencial"
        },
        {
          "id": "crypto",
          "x": 0.07,
          "y": 0.23,
          "layer": "application",
          "en": "Cryptography",
          "es": "Criptografía"
        },
        {
          "id": "general",
          "x": 0.33,
          "y": 0.245,
          "layer": "frontier",
          "en": "General relativity",
          "es": "Relatividad general"
        },
        {
          "id": "nuclear",
          "x": 0.53,
          "y": 0.26,
          "layer": "frontier",
          "en": "Nuclear physics",
          "es": "Física nuclear"
        },
        {
          "id": "plasma",
          "x": 0.945,
          "y": 0.16,
          "layer": "frontier",
          "en": "Plasma physics",
          "es": "Física del plasma"
        },
        {
          "id": "condensed",
          "x": 0.805,
          "y": 0.115,
          "layer": "frontier",
          "en": "Condensed matter physics",
          "es": "Física de la materia condensada"
        },
        {
          "id": "qft",
          "x": 0.49,
          "y": 0.125,
          "layer": "frontier",
          "en": "Quantum field theory",
          "es": "Teoría cuántica de campos"
        },
        {
          "id": "astro",
          "x": 0.16,
          "y": 0.08,
          "layer": "frontier",
          "en": "Astrophysics",
          "es": "Astrofísica"
        },
        {
          "id": "particle",
          "x": 0.66,
          "y": 0.025,
          "layer": "frontier",
          "en": "Particle physics",
          "es": "Física de partículas"
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
  ]
};
if(typeof module==='object'&&module.exports)module.exports=data;else root.QuidenceKnowledgeMapData=data;
})(typeof window==='object'?window:globalThis);
