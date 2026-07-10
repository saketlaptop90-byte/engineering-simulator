import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Custom glowing materials
  const glowBlue = new THREE.MeshStandardMaterial({
    color: 0x0088ff,
    emissive: 0x0088ff,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.9,
    metalness: 0.2,
    roughness: 0.1
  });

  const glowCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.6
  });

  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 1.2
  });

  // Base Housing / Volute (Snail shell shape)
  // Approximated by a torus + cylinder
  const housingGroup = new THREE.Group();
  
  const voluteGeo = new THREE.TorusGeometry(3, 1.5, 32, 64, Math.PI * 1.8);
  const voluteMesh = new THREE.Mesh(voluteGeo, darkSteel);
  voluteMesh.position.set(0, 0, 0);
  housingGroup.add(voluteMesh);

  const outletGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
  const outletMesh = new THREE.Mesh(outletGeo, darkSteel);
  outletMesh.position.set(2.8, 2, 0);
  outletMesh.rotation.z = Math.PI / 4;
  housingGroup.add(outletMesh);

  const frontCoverGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.5, 32);
  const frontCoverMesh = new THREE.Mesh(frontCoverGeo, chrome);
  frontCoverMesh.position.set(0, 0, 1.5);
  frontCoverMesh.rotation.x = Math.PI / 2;
  housingGroup.add(frontCoverMesh);
  
  const backCoverGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.5, 32);
  const backCoverMesh = new THREE.Mesh(backCoverGeo, steel);
  backCoverMesh.position.set(0, 0, -1.5);
  backCoverMesh.rotation.x = Math.PI / 2;
  housingGroup.add(backCoverMesh);

  housingGroup.position.set(0, 0, 0);
  group.add(housingGroup);

  parts.push({
    name: "Volute Housing",
    description: "The scroll-shaped outer casing that directs the pressurized air towards the outlet, converting kinetic energy into static pressure.",
    material: "darkSteel, chrome",
    function: "Airflow redirection and pressurization.",
    assemblyOrder: 5,
    connections: ["Outlet Port", "Impeller", "Motor Base"],
    failureEffect: "Air leaks, loss of pressure, increased noise.",
    cascadeFailures: ["Patient hypoxia", "Overworking of motor to compensate"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -5, z: 0 }
  });

  // High-Speed Impeller
  const impellerGroup = new THREE.Group();
  const impellerBaseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
  const impellerBaseMesh = new THREE.Mesh(impellerBaseGeo, glowBlue);
  impellerGroup.add(impellerBaseMesh);

  for (let i = 0; i < 12; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 2.2);
    const bladeMesh = new THREE.Mesh(bladeGeo, glowCyan);
    bladeMesh.position.set(0, 0.7, 0);
    
    const bladePivot = new THREE.Group();
    bladePivot.rotation.y = (i / 12) * Math.PI * 2;
    // Sweep back the blade
    bladeMesh.position.x = 1.2;
    bladeMesh.rotation.y = -Math.PI / 6;
    
    bladePivot.add(bladeMesh);
    impellerGroup.add(bladePivot);
  }
  
  const impellerCapGeo = new THREE.ConeGeometry(1, 1, 32);
  const impellerCapMesh = new THREE.Mesh(impellerCapGeo, chrome);
  impellerCapMesh.position.set(0, 0.6, 0);
  impellerGroup.add(impellerCapMesh);

  impellerGroup.position.set(0, 0, 0.5);
  impellerGroup.rotation.x = Math.PI / 2;
  group.add(impellerGroup);

  parts.push({
    name: "Centrifugal Impeller",
    description: "High-speed rotating bladed disc that draws air in axially and expels it radially.",
    material: "glowBlue, glowCyan",
    function: "Accelerates air to generate positive airway pressure.",
    assemblyOrder: 4,
    connections: ["Motor Shaft", "Volute Housing"],
    failureEffect: "No air flow, severe motor vibration.",
    cascadeFailures: ["Motor bearing destruction", "Housing fracture"],
    originalPosition: { x: 0, y: 0, z: 0.5 },
    explodedPosition: { x: 0, y: 0, z: 8 }
  });

  // Brushless DC Motor
  const motorGroup = new THREE.Group();
  
  const statorGeo = new THREE.CylinderGeometry(2, 2, 2, 32);
  const statorMesh = new THREE.Mesh(statorGeo, copper);
  motorGroup.add(statorMesh);

  const rotorGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.2, 32);
  const rotorMesh = new THREE.Mesh(rotorGeo, steel);
  motorGroup.add(rotorMesh);
  
  const motorHousingGeo = new THREE.CylinderGeometry(2.2, 2.2, 2.5, 32);
  const motorHousingMesh = new THREE.Mesh(motorHousingGeo, aluminum);
  motorGroup.add(motorHousingMesh);

  const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
  motorGroup.add(shaftMesh);

  motorGroup.position.set(0, 0, -2);
  motorGroup.rotation.x = Math.PI / 2;
  group.add(motorGroup);

  parts.push({
    name: "Brushless DC Motor (BLDC)",
    description: "High-RPM, low-noise electric motor that drives the impeller without mechanical brushes.",
    material: "copper, steel, aluminum",
    function: "Provides the rotational kinetic energy for the impeller.",
    assemblyOrder: 2,
    connections: ["Impeller", "Motor Controller Base"],
    failureEffect: "Device fails to power on or maintain RPM.",
    cascadeFailures: ["Overheating", "Control board burnout"],
    originalPosition: { x: 0, y: 0, z: -2 },
    explodedPosition: { x: 0, y: 0, z: -5 }
  });

  // Acoustic Damping Chamber & Intake
  const intakeGroup = new THREE.Group();
  const intakeChamberGeo = new THREE.CylinderGeometry(2.5, 1.5, 2, 32);
  const intakeChamberMesh = new THREE.Mesh(intakeChamberGeo, plastic);
  intakeGroup.add(intakeChamberMesh);

  const filterGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.5, 32);
  const filterMesh = new THREE.Mesh(filterGeo, neonGreen);
  filterMesh.position.y = 1;
  intakeGroup.add(filterMesh);

  intakeGroup.position.set(0, 0, 3);
  intakeGroup.rotation.x = Math.PI / 2;
  group.add(intakeGroup);

  parts.push({
    name: "Acoustic Damping Chamber & Filter",
    description: "Inlet section featuring foam baffling and HEPA/particulate filters to ensure clean, quiet air intake.",
    material: "plastic, neonGreen",
    function: "Reduces intake noise and filters particulates from ambient air.",
    assemblyOrder: 6,
    connections: ["Volute Housing Inlet"],
    failureEffect: "Contaminated air delivered to patient, extreme noise levels.",
    cascadeFailures: ["Impeller fouling", "Motor overheating due to restricted flow"],
    originalPosition: { x: 0, y: 0, z: 3 },
    explodedPosition: { x: 0, y: 0, z: 12 }
  });

  // Vibration Isolation Mounts
  const mountsGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const mountGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const mountMesh = new THREE.Mesh(mountGeo, rubber);
    mountMesh.position.set(
      i % 2 === 0 ? 2 : -2,
      -3,
      i < 2 ? 1 : -3
    );
    mountsGroup.add(mountMesh);
  }
  group.add(mountsGroup);

  parts.push({
    name: "Vibration Isolation Mounts",
    description: "Silicone/rubber dampeners that suspend the motor and housing assembly.",
    material: "rubber",
    function: "Prevents high-frequency motor vibrations from transferring to the outer CPAP chassis.",
    assemblyOrder: 1,
    connections: ["Motor Housing", "External CPAP Chassis"],
    failureEffect: "Loud humming, device 'walking' on the nightstand.",
    cascadeFailures: ["Internal wire chafing", "Circuit board micro-fractures"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -8, z: -2 }
  });

  // Main Controller Board Base
  const pcbGeo = new THREE.BoxGeometry(4, 0.2, 4);
  const pcbMesh = new THREE.Mesh(pcbGeo, tinted);
  pcbMesh.position.set(0, -3.6, -1);
  group.add(pcbMesh);

  parts.push({
    name: "Motor Control PCB",
    description: "High-frequency electronic speed controller (ESC) and pressure feedback loop board.",
    material: "tinted, copper",
    function: "Regulates motor RPM precisely based on pressure sensors to maintain CPAP/BiPAP settings.",
    assemblyOrder: 0,
    connections: ["BLDC Motor", "Power Supply"],
    failureEffect: "Erratic air pressure, total system shutdown.",
    cascadeFailures: ["Motor stator burnout"],
    originalPosition: { x: 0, y: -3.6, z: -1 },
    explodedPosition: { x: 0, y: -12, z: -1 }
  });

  const description = "A high-tech Centrifugal Blower commonly used in CPAP (Continuous Positive Airway Pressure) machines. It utilizes a rapidly spinning impeller within a volute casing to accelerate air, providing the necessary pressure to keep a patient's airways open during sleep. It features acoustic damping, high-speed brushless motors, and precision control to operate quietly and continuously.";

  const quizQuestions = [
    {
      question: "What is the primary function of the Volute Housing in the CPAP blower?",
      options: [
        "To filter out dust and allergens from the air",
        "To convert the kinetic energy of the high-speed air into static pressure",
        "To provide a magnetic field for the brushless motor",
        "To cool down the electronic speed controller"
      ],
      correct: 1,
      explanation: "The volute (scroll-shaped casing) expands gradually, slowing the air down and converting its kinetic energy into static pressure needed for CPAP therapy.",
      difficulty: "medium"
    },
    {
      question: "Why are vibration isolation mounts critical in this medical device?",
      options: [
        "They conduct electricity to the motor",
        "They prevent the high-RPM vibrations from creating excessive noise in the patient's bedroom",
        "They increase the aerodynamic efficiency of the impeller",
        "They filter acoustic frequencies from the air output"
      ],
      correct: 1,
      explanation: "Sleep apnea machines must be extremely quiet. The rubber mounts isolate the rapidly spinning motor from the rigid chassis, preventing resonance and noise.",
      difficulty: "easy"
    },
    {
      question: "What type of motor is standard for a modern CPAP blower, and why?",
      options: [
        "Brushed DC Motor (for simplicity)",
        "Stepper Motor (for precise angle control)",
        "Brushless DC Motor (BLDC) (for high speed, low noise, and long lifespan)",
        "AC Induction Motor (for high torque)"
      ],
      correct: 2,
      explanation: "BLDC motors lack mechanical brushes that wear out and cause sparking/noise. They can achieve the extreme speeds (20,000+ RPM) required for pressure generation quietly and reliably over thousands of hours.",
      difficulty: "medium"
    }
  ];

  function animate(time, speed, meshes) {
    // Meshes array maps to parts added to group.
    // 0: housingGroup
    // 1: impellerGroup
    // 2: motorGroup
    // 3: intakeGroup
    // 4: mountsGroup
    // 5: pcbMesh

    const impeller = meshes[1];
    if (impeller) {
      // Impeller spins very fast
      impeller.rotation.y = time * 20 * speed;
    }

    const motor = meshes[2];
    if (motor) {
      // The rotor inside the motor also spins (it's the second child)
      if (motor.children[1]) {
        motor.children[1].rotation.y = time * 20 * speed;
      }
      // The shaft (4th child) spins
      if (motor.children[3]) {
        motor.children[3].rotation.y = time * 20 * speed;
      }
    }
    
    // Pulsing glow on the filter to simulate air intake
    const intake = meshes[3];
    if (intake && intake.children[1]) {
      const filter = intake.children[1];
      filter.material.emissiveIntensity = 1.2 + Math.sin(time * 5) * 0.4;
    }

    // Volute very slight vibration
    const housing = meshes[0];
    if (housing) {
      housing.position.x = Math.sin(time * 50) * 0.01 * speed;
      housing.position.y = Math.cos(time * 47) * 0.01 * speed;
    }
  }

  return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCPAPMachineBlower() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
