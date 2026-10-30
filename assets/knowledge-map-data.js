(function(root){'use strict';
const data={
  "words": {
    "en": {
      "title": "Mathematics & Physics Knowledge Map",
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
      "title": "Mapa de conocimientos de matemáticas y física",
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
    {
      "id": "number-theory",
      "chapter": 1,
      "node": "number",
      "en": "Number Theory",
      "es": "Teoría de números",
      "scope": {
        "en": "Ten bilingual projects · Proof review stays open",
        "es": "Diez proyectos bilingües · Las demostraciones quedan pendientes de revisión"
      },
      "module": "number-theory"
    },
    {
      "id": "discrete-math",
      "chapter": 1,
      "node": "proof",
      "en": "Discrete Mathematics",
      "es": "Matemáticas discretas",
      "scope": {
        "en": "Ten bilingual projects on graphs, counting, recurrences and induction",
        "es": "Diez proyectos bilingües sobre grafos, conteo, recurrencias e inducción"
      },
      "module": "discrete-math"
    },
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
      "id": "basic-logic",
      "chapter": 0,
      "node": "logic",
      "en": "Basic Logic",
      "es": "Lógica básica",
      "scope": {
        "en": "Statements, conditionals, valid arguments and syllogisms",
        "es": "Proposiciones, condicionales, argumentos válidos y silogismos"
      },
      "module": "basic-logic"
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
      "id": "coordinate-geometry",
      "chapter": 0,
      "node": "coordinate",
      "en": "Coordinate Geometry",
      "es": "Geometría analítica",
      "scope": {
        "en": "Four lessons · Two guided projects · Foundation and understanding checks",
        "es": "Cuatro lecciones · Dos proyectos guiados · Comprobaciones de fundamentos y de comprensión"
      },
      "module": "coordinate-geometry"
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
    },
    {
      "id": "gametheory",
      "chapter": 1,
      "node": "gametheory",
      "en": "Game Theory Foundations",
      "es": "Fundamentos de teoría de juegos",
      "scope": {
        "en": "Four English lessons · 15-question foundation check",
        "es": "Cuatro lecciones en inglés · Evaluación de fundamentos con 15 preguntas"
      },
      "module": "ac01"
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
    ],
    "gametheory": [
      "gametheory"
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
          "id": "logic",
          "x": 0.31,
          "y": 0.33,
          "layer": "algebra",
          "en": "Logic",
          "es": "Lógica"
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
          "es": "Demostración y matemáticas discretas"
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
          "en": "Proof & discrete math",
          "es": "Demostración y matemáticas discretas"
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
        },
        {
          "id": "gametheory",
          "x": 0.875,
          "y": 0.665,
          "layer": "applied",
          "en": "Game theory",
          "es": "Teoría de juegos"
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
  ],
  "previews": {
    "operations": {
      "en": "Combine and compare numbers using addition, subtraction, multiplication and division.",
      "es": "Combina y compara números mediante suma, resta, multiplicación y división.",
      "relatedModule": "pre-algebra"
    },
    "fractions": {
      "en": "Fractions describe parts of a whole; ratios compare quantities, including quantities with different units.",
      "es": "Las fracciones describen partes de un todo; las razones comparan cantidades, incluso con distintas unidades.",
      "relatedModule": "pre-algebra"
    },
    "signed": {
      "en": "Positive and negative numbers describe positions, changes and opposite directions relative to zero.",
      "es": "Los números positivos y negativos describen posiciones, cambios y sentidos opuestos respecto de cero.",
      "relatedModule": "pre-algebra"
    },
    "shapes": {
      "en": "Describe figures and measure lengths, angles, areas and volumes.",
      "es": "Describe figuras y mide longitudes, ángulos, áreas y volúmenes.",
      "relatedModule": "geometry"
    },
    "prealgebra": {
      "en": "Use variables and expressions to describe numerical relationships and prepare for equations.",
      "es": "Usa variables y expresiones para describir relaciones numéricas y prepararte para las ecuaciones.",
      "relatedModule": "pre-algebra"
    },
    "data": {
      "en": "Use tables and graphs to represent data, compare patterns and question what a display shows.",
      "es": "Usa tablas y gráficas para representar datos, comparar patrones y cuestionar lo que muestra una imagen.",
      "relatedModule": "ae01"
    },
    "algebra1": {
      "en": "Model relationships with equations, linear functions, systems and introductory quadratics.",
      "es": "Modela relaciones con ecuaciones, funciones lineales, sistemas y cuadráticas introductorias.",
      "relatedModule": "algebra-1"
    },
    "geometry": {
      "en": "Study shapes, angles and spatial relationships, and explain why geometric claims hold.",
      "es": "Estudia figuras, ángulos y relaciones espaciales, y explica por qué se cumplen las afirmaciones geométricas.",
      "relatedModule": "geometry"
    },
    "coordinate": {
      "en": "Use coordinates and equations to connect geometric figures with algebra.",
      "es": "Usa coordenadas y ecuaciones para conectar figuras geométricas con el álgebra.",
      "relatedModule": "coordinate-geometry"
    },
    "probability": {
      "en": "Describe uncertainty by studying events, their possible outcomes and their likelihoods.",
      "es": "Describe la incertidumbre mediante sucesos, resultados posibles y sus probabilidades.",
      "relatedModule": "ae01"
    },
    "algebra2": {
      "en": "Explore polynomial, rational, exponential and logarithmic relationships and their restrictions.",
      "es": "Explora relaciones polinómicas, racionales, exponenciales y logarítmicas y sus restricciones.",
      "relatedModule": "algebra-2"
    },
    "logic": {
      "en": "Decide when statements are true, test whether a conclusion follows, and spot common fallacies.",
      "es": "Decide cuándo una proposición es verdadera, comprueba si una conclusión se deduce y reconoce falacias comunes.",
      "relatedModule": "basic-logic"
    },
    "trig": {
      "en": "Connect angles, triangles and periodic functions such as sine and cosine.",
      "es": "Relaciona ángulos, triángulos y funciones periódicas como seno y coseno.",
      "relatedModule": "af01"
    },
    "precalculus": {
      "en": "Connect functions, graphs, trigonometry and growth before studying change with calculus.",
      "es": "Relaciona funciones, gráficas, trigonometría y crecimiento antes de estudiar el cambio con cálculo.",
      "relatedModule": "af01"
    },
    "linear": {
      "en": "Study vectors, linear combinations and matrices as tools for describing linear relationships.",
      "es": "Estudia vectores, combinaciones lineales y matrices para describir relaciones lineales.",
      "relatedModule": "ab01"
    },
    "statistics": {
      "en": "Describe variation in data and use evidence to investigate questions about a population.",
      "es": "Describe la variación en los datos y usa evidencia para investigar preguntas sobre una población.",
      "relatedModule": "ae01"
    },
    "calculus": {
      "en": "Use derivatives to study instantaneous change and integrals to study accumulation.",
      "es": "Usa derivadas para estudiar el cambio instantáneo e integrales para estudiar la acumulación.",
      "relatedModule": "ad01"
    },
    "proof": {
      "en": "Build arguments from definitions and assumptions; use examples and counterexamples to test claims.",
      "es": "Construye argumentos desde definiciones y supuestos; usa ejemplos y contraejemplos para examinar afirmaciones.",
      "relatedModule": "discrete-math"
    },
    "ode": {
      "en": "Relate an unknown function of one variable to its derivatives to model how a quantity changes.",
      "es": "Relaciona una función desconocida de una variable con sus derivadas para modelar cómo cambia una cantidad.",
      "relatedModule": "ad01"
    },
    "number": {
      "en": "Explore integers, primes, divisibility and congruences, often through proof.",
      "es": "Explora enteros, números primos, divisibilidad y congruencias, a menudo mediante demostraciones.",
      "relatedModule": "number-theory"
    },
    "advancedlinear": {
      "en": "Study vector spaces and linear maps, including eigenvalues, bases and structure beyond basic matrix calculations.",
      "es": "Estudia espacios vectoriales y aplicaciones lineales, incluidos valores propios, bases y estructuras más allá del cálculo matricial básico.",
      "relatedModule": "ab01"
    },
    "multivariable": {
      "en": "Extend derivatives and integrals to functions of several variables, curves and surfaces.",
      "es": "Extiende derivadas e integrales a funciones de varias variables, curvas y superficies.",
      "relatedModule": "ad01"
    },
    "abstract": {
      "en": "Study algebraic structures and the rules their operations obey, rather than only particular numbers.",
      "es": "Estudia estructuras algebraicas y las reglas de sus operaciones, más allá de números particulares.",
      "relatedModule": "number-theory"
    },
    "real": {
      "en": "Make ideas about real numbers, limits, continuity, derivatives and integrals precise through proof.",
      "es": "Da precisión a las ideas sobre números reales, límites, continuidad, derivadas e integrales mediante demostraciones.",
      "relatedModule": "ad01"
    },
    "numerical": {
      "en": "Design and analyze approximate computational methods, including their errors and stability.",
      "es": "Diseña y analiza métodos de cálculo aproximados, incluidos sus errores y estabilidad.",
      "relatedModule": "ad01"
    },
    "groups": {
      "en": "Study operations with identity elements and inverses, including structures that describe symmetry.",
      "es": "Estudia operaciones con elemento identidad e inversos, incluidas estructuras que describen simetrías.",
      "relatedModule": "number-theory"
    },
    "rings": {
      "en": "Study systems with addition and multiplication, and how the availability of division changes their structure.",
      "es": "Estudia sistemas con suma y multiplicación, y cómo la posibilidad de dividir cambia su estructura.",
      "relatedModule": "number-theory"
    },
    "optimization": {
      "en": "Find choices that maximize or minimize an objective, often while satisfying constraints.",
      "es": "Busca decisiones que maximicen o minimicen un objetivo, a menudo bajo restricciones.",
      "relatedModule": "ad01"
    },
    "topology": {
      "en": "Study continuity and properties of spaces that survive suitable continuous deformations.",
      "es": "Estudia la continuidad y propiedades de los espacios que se conservan bajo deformaciones continuas adecuadas.",
      "relatedModule": "geometry"
    },
    "complex": {
      "en": "Study functions of complex numbers, where differentiability creates strong geometric and analytic relationships.",
      "es": "Estudia funciones de números complejos, cuya diferenciabilidad genera relaciones geométricas y analíticas fuertes.",
      "relatedModule": "ad01"
    },
    "measure": {
      "en": "Develop notions of size and integration that handle more general sets and functions.",
      "es": "Desarrolla nociones de tamaño e integración para conjuntos y funciones más generales.",
      "relatedModule": "ad01"
    },
    "pde": {
      "en": "Relate functions of several variables to partial derivatives to model phenomena such as heat and waves.",
      "es": "Relaciona funciones de varias variables con derivadas parciales para modelar fenómenos como el calor y las ondas.",
      "relatedModule": "ad01"
    },
    "algebraicnumber": {
      "en": "Use algebraic structures to study number systems extending the integers and rational numbers.",
      "es": "Usa estructuras algebraicas para estudiar sistemas numéricos que extienden los enteros y los racionales.",
      "relatedModule": "number-theory"
    },
    "functional": {
      "en": "Study spaces of functions and operators, often using ideas from linear algebra and analysis.",
      "es": "Estudia espacios de funciones y operadores, a menudo con ideas del álgebra lineal y el análisis.",
      "relatedModule": "ab01"
    },
    "diffgeometry": {
      "en": "Use calculus to study curves, surfaces and more general curved spaces.",
      "es": "Usa cálculo para estudiar curvas, superficies y espacios curvos más generales.",
      "relatedModule": "ad01"
    },
    "probtheory": {
      "en": "Build mathematical models of random variables, distributions and relationships between random events.",
      "es": "Construye modelos matemáticos de variables aleatorias, distribuciones y relaciones entre sucesos aleatorios.",
      "relatedModule": "ae01"
    },
    "harmonic": {
      "en": "Study functions through oscillations and frequency components, including Fourier methods.",
      "es": "Estudia funciones mediante oscilaciones y componentes de frecuencia, incluidos métodos de Fourier.",
      "relatedModule": "ad01"
    },
    "mathstats": {
      "en": "Use probability models to study estimation, uncertainty and inference from data.",
      "es": "Usa modelos de probabilidad para estudiar estimación, incertidumbre e inferencia a partir de datos.",
      "relatedModule": "ae01"
    },
    "gametheory": {
      "en": "Study strategic choices when each participant's outcome depends on other participants' choices.",
      "es": "Estudia decisiones estratégicas cuando el resultado de cada participante depende de las decisiones de otros.",
      "relatedModule": "ac01"
    },
    "calclinear": {
      "en": "Combine tools for continuous change with vectors and linear models in more advanced applications.",
      "es": "Combina herramientas del cambio continuo con vectores y modelos lineales en aplicaciones avanzadas.",
      "relatedModule": "ad01"
    },
    "physics": {
      "en": "Build models of motion, forces, energy and fields, and compare their predictions with evidence.",
      "es": "Construye modelos de movimiento, fuerzas, energía y campos, y compara sus predicciones con la evidencia.",
      "relatedModule": "physics-1"
    },
    "ml": {
      "en": "Fit models to examples and examine how well they make predictions on new data.",
      "es": "Ajusta modelos a ejemplos y examina qué tan bien predicen datos nuevos.",
      "relatedModule": "ae01"
    },
    "economics": {
      "en": "Study choices and interactions under constraints; econometrics uses data to estimate and test economic relationships.",
      "es": "Estudia decisiones e interacciones bajo restricciones; la econometría usa datos para estimar y examinar relaciones económicas.",
      "relatedModule": "ae01"
    },
    "mechanics": {
      "en": "Model how forces, motion, momentum and energy relate in physical systems.",
      "es": "Modela cómo se relacionan fuerzas, movimiento, momento lineal y energía en sistemas físicos.",
      "relatedModule": "physics-1"
    },
    "em": {
      "en": "Study electric and magnetic fields, charges, currents and how they interact.",
      "es": "Estudia campos eléctricos y magnéticos, cargas, corrientes y sus interacciones.",
      "relatedModule": "physics-2"
    },
    "waves": {
      "en": "Study disturbances that propagate and how wave ideas help explain light and other phenomena.",
      "es": "Estudia perturbaciones que se propagan y cómo las ondas ayudan a explicar la luz y otros fenómenos.",
      "relatedModule": "physics-2"
    },
    "thermo": {
      "en": "Relate temperature, energy transfer, work and constraints on physical processes.",
      "es": "Relaciona temperatura, transferencia de energía, trabajo y restricciones de los procesos físicos.",
      "relatedModule": "physics-2"
    },
    "special": {
      "en": "Study space and time when relative motion matters and the speed of light is invariant in inertial frames.",
      "es": "Estudia espacio y tiempo cuando importa el movimiento relativo y la rapidez de la luz es invariante en sistemas inerciales.",
      "relatedModule": "physics-1"
    },
    "quantum": {
      "en": "Use quantum states and probabilities to describe measurements and behavior at atomic and related scales.",
      "es": "Usa estados cuánticos y probabilidades para describir mediciones y comportamiento a escalas atómicas y relacionadas.",
      "relatedModule": "physics-2"
    },
    "statphysics": {
      "en": "Connect the statistical behavior of many microscopic constituents with large-scale physical properties.",
      "es": "Relaciona el comportamiento estadístico de muchos componentes microscópicos con propiedades físicas macroscópicas.",
      "relatedModule": "physics-2"
    },
    "crypto": {
      "en": "Study methods for protecting information and checking authenticity, including mathematical constructions and their limits.",
      "es": "Estudia métodos para proteger información y comprobar autenticidad, incluidas construcciones matemáticas y sus límites.",
      "relatedModule": "number-theory"
    },
    "general": {
      "en": "Describe gravity through the geometry of spacetime and its relationship with matter and energy.",
      "es": "Describe la gravedad mediante la geometría del espacio-tiempo y su relación con materia y energía.",
      "relatedModule": "physics-1"
    },
    "nuclear": {
      "en": "Study atomic nuclei, their structures, interactions and transformations.",
      "es": "Estudia núcleos atómicos, sus estructuras, interacciones y transformaciones.",
      "relatedModule": "physics-2"
    },
    "plasma": {
      "en": "Study ionized matter and collective behavior involving charged particles and electromagnetic fields.",
      "es": "Estudia materia ionizada y comportamiento colectivo de partículas cargadas y campos electromagnéticos.",
      "relatedModule": "physics-2"
    },
    "condensed": {
      "en": "Study the collective behavior and properties of matter such as solids and liquids.",
      "es": "Estudia el comportamiento colectivo y las propiedades de la materia, como sólidos y líquidos.",
      "relatedModule": "physics-2"
    },
    "qft": {
      "en": "Use quantum fields to describe particles and interactions in a framework consistent with special relativity.",
      "es": "Usa campos cuánticos para describir partículas e interacciones en un marco compatible con la relatividad especial.",
      "relatedModule": "physics-2"
    },
    "astro": {
      "en": "Apply physics to stars, galaxies and other astronomical objects and processes.",
      "es": "Aplica física a estrellas, galaxias y otros objetos y procesos astronómicos.",
      "relatedModule": "physics-1"
    },
    "particle": {
      "en": "Study elementary particles and their interactions, using experiments and mathematical models.",
      "es": "Estudia partículas elementales y sus interacciones mediante experimentos y modelos matemáticos.",
      "relatedModule": "physics-2"
    }
  }
};
if(typeof module==='object'&&module.exports)module.exports=data;else root.QuidenceKnowledgeMapData=data;
})(typeof window==='object'?window:globalThis);
