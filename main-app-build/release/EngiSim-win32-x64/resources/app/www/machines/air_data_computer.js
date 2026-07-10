import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Custom Glowing Materials
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.8
  });
  
  const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff4400,
    emissiveIntensity: 2.0,
    roughness: 0.1,
    metalness: 0.5
  });

  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.8
  });

  const neonRed = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2.0,
    roughness: 0.3,
    metalness: 0.8
  });

  // 1. Outer Chassis (Base and Cover)
  const chassisGeo = new THREE.BoxGeometry(4, 1.5, 3);
  const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
  group.add(chassisMesh);
  parts.push({
    name: 'Main Chassis',
    mesh: chassisMesh,
    description: 'Ruggedized aluminum-alloy casing designed to withstand extreme vibration, temperature fluctuations, and electromagnetic interference in the avionics bay.',
    material: 'darkSteel',
    function: 'Houses and protects delicate computational components and pressure sensors.',
    assemblyOrder: 1,
    connections: ['Mounting Brackets', 'Pitot-Static Connectors', 'Data Bus Interface'],
    failureEffect: 'If compromised, internal components may be exposed to environmental hazards leading to catastrophic failure.',
    cascadeFailures: ['All internal components'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -2, z: 0 }
  });

  // 2. Main Logic Board
  const pcbGeo = new THREE.BoxGeometry(3.6, 0.1, 2.6);
  const pcbMesh = new THREE.Mesh(pcbGeo, new THREE.MeshStandardMaterial({ color: 0x0a3a15, roughness: 0.6, metalness: 0.1 }));
  pcbMesh.position.set(0, -0.6, 0);
  group.add(pcbMesh);
  parts.push({
    name: 'Main Logic Board (PCB)',
    mesh: pcbMesh,
    description: 'High-density multi-layer printed circuit board serving as the backbone for the central processors and memory modules.',
    material: 'custom green',
    function: 'Routes digital signals between pressure transducers, processors, and the external data bus.',
    assemblyOrder: 2,
    connections: ['Microprocessor', 'Data Bus Interface', 'Power Supply Module'],
    failureEffect: 'Loss of communication between components. ADC outputs invalid or no data.',
    cascadeFailures: ['Flight Management System', 'Autopilot', 'Cockpit Displays'],
    originalPosition: { x: 0, y: -0.6, z: 0 },
    explodedPosition: { x: 0, y: -1, z: 0 }
  });

  // 3. Central Processing Unit (Microprocessor)
  const cpuGeo = new THREE.BoxGeometry(0.8, 0.15, 0.8);
  const cpuMesh = new THREE.Mesh(cpuGeo, chrome);
  cpuMesh.position.set(-0.5, -0.5, 0);
  group.add(cpuMesh);
  parts.push({
    name: 'Central Microprocessor',
    mesh: cpuMesh,
    description: 'Dual-redundant high-speed computational core responsible for calculating true airspeed, Mach number, and altitude.',
    material: 'chrome',
    function: 'Executes complex thermodynamic and fluid dynamic equations based on raw pressure inputs.',
    assemblyOrder: 3,
    connections: ['Main Logic Board', 'Heatsink'],
    failureEffect: 'Complete loss of air data computation. System triggers critical failure alarms.',
    cascadeFailures: ['Flight Control Computers'],
    originalPosition: { x: -0.5, y: -0.5, z: 0 },
    explodedPosition: { x: -0.5, y: 1.5, z: 0 }
  });

  // 4. Glowing Data Traces
  const traceGeo = new THREE.PlaneGeometry(1.5, 0.05);
  const traceMesh = new THREE.Mesh(traceGeo, neonBlue);
  traceMesh.rotation.x = -Math.PI / 2;
  traceMesh.position.set(0.5, -0.54, 0);
  group.add(traceMesh);
  parts.push({
    name: 'High-Speed Data Traces',
    mesh: traceMesh,
    description: 'Gold-plated data lanes transmitting converted digital signals at gigabit speeds.',
    material: 'neonBlue',
    function: 'Facilitates ultra-low latency communication within the PCB.',
    assemblyOrder: 4,
    connections: ['Microprocessor', 'A/D Converters'],
    failureEffect: 'Data corruption or high latency.',
    cascadeFailures: ['None'],
    originalPosition: { x: 0.5, y: -0.54, z: 0 },
    explodedPosition: { x: 0.5, y: 1, z: 1 }
  });

  // 5. Pitot Pressure Transducer (Dynamic Pressure)
  const pitotTransGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
  const pitotTransMesh = new THREE.Mesh(pitotTransGeo, aluminum);
  pitotTransMesh.position.set(1.2, 0, 0.8);
  group.add(pitotTransMesh);
  parts.push({
    name: 'Pitot Pressure Transducer',
    mesh: pitotTransMesh,
    description: 'High-precision solid-state piezoresistive sensor converting dynamic ram air pressure into electrical signals.',
    material: 'aluminum',
    function: 'Measures total pressure (Pt) to calculate indicated and true airspeed.',
    assemblyOrder: 5,
    connections: ['Pitot Inlet Port', 'A/D Converter'],
    failureEffect: 'Loss of airspeed indications. Risk of aerodynamic stall or overspeed.',
    cascadeFailures: ['Autothrottle System', 'Mach Trim'],
    originalPosition: { x: 1.2, y: 0, z: 0.8 },
    explodedPosition: { x: 2.5, y: 0.5, z: 1.5 }
  });

  // Glowing core inside pitot transducer
  const pitotCoreGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const pitotCoreMesh = new THREE.Mesh(pitotCoreGeo, neonOrange);
  pitotCoreMesh.position.set(1.2, 0.3, 0.8);
  group.add(pitotCoreMesh);

  // 6. Static Pressure Transducer
  const staticTransGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
  const staticTransMesh = new THREE.Mesh(staticTransGeo, aluminum);
  staticTransMesh.position.set(1.2, 0, -0.8);
  group.add(staticTransMesh);
  parts.push({
    name: 'Static Pressure Transducer',
    mesh: staticTransMesh,
    description: 'Highly sensitive sensor measuring ambient atmospheric pressure using a resonating silicon diaphragm.',
    material: 'aluminum',
    function: 'Measures static pressure (Ps) to determine barometric altitude and vertical speed.',
    assemblyOrder: 6,
    connections: ['Static Inlet Port', 'A/D Converter'],
    failureEffect: 'Loss of altitude and vertical speed data. Altitude alerts become inoperative.',
    cascadeFailures: ['TCAS (Traffic Collision Avoidance System)', 'Pressurization Controller'],
    originalPosition: { x: 1.2, y: 0, z: -0.8 },
    explodedPosition: { x: 2.5, y: 0.5, z: -1.5 }
  });

  // Glowing core inside static transducer
  const staticCoreGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const staticCoreMesh = new THREE.Mesh(staticCoreGeo, neonGreen);
  staticCoreMesh.position.set(1.2, 0.3, -0.8);
  group.add(staticCoreMesh);

  // 7. ARINC 429 Data Bus Connector
  const connectorGeo = new THREE.BoxGeometry(0.2, 0.6, 1.2);
  const connectorMesh = new THREE.Mesh(connectorGeo, plastic);
  connectorMesh.position.set(-1.9, 0, 0);
  group.add(connectorMesh);
  parts.push({
    name: 'ARINC 429 Data Bus Interface',
    mesh: connectorMesh,
    description: 'Aviation standard data bus connector featuring twisted-pair shielding.',
    material: 'plastic',
    function: 'Transmits computed air data out to display units, flight management systems, and flight data recorders.',
    assemblyOrder: 7,
    connections: ['Main Logic Board', 'Aircraft Wiring Harness'],
    failureEffect: 'ADC computes correctly but cannot broadcast data to the rest of the aircraft.',
    cascadeFailures: ['Primary Flight Displays'],
    originalPosition: { x: -1.9, y: 0, z: 0 },
    explodedPosition: { x: -3.5, y: 0, z: 0 }
  });
  
  // 8. Power Supply Module
  const powerGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const powerMesh = new THREE.Mesh(powerGeo, copper);
  powerMesh.position.set(-0.8, 0.1, -0.8);
  group.add(powerMesh);
  parts.push({
    name: 'Power Conditioning Unit',
    mesh: powerMesh,
    description: 'Converts aircraft 115V AC power into stable, clean DC voltages for the logic board and sensors.',
    material: 'copper',
    function: 'Provides uninterruptible, filtered power to all ADC components.',
    assemblyOrder: 8,
    connections: ['Main Logic Board', 'Aircraft Power Bus'],
    failureEffect: 'Complete shutdown of the ADC unit.',
    cascadeFailures: ['All ADC subsystems'],
    originalPosition: { x: -0.8, y: 0.1, z: -0.8 },
    explodedPosition: { x: -1.5, y: 2, z: -2 }
  });

  // 9. Status LED indicator
  const ledGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const ledMesh = new THREE.Mesh(ledGeo, neonGreen);
  ledMesh.position.set(-1.9, 0.5, 1.2);
  group.add(ledMesh);
  parts.push({
    name: 'Diagnostic Status LED',
    mesh: ledMesh,
    description: 'External visual indicator showing the operational state of the ADC during maintenance.',
    material: 'neonGreen',
    function: 'Emits continuous green for nominal operation, flashing blue while processing data.',
    assemblyOrder: 9,
    connections: ['Main Logic Board'],
    failureEffect: 'Inability to quickly diagnose unit status externally.',
    cascadeFailures: [],
    originalPosition: { x: -1.9, y: 0.5, z: 1.2 },
    explodedPosition: { x: -3.5, y: 1.5, z: 2 }
  });

  const description = "The Air Data Computer (ADC) is the digital heart of modern aircraft pitot-static systems. It receives raw physical pressure inputs (total pressure from pitot tubes and ambient pressure from static ports) and temperature data. High-precision solid-state transducers convert these pressures into electrical signals. The dual-redundant microprocessors execute complex fluid dynamic algorithms to compute Indicated Airspeed (IAS), True Airspeed (TAS), Mach number, Barometric Altitude, and Vertical Speed. This digital data is then broadcasted across the avionics data bus (e.g., ARINC 429) to glass cockpit displays, flight control computers, and the autopilot. The ADC replaced older mechanical altimeters and airspeed indicators, offering drastically improved accuracy, reliability, and data integration.";

  const quizQuestions = [
    {
      question: "Which two primary physical measurements are used by the ADC to calculate airspeed?",
      options: [
        "Temperature and Humidity",
        "Dynamic Pressure and Static Pressure",
        "Altitude and Vertical Speed",
        "Engine Thrust and Drag"
      ],
      correct: 1,
      explanation: "Airspeed is determined by measuring the difference between the total (dynamic + static) pressure from the pitot tube and the ambient static pressure from the static ports.",
      difficulty: "Medium"
    },
    {
      question: "What happens if the Static Pressure Transducer fails?",
      options: [
        "Only altitude data is lost.",
        "The aircraft loses altitude, vertical speed, and airspeed data.",
        "The aircraft engine shuts down.",
        "The autopilot automatically takes over."
      ],
      correct: 1,
      explanation: "A static pressure failure affects altitude, vertical speed, and airspeed computations, because airspeed calculation relies on both pitot (total) and static pressure.",
      difficulty: "Hard"
    },
    {
      question: "What is the function of the ARINC 429 Interface in the ADC?",
      options: [
        "To cool the microprocessor.",
        "To convert AC power to DC power.",
        "To broadcast computed air data to other aircraft systems.",
        "To heat the pitot tubes to prevent icing."
      ],
      correct: 2,
      explanation: "The ARINC 429 (or similar) data bus interface transmits the processed digital data from the ADC to other systems like the Primary Flight Displays and Flight Management System.",
      difficulty: "Easy"
    }
  ];

  function animate(time, speed, meshes) {
    // Pulse the data traces
    if (traceMesh && traceMesh.material) {
      const pulse = (Math.sin(time * speed * 5) + 1) / 2;
      traceMesh.material.emissiveIntensity = 0.5 + pulse * 2.0;
    }

    // Animate the transducer glowing cores to simulate data processing
    if (pitotCoreMesh) {
        const pitotPulse = (Math.sin(time * speed * 10) + 1) / 2;
        pitotCoreMesh.scale.set(1 + pitotPulse * 0.2, 1 + pitotPulse * 0.2, 1 + pitotPulse * 0.2);
    }
    
    if (staticCoreMesh) {
        const staticPulse = (Math.sin(time * speed * 8 + Math.PI) + 1) / 2;
        staticCoreMesh.scale.set(1 + staticPulse * 0.2, 1 + staticPulse * 0.2, 1 + staticPulse * 0.2);
    }

    // Blink the status LED
    if (ledMesh) {
      if (Math.sin(time * speed * 2) > 0.8) {
         ledMesh.material = neonGreen; // Normal Status
      } else {
         ledMesh.material = neonBlue; // Processing Status
      }
    }
  }

  return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirDataComputer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
