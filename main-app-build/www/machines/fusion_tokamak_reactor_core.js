import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];
  const meshes = {};

  // Custom materials for visual flair
  const plasmaMat = new THREE.MeshPhysicalMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.9,
    transmission: 0.9,
    roughness: 0.1,
  });

  const magneticFieldMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 1.5,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const superConductorMat = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    metalness: 1.0,
    roughness: 0.2,
    emissive: 0xb87333,
    emissiveIntensity: 0.2
  });

  const neonRed = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1.5
  });

  // 1. Central Solenoid
  const solenoidGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 32);
  const centralSolenoid = new THREE.Mesh(solenoidGeo, superConductorMat);
  group.add(centralSolenoid);
  meshes.centralSolenoid = centralSolenoid;
  parts.push({
    name: "Central Solenoid",
    description: "A large superconducting electromagnet at the center of the tokamak.",
    material: "Copper/Superconductor",
    function: "Induces the primary plasma current and provides initial heating.",
    assemblyOrder: 1,
    connections: ["Vacuum Vessel", "Toroidal Field Coils"],
    failureEffect: "Loss of plasma current, leading to immediate plasma disruption.",
    cascadeFailures: ["Thermal quench", "Electromagnetic forces on vessel"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 15, z: 0 }
  });

  // 2. Vacuum Vessel
  const vesselGeo = new THREE.TorusGeometry(6, 2.5, 32, 100);
  const vacuumVessel = new THREE.Mesh(vesselGeo, darkSteel);
  vacuumVessel.rotation.x = Math.PI / 2;
  group.add(vacuumVessel);
  meshes.vacuumVessel = vacuumVessel;
  parts.push({
    name: "Vacuum Vessel",
    description: "The primary containment chamber where the fusion reaction occurs.",
    material: "Dark Steel",
    function: "Provides a high-vacuum environment for the plasma and acts as the first barrier for radiation.",
    assemblyOrder: 2,
    connections: ["Central Solenoid", "Divertor"],
    failureEffect: "Loss of vacuum, plasma instantly extinguishes.",
    cascadeFailures: ["Tritium release", "Breach of primary containment"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -10, z: 0 }
  });

  // 3. Plasma Core
  const plasmaGeo = new THREE.TorusGeometry(6, 1.2, 32, 100);
  const plasmaCore = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaCore.rotation.x = Math.PI / 2;
  group.add(plasmaCore);
  meshes.plasmaCore = plasmaCore;
  parts.push({
    name: "Plasma Core",
    description: "The superheated state of matter where nuclear fusion takes place.",
    material: "Plasma",
    function: "Fuses isotopes (Deuterium/Tritium) to release immense energy.",
    assemblyOrder: 3,
    connections: ["Magnetic Fields"],
    failureEffect: "Fusion reaction stops, cooling occurs rapidly.",
    cascadeFailures: ["None"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 0 }
  });

  // 4. Toroidal Field Coils (16 of them)
  const toroidalCoilsGroup = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const coilGeo = new THREE.TorusGeometry(2.7, 0.4, 16, 50);
    const coil = new THREE.Mesh(coilGeo, chrome);
    coil.position.set(Math.cos(angle) * 6, 0, Math.sin(angle) * 6);
    coil.rotation.y = -angle;
    toroidalCoilsGroup.add(coil);
  }
  group.add(toroidalCoilsGroup);
  meshes.toroidalCoilsGroup = toroidalCoilsGroup;
  parts.push({
    name: "Toroidal Field Coils",
    description: "Massive D-shaped superconducting coils surrounding the vacuum vessel.",
    material: "Chrome/Superconductor",
    function: "Generate the primary magnetic field that confines the plasma in a toroidal shape.",
    assemblyOrder: 4,
    connections: ["Vacuum Vessel", "Poloidal Coils"],
    failureEffect: "Plasma escapes confinement and strikes the vessel walls.",
    cascadeFailures: ["Melting of first wall", "Major disruption"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 20, y: 0, z: 20 }
  });

  // 5. Poloidal Field Coils
  const poloidalCoilsGroup = new THREE.Group();
  const pfRadii = [3, 9, 9, 3];
  const pfHeights = [5, 3, -3, -5];
  for (let i = 0; i < 4; i++) {
    const pfGeo = new THREE.TorusGeometry(pfRadii[i], 0.3, 16, 100);
    const pfCoil = new THREE.Mesh(pfGeo, superConductorMat);
    pfCoil.rotation.x = Math.PI / 2;
    pfCoil.position.y = pfHeights[i];
    poloidalCoilsGroup.add(pfCoil);
  }
  group.add(poloidalCoilsGroup);
  meshes.poloidalCoilsGroup = poloidalCoilsGroup;
  parts.push({
    name: "Poloidal Field Coils",
    description: "Horizontal ring-shaped coils located outside the toroidal field coils.",
    material: "Copper/Superconductor",
    function: "Shape and position the plasma, preventing it from touching the walls.",
    assemblyOrder: 5,
    connections: ["Toroidal Field Coils"],
    failureEffect: "Plasma drifts vertically or horizontally, losing stability.",
    cascadeFailures: ["Plasma-wall interaction", "Quench of TF coils"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -20, y: 0, z: -20 }
  });

  // 6. Divertor
  const divertorGeo = new THREE.TorusGeometry(5.8, 0.8, 16, 100);
  const divertor = new THREE.Mesh(divertorGeo, steel);
  divertor.rotation.x = Math.PI / 2;
  divertor.position.y = -2.2;
  group.add(divertor);
  meshes.divertor = divertor;
  parts.push({
    name: "Divertor",
    description: "Located at the bottom of the vacuum vessel, designed to handle extreme heat.",
    material: "Tungsten/Steel",
    function: "Extracts heat and helium ash (exhaust) from the fusion reaction.",
    assemblyOrder: 6,
    connections: ["Vacuum Vessel"],
    failureEffect: "Accumulation of impurities in plasma, extinguishing the reaction.",
    cascadeFailures: ["Melting of divertor plates"],
    originalPosition: { x: 0, y: -2.2, z: 0 },
    explodedPosition: { x: 0, y: -15, z: 0 }
  });

  // 7. Magnetic Field Visualization (Rotating Wireframe Torus)
  const magFieldGeo = new THREE.TorusGeometry(6.2, 1.8, 16, 64);
  const magneticField = new THREE.Mesh(magFieldGeo, magneticFieldMat);
  magneticField.rotation.x = Math.PI / 2;
  group.add(magneticField);
  meshes.magneticField = magneticField;

  // 8. Cryostat
  const cryostatGeo = new THREE.CylinderGeometry(11, 11, 14, 32, 1, true);
  const cryostatMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.15,
    wireframe: true
  });
  const cryostat = new THREE.Mesh(cryostatGeo, cryostatMat);
  group.add(cryostat);
  meshes.cryostat = cryostat;
  parts.push({
    name: "Cryostat",
    description: "A large vacuum-tight container surrounding the entire tokamak.",
    material: "Steel/Glass",
    function: "Provides a super-cool vacuum environment for the superconducting coils.",
    assemblyOrder: 7,
    connections: ["External Environment"],
    failureEffect: "Superconducting coils warm up and lose superconductivity.",
    cascadeFailures: ["Massive quench", "Explosive boiling of liquid helium"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 25, z: 0 }
  });

  // Description
  const description = "The Fusion Tokamak Reactor Core utilizes immense magnetic fields to confine and shape superheated plasma, achieving temperatures hotter than the sun to facilitate nuclear fusion.";

  // Quiz Questions
  const quizQuestions = [
    {
      question: "Which component is responsible for extracting helium ash and excess heat from the plasma?",
      options: ["Central Solenoid", "Divertor", "Toroidal Field Coils", "Cryostat"],
      correct: 1,
      explanation: "The divertor acts as the 'exhaust' system for the reactor, located at the bottom of the vessel to handle high heat fluxes and remove impurities.",
      difficulty: "Medium"
    },
    {
      question: "What is the main function of the Toroidal Field Coils?",
      options: ["To heat the plasma", "To shape the plasma vertically", "To provide the primary magnetic confinement", "To maintain vacuum"],
      correct: 2,
      explanation: "The D-shaped Toroidal Field Coils generate the primary toroidal magnetic field that traps the plasma in a donut shape.",
      difficulty: "Hard"
    },
    {
      question: "Why does the Central Solenoid need to be superconducting?",
      options: ["To look cool", "To carry immense electrical currents without resistance", "To reflect radiation", "To spin the plasma"],
      correct: 1,
      explanation: "Superconducting materials have zero electrical resistance at ultra-low temperatures, allowing them to carry the massive currents required to generate strong magnetic fields without melting.",
      difficulty: "Easy"
    }
  ];

  let timeElapsed = 0;

  // Animate function
  function animate(time, speed, meshesObj) {
    const delta = (time - timeElapsed) * speed;
    timeElapsed = time;

    // Pulsing plasma
    if (meshes.plasmaCore) {
      meshes.plasmaCore.material.emissiveIntensity = 2.0 + Math.sin(time * 3 * speed) * 0.5;
      meshes.plasmaCore.rotation.z += 0.01 * speed;
    }

    // Rotating magnetic field visualization
    if (meshes.magneticField) {
      meshes.magneticField.rotation.z -= 0.02 * speed;
      meshes.magneticField.material.opacity = 0.3 + Math.sin(time * 5 * speed) * 0.1;
    }

    // Poloidal coils pulsing
    if (meshes.poloidalCoilsGroup) {
      meshes.poloidalCoilsGroup.children.forEach((coil, index) => {
        coil.material.emissiveIntensity = 0.2 + Math.abs(Math.sin(time * 2 * speed + index)) * 0.5;
      });
    }

    // Solenoid field effect
    if (meshes.centralSolenoid) {
      meshes.centralSolenoid.material.emissiveIntensity = 0.1 + Math.abs(Math.cos(time * speed)) * 0.3;
    }
  }

  return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}
