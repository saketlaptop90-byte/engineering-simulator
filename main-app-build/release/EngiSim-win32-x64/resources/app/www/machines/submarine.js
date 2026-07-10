import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createSubmarine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Outer Hull
  const outerHullGroup = new THREE.Group();
  outerHullGroup.position.set(0, 0, 0);
  
  const hullBodyGeo = new THREE.CylinderGeometry(4, 4, 30, 32);
  hullBodyGeo.rotateZ(Math.PI / 2);
  const hullBody = new THREE.Mesh(hullBodyGeo, darkSteel);
  
  const bowGeo = new THREE.SphereGeometry(4, 32, 32);
  const bow = new THREE.Mesh(bowGeo, darkSteel);
  bow.position.set(15, 0, 0);
  
  const sternGeo = new THREE.CylinderGeometry(0.5, 4, 12, 32);
  sternGeo.rotateZ(Math.PI / 2);
  const stern = new THREE.Mesh(sternGeo, darkSteel);
  stern.position.set(-21, 0, 0);
  
  outerHullGroup.add(hullBody, bow, stern);
  group.add(outerHullGroup);
  
  parts.push({
    name: "Outer Hull",
    description: "The streamlined, hydrodynamic outer shell designed to reduce drag and acoustic signature. Covered in anechoic tiles.",
    material: "Anechoic tiles over Steel",
    function: "Provides hydrodynamic shape and mounts acoustic damping tiles to evade sonar.",
    assemblyOrder: 1,
    connections: ["Pressure Hull", "Sail", "Stern Planes"],
    failureEffect: "Increased drag and noise signature, making the submarine easily detectable.",
    cascadeFailures: ["Acoustic stealth failure"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 15, z: 0 },
    group: outerHullGroup
  });

  // 2. Sail / Conning Tower
  const sailGroup = new THREE.Group();
  sailGroup.position.set(8, 5.5, 0);
  
  const sailShape = new THREE.Shape();
  sailShape.moveTo(-4, -2);
  sailShape.lineTo(4, -2);
  sailShape.lineTo(3, 2);
  sailShape.lineTo(-2, 2);
  sailShape.lineTo(-4, -2);
  
  const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
  const sailGeo = new THREE.ExtrudeGeometry(sailShape, extrudeSettings);
  sailGeo.center();
  const sail = new THREE.Mesh(sailGeo, darkSteel);
  sailGroup.add(sail);
  group.add(sailGroup);
  
  parts.push({
    name: "Sail / Conning Tower",
    description: "The fin-like structure on top of the hull. It houses masts, periscopes, and acts as a stabilizing fin.",
    material: "Dark Steel / Composite",
    function: "Houses sensor masts and provides a surface navigation bridge.",
    assemblyOrder: 2,
    connections: ["Outer Hull", "Periscope & Masts", "Forward Dive Planes"],
    failureEffect: "Loss of mast deployment capability and surface stability.",
    cascadeFailures: ["Sensor blindness"],
    originalPosition: { x: 8, y: 5.5, z: 0 },
    explodedPosition: { x: 8, y: 25, z: 0 },
    group: sailGroup
  });

  // 3. Periscope & Masts
  const mastsGroup = new THREE.Group();
  mastsGroup.position.set(8, 8, 0);
  
  const periGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
  const peri1 = new THREE.Mesh(periGeo, chrome);
  peri1.position.set(0, 0, 0);
  
  const peri2 = new THREE.Mesh(periGeo, chrome);
  peri2.position.set(-1, -0.5, 0);
  
  const radarGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const radar = new THREE.Mesh(radarGeo, darkSteel);
  radar.position.set(0, 2, 0);
  
  mastsGroup.add(peri1, peri2, radar);
  group.add(mastsGroup);
  
  parts.push({
    name: "Periscope & Masts",
    description: "Optical, radar, and communication antennas that can be raised above the water surface.",
    material: "Chrome / Radar Absorbent Material",
    function: "Provides visual, electronic, and communications gathering while submerged at periscope depth.",
    assemblyOrder: 3,
    connections: ["Sail"],
    failureEffect: "Inability to communicate or scan environment at periscope depth.",
    cascadeFailures: ["Tactical blindness"],
    originalPosition: { x: 8, y: 8, z: 0 },
    explodedPosition: { x: 8, y: 35, z: 0 },
    group: mastsGroup
  });

  // 4. Forward Dive Planes
  const divePlanesGroup = new THREE.Group();
  divePlanesGroup.position.set(8.5, 5, 0);
  
  const planeGeo = new THREE.BoxGeometry(2, 0.2, 5);
  const leftPlane = new THREE.Mesh(planeGeo, darkSteel);
  leftPlane.position.set(0, 0, 2.5);
  
  const rightPlane = new THREE.Mesh(planeGeo, darkSteel);
  rightPlane.position.set(0, 0, -2.5);
  
  divePlanesGroup.add(leftPlane, rightPlane);
  group.add(divePlanesGroup);
  
  parts.push({
    name: "Forward Dive Planes",
    description: "Control surfaces mounted on the sail or forward hull used to control pitch and depth.",
    material: "Dark Steel",
    function: "Controls the submarine's angle of dive or rise dynamically.",
    assemblyOrder: 4,
    connections: ["Sail"],
    failureEffect: "Loss of fine depth control, increasing risk of broaching or uncontrolled dive.",
    cascadeFailures: ["Depth excursion", "Cavitation due to improper angle"],
    originalPosition: { x: 8.5, y: 5, z: 0 },
    explodedPosition: { x: 8.5, y: 20, z: 10 },
    group: divePlanesGroup
  });

  // 5. Stern Planes & Rudder
  const sternPlanesGroup = new THREE.Group();
  sternPlanesGroup.position.set(-24, 0, 0);
  
  const finGeo = new THREE.BoxGeometry(3, 0.2, 10);
  const horizFin = new THREE.Mesh(finGeo, darkSteel);
  
  const vertGeo = new THREE.BoxGeometry(3, 10, 0.2);
  const vertFin = new THREE.Mesh(vertGeo, darkSteel);
  
  sternPlanesGroup.add(horizFin, vertFin);
  sternPlanesGroup.rotation.x = Math.PI / 4; // X pattern
  
  group.add(sternPlanesGroup);
  
  parts.push({
    name: "Stern Planes & Rudder",
    description: "Tail control surfaces configured in a cross or X pattern for steering and diving.",
    material: "Dark Steel",
    function: "Provides steering (yaw) and primary pitch control.",
    assemblyOrder: 5,
    connections: ["Outer Hull"],
    failureEffect: "Loss of steering and major depth control.",
    cascadeFailures: ["Collision", "Uncontrolled descent"],
    originalPosition: { x: -24, y: 0, z: 0 },
    explodedPosition: { x: -24, y: 10, z: -10 },
    group: sternPlanesGroup
  });

  // 6. Propeller / Pump-jet
  const propGroup = new THREE.Group();
  propGroup.position.set(-27.5, 0, 0);
  
  const hubGeo = new THREE.SphereGeometry(1, 16, 16);
  const hub = new THREE.Mesh(hubGeo, brass);
  hub.scale.set(1.5, 1, 1);
  propGroup.add(hub);
  
  const bladeGeo = new THREE.BoxGeometry(0.2, 3, 1);
  for(let i=0; i<7; i++) {
      const blade = new THREE.Mesh(bladeGeo, brass);
      const angle = (i / 7) * Math.PI * 2;
      blade.rotation.x = angle;
      blade.rotation.z = 0.3; // pitch
      blade.translateY(1.5);
      propGroup.add(blade);
  }
  
  group.add(propGroup);
  
  parts.push({
    name: "Propeller / Pump-jet",
    description: "Massive multi-blade rotor or pump-jet propulsor at the rear.",
    material: "Brass / Composite",
    function: "Provides forward and reverse thrust. Designed to minimize cavitation noise.",
    assemblyOrder: 6,
    connections: ["Propulsion Shaft"],
    failureEffect: "Loss of propulsion and maneuverability.",
    cascadeFailures: ["Drift", "Tactical vulnerability"],
    originalPosition: { x: -27.5, y: 0, z: 0 },
    explodedPosition: { x: -40, y: 0, z: 0 },
    group: propGroup
  });

  // 7. Pressure Hull
  const pressureHullGroup = new THREE.Group();
  pressureHullGroup.position.set(0, 0, 0);
  
  const phGeo = new THREE.CylinderGeometry(3.2, 3.2, 28, 32);
  phGeo.rotateZ(Math.PI / 2);
  const phMesh = new THREE.Mesh(phGeo, titanium);
  phMesh.position.set(-2, 0, 0);
  
  const phCapGeo = new THREE.SphereGeometry(3.2, 32, 32);
  const bowCap = new THREE.Mesh(phCapGeo, titanium);
  bowCap.position.set(12, 0, 0);
  const sternCap = new THREE.Mesh(phCapGeo, titanium);
  sternCap.position.set(-16, 0, 0);
  
  pressureHullGroup.add(phMesh, bowCap, sternCap);
  group.add(pressureHullGroup);
  
  parts.push({
    name: "Pressure Hull",
    description: "The thick inner cylindrical hull made of high-yield steel or titanium.",
    material: "HY-80/HY-100 Steel or Titanium",
    function: "Withstands massive external water pressure to keep the crew and equipment safe.",
    assemblyOrder: 7,
    connections: ["Outer Hull", "Nuclear Reactor Compartment"],
    failureEffect: "Catastrophic implosion due to external pressure.",
    cascadeFailures: ["Total loss of ship"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 15 },
    group: pressureHullGroup
  });

  // 8. Nuclear Reactor Compartment
  const reactorGroup = new THREE.Group();
  reactorGroup.position.set(-6, 0, 0);
  
  const rxGeo = new THREE.CylinderGeometry(2, 2, 6, 16);
  rxGeo.rotateZ(Math.PI / 2);
  const reactorMat = tinted(steel, 0x555555);
  const rx = new THREE.Mesh(rxGeo, reactorMat);
  
  const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
  coreGeo.rotateZ(Math.PI / 2);
  const core = new THREE.Mesh(coreGeo, greenAccent);
  
  reactorGroup.add(rx, core);
  group.add(reactorGroup);
  
  parts.push({
    name: "Nuclear Reactor Compartment",
    description: "The pressurized water reactor (PWR) providing heat to generate steam.",
    material: "Steel / Uranium",
    function: "Generates virtually unlimited heat for propulsion and electricity.",
    assemblyOrder: 8,
    connections: ["Pressure Hull", "Steam Turbines"],
    failureEffect: "Loss of primary power, potential radiation leak.",
    cascadeFailures: ["Propulsion failure", "Life support failure"],
    originalPosition: { x: -6, y: 0, z: 0 },
    explodedPosition: { x: -6, y: -15, z: 20 },
    group: reactorGroup
  });

  // 9. Torpedo Tubes
  const torpedoTubesGroup = new THREE.Group();
  torpedoTubesGroup.position.set(14, 0, 0);
  
  const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
  tubeGeo.rotateZ(Math.PI / 2);
  
  const tube1 = new THREE.Mesh(tubeGeo, darkSteel);
  tube1.position.set(0, 1.5, 1.5);
  const tube2 = new THREE.Mesh(tubeGeo, darkSteel);
  tube2.position.set(0, 1.5, -1.5);
  const tube3 = new THREE.Mesh(tubeGeo, darkSteel);
  tube3.position.set(0, -1.5, 1.5);
  const tube4 = new THREE.Mesh(tubeGeo, darkSteel);
  tube4.position.set(0, -1.5, -1.5);
  
  torpedoTubesGroup.add(tube1, tube2, tube3, tube4);
  group.add(torpedoTubesGroup);
  
  parts.push({
    name: "Torpedo Tubes",
    description: "Forward-facing launch tubes for torpedoes and cruise missiles.",
    material: "Steel",
    function: "Deploys offensive and defensive weapons.",
    assemblyOrder: 9,
    connections: ["Pressure Hull", "Outer Hull"],
    failureEffect: "Inability to launch weapons.",
    cascadeFailures: ["Loss of offensive capability"],
    originalPosition: { x: 14, y: 0, z: 0 },
    explodedPosition: { x: 25, y: 0, z: 0 },
    group: torpedoTubesGroup
  });

  // 10. Ballast Tanks
  const ballastGroup = new THREE.Group();
  ballastGroup.position.set(0, 0, 0);
  
  const ballastGeo = new THREE.CapsuleGeometry(1.5, 16, 8, 16);
  ballastGeo.rotateZ(Math.PI / 2);
  
  const leftBallast = new THREE.Mesh(ballastGeo, tinted(steel, 0x334455));
  leftBallast.position.set(-2, -2.5, 2.5);
  
  const rightBallast = new THREE.Mesh(ballastGeo, tinted(steel, 0x334455));
  rightBallast.position.set(-2, -2.5, -2.5);
  
  ballastGroup.add(leftBallast, rightBallast);
  group.add(ballastGroup);
  
  parts.push({
    name: "Ballast Tanks",
    description: "Chambers between the inner and outer hull that can be filled with water or high-pressure air.",
    material: "Steel",
    function: "Controls buoyancy to submerge or surface using Archimedes' principle.",
    assemblyOrder: 10,
    connections: ["Outer Hull", "Pressure Hull"],
    failureEffect: "Inability to surface or dive.",
    cascadeFailures: ["Uncontrolled sinking", "Stuck on surface"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -20, z: 0 },
    group: ballastGroup
  });

  const quizQuestions = [
    {
      question: "How does a submarine use Archimedes' principle to submerge?",
      options: [
        "It decreases its volume to become denser than water.",
        "It increases its average density by taking water into its ballast tanks.",
        "It uses horizontal dive planes to push itself down mechanically.",
        "It reverses the polarity of its magnetic hull."
      ],
      correct: 1,
      explanation: "Archimedes' principle states that an object sinks when its weight exceeds the buoyant force. A submarine achieves this by filling ballast tanks with water to increase its total density.",
      difficulty: "Medium"
    },
    {
      question: "What is cavitation and why is it a major concern for submarine stealth?",
      options: [
        "The echoing of internal noise inside the pressure hull.",
        "The formation and collapse of vapor bubbles around a fast-spinning propeller, creating loud noise.",
        "The bending of sonar waves due to temperature layers in the ocean.",
        "The slow leak of radiation from the nuclear reactor."
      ],
      correct: 1,
      explanation: "Cavitation occurs when localized low pressure from a spinning propeller boils water, forming bubbles that collapse violently. This creates a distinct and loud acoustic signature.",
      difficulty: "Hard"
    },
    {
      question: "What is the primary difference between active and passive sonar?",
      options: [
        "Active sonar listens for sounds, while passive emits them.",
        "Active sonar works on the surface, while passive works underwater.",
        "Active sonar emits sound pulses to bounce off targets, while passive sonar only listens.",
        "Active sonar uses low frequencies, while passive uses high frequencies."
      ],
      correct: 2,
      explanation: "Active sonar 'pings' the environment and listens for echoes, revealing the sub's own position. Passive sonar stealthily listens to the environment without emitting signals.",
      difficulty: "Easy"
    },
    {
      question: "Why are materials like HY-80 steel or titanium used for the inner pressure hull?",
      options: [
        "They are invisible to enemy radar.",
        "They are exceptionally light, improving top speed.",
        "They have extremely high yield strength to withstand massive external water pressure.",
        "They absorb nuclear radiation perfectly."
      ],
      correct: 2,
      explanation: "The pressure hull must resist catastrophic implosion from deep ocean pressure. High-yield (HY) steels and titanium provide the necessary structural strength.",
      difficulty: "Medium"
    },
    {
      question: "What is the primary limiting factor for a nuclear submarine's underwater endurance?",
      options: [
        "Nuclear fuel depletion.",
        "Oxygen supply for the crew.",
        "Battery life.",
        "Food and supplies for the crew."
      ],
      correct: 3,
      explanation: "A nuclear reactor provides nearly unlimited power, which is used to generate oxygen from seawater and fresh water. Thus, the main limitation is the amount of food that can be stored onboard.",
      difficulty: "Easy"
    },
    {
      question: "Why do many modern submarines use pump-jet propulsors instead of traditional open propellers?",
      options: [
        "They require significantly less electrical power.",
        "They shroud the spinning blades, delaying cavitation and operating much quieter.",
        "They can operate in reverse faster.",
        "They double as a secondary sonar array."
      ],
      correct: 1,
      explanation: "Pump-jets enclose the rotor blades inside a shroud, reducing the blade tip vortices that cause cavitation. This allows the sub to travel faster while remaining quiet.",
      difficulty: "Medium"
    }
  ];

  function animate(time, speed, meshes) {
    if (propGroup) {
      propGroup.rotation.x -= 0.1 * speed;
    }
    if (divePlanesGroup) {
      divePlanesGroup.rotation.z = Math.sin(time * 2 * speed) * 0.15;
    }
  }

  return {
    group,
    parts,
    description: "A highly advanced Nuclear Submarine capable of submerged endurance limited only by food supplies. Features anechoic tiling, a pump-jet propulsor, and a titanium pressure hull.",
    quizQuestions,
    animate
  };
}
