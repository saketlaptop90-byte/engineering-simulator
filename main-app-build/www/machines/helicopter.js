import { steel, aluminum, darkSteel, chrome, glass, rubber, titanium, carbonFiber, plastic, brass, copper, tinted } from '../utils/materials.js';

export function createHelicopter(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Stealth materials
  const stealthArmor = new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.8, metalness: 0.3 });
  const stealthDark = new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.9, metalness: 0.1 });
  const sensorGlass = new THREE.MeshStandardMaterial({ color: 0x000511, roughness: 0.1, metalness: 0.8, envMapIntensity: 2.0 });
  const radarAbsorbent = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95, metalness: 0.0 });

  // ─── 1. Advanced Main Rotor — 5-blade swept-tip rotor ───
  const mainRotorG = new THREE.Group();
  // Stealth rotor hub fairing
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16), stealthArmor);
  mainRotorG.add(hub);
  const hubCap = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 16), stealthArmor);
  hubCap.position.y = 0.35;
  mainRotorG.add(hubCap);

  // Five swept-tip stealth blades
  for (let i = 0; i < 5; i++) {
    const bladeGroup = new THREE.Group();
    
    // Main blade body
    const blade = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.04, 0.3), tinted(carbonFiber, 0x1a1a1a));
    blade.position.x = 2.4;
    bladeGroup.add(blade);
    
    // Swept tip for noise reduction
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 3), radarAbsorbent);
    tip.rotation.z = -Math.PI / 2;
    tip.rotation.x = Math.PI / 8;
    tip.position.set(4.7, 0, -0.1);
    bladeGroup.add(tip);

    // Grip
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12), darkSteel);
    grip.rotation.z = Math.PI / 2;
    grip.position.x = 0.4;
    bladeGroup.add(grip);

    bladeGroup.rotation.y = (i / 5) * Math.PI * 2;
    mainRotorG.add(bladeGroup);
  }
  mainRotorG.position.set(0, 3.2, 0);
  group.add(mainRotorG);
  parts.push({
    name: 'Next-Gen Swept-Tip Main Rotor',
    description: 'Five-blade fully articulated rotor system with an aerodynamic stealth hub fairing. Features acoustic-swept tips that drastically reduce acoustic signature and supersonic shockwaves.',
    material: 'Carbon-Nanotube Composite / Titanium',
    function: 'Generate lift and thrust with minimal radar and acoustic signature',
    assemblyOrder: 9,
    connections: ['Rotor Mast', 'Swashplate', 'Transmission'],
    failureEffect: 'Total loss of lift — catastrophic uncontrolled descent',
    cascadeFailures: ['Swashplate', 'Rotor Mast'],
    originalPosition: { x: 0, y: 3.2, z: 0 },
    explodedPosition: { x: 0, y: 6, z: 0 }
  });

  // ─── 2. Fenestron Tail Rotor — Enclosed fan-in-fin ───
  const tailRotorG = new THREE.Group();
  
  // Shroud housing
  const shroud = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.25, 16, 32), stealthArmor);
  shroud.position.z = 0;
  tailRotorG.add(shroud);

  // 10 internal stator blades (fixed)
  for (let i = 0; i < 10; i++) {
    const stator = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.2, 0.06), stealthDark);
    stator.rotation.z = (i / 10) * Math.PI * 2;
    tailRotorG.add(stator);
  }

  // Rotating fan hub
  const trHub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), steel);
  trHub.rotation.x = Math.PI / 2;
  tailRotorG.add(trHub);

  // 10 rotating fan blades
  const trFanGroup = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.5), tinted(carbonFiber, 0x222222));
    blade.position.set(Math.cos((i/10)*Math.PI*2)*0.35, Math.sin((i/10)*Math.PI*2)*0.35, 0);
    blade.rotation.z = (i/10)*Math.PI*2;
    blade.rotation.x = 0.4; // pitch
    trFanGroup.add(blade);
  }
  tailRotorG.add(trFanGroup);

  tailRotorG.position.set(0, 1.2, -5.8);
  group.add(tailRotorG);
  parts.push({
    name: 'Fenestron Enclosed Tail Rotor',
    description: 'Advanced fan-in-fin enclosed anti-torque system. The ducted fan design vastly reduces noise, protects the rotor from wire strikes, and decreases radar cross-section.',
    material: 'Radar Absorbent Polymer / Steel',
    function: 'Counteract main rotor torque with extreme acoustic stealth',
    assemblyOrder: 10,
    connections: ['Tail Boom', 'Transmission'],
    failureEffect: 'Loss of yaw control — uncontrolled spin',
    cascadeFailures: ['Tail Boom'],
    originalPosition: { x: 0, y: 1.2, z: -5.8 },
    explodedPosition: { x: 0, y: 1.2, z: -9 }
  });

  // ─── 3. Stealth Fuselage — Faceted radar-evading body ───
  const fuselageG = new THREE.Group();
  // Main angular body
  const bodyGeo = new THREE.CylinderGeometry(1.2, 1.4, 4.5, 6);
  const bodyMain = new THREE.Mesh(bodyGeo, stealthArmor);
  bodyMain.rotation.x = Math.PI / 2;
  bodyMain.rotation.z = Math.PI / 6;
  bodyMain.position.set(0, 0.8, 0);
  fuselageG.add(bodyMain);

  // Angular nose chine
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 6), stealthArmor);
  nose.rotation.x = -Math.PI / 2;
  nose.rotation.z = Math.PI / 6;
  nose.position.set(0, 0.8, 3.5);
  fuselageG.add(nose);

  // Stealth Cockpit Canopy (Angular)
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 2.5, 4), sensorGlass);
  canopy.rotation.x = Math.PI / 2;
  canopy.rotation.z = Math.PI / 4;
  canopy.position.set(0, 1.6, 2.0);
  fuselageG.add(canopy);

  // Weapon Bays (closed)
  const bayL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 2.0), stealthDark);
  bayL.position.set(-1.25, 0.5, 0);
  fuselageG.add(bayL);
  const bayR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 2.0), stealthDark);
  bayR.position.set(1.25, 0.5, 0);
  fuselageG.add(bayR);

  // Sensor Pod (FLIR)
  const flir = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), sensorGlass);
  flir.position.set(0, -0.2, 4.2);
  fuselageG.add(flir);

  group.add(fuselageG);
  parts.push({
    name: 'Stealth Airframe & Internal Weapon Bays',
    description: 'Faceted radar-absorbent fuselage designed to deflect radar waves. Features internal weapon bays to maintain stealth profile, an angular sensor-glass canopy, and a chin-mounted FLIR optronics pod.',
    material: 'Radar-Absorbent Composite (RAM)',
    function: 'House crew and avionics while minimizing radar cross-section (RCS)',
    assemblyOrder: 1,
    connections: ['Engines', 'Cockpit', 'Tail Boom', 'Retractable Gear'],
    failureEffect: 'Structural failure or loss of stealth',
    cascadeFailures: ['Internal Systems'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 0 }
  });

  // ─── 4. Dual Turboshaft Engines — Suppressed Exhaust ───
  const engineG = new THREE.Group();
  for (let side = -1; side <= 1; side += 2) {
      const engBase = new THREE.Group();
      
      // Air intake (S-duct for radar blocking)
      const intake = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.8), stealthDark);
      intake.position.set(side * 0.8, 2.2, 1.2);
      engBase.add(intake);

      // Core Engine
      const compressor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 12), titanium);
      compressor.rotation.x = Math.PI / 2;
      compressor.position.set(side * 0.8, 2.2, 0.2);
      engBase.add(compressor);

      // IR Suppressed Exhaust
      const exhaust = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.0), radarAbsorbent);
      exhaust.position.set(side * 0.8, 2.4, -1.0);
      engBase.add(exhaust);

      engineG.add(engBase);
  }
  group.add(engineG);
  parts.push({
    name: 'Dual Next-Gen Turboshaft Engines',
    description: 'Twin high-performance turboshafts featuring S-duct intakes to hide compressor blades from radar, and planar infrared-suppressing exhausts that mix cold air with exhaust gases to defeat heat-seeking missiles.',
    material: 'Titanium / Ceramic Matrix Composites',
    function: 'Provide massive shaft power with minimal thermal signature',
    assemblyOrder: 3,
    connections: ['Transmission', 'Fuselage'],
    failureEffect: 'Partial power loss — flyable on single engine',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 4, z: 0 }
  });

  // ─── 5. Transmission — High-torque gearbox ───
  const transG = new THREE.Group();
  const gearCase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.5), tinted(aluminum, 0x556677));
  gearCase.position.set(0, 2.0, 0.2);
  transG.add(gearCase);

  const mastBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.4, 16), steel);
  mastBase.position.set(0, 2.6, 0.2);
  transG.add(mastBase);

  group.add(transG);
  parts.push({
    name: 'Redundant Main Transmission',
    description: 'Advanced run-dry capable transmission that can operate for 60 minutes without oil. Reduces extreme engine RPM to functional rotor speed.',
    material: 'Forged Steel / Titanium Housing',
    function: 'Power distribution and RPM reduction',
    assemblyOrder: 4,
    connections: ['Engines', 'Main Rotor', 'Tail Rotor'],
    failureEffect: 'Loss of rotor drive',
    cascadeFailures: ['Main Rotor'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: 1.5 }
  });

  // ─── 6. Digital Swashplate — Fly-by-wire ───
  const swashG = new THREE.Group();
  const stationaryPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 24), darkSteel);
  stationaryPlate.position.y = 2.9;
  swashG.add(stationaryPlate);

  // Digital servo actuators
  for (let i = 0; i < 4; i++) {
    const servo = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), chrome);
    const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
    servo.position.set(Math.cos(angle) * 0.5, 2.6, Math.sin(angle) * 0.5);
    swashG.add(servo);
  }
  group.add(swashG);
  parts.push({
    name: 'Quad-Redundant Fly-by-Wire Swashplate',
    description: 'Advanced fully digital flight control system using four electro-hydrostatic actuators (EHA) to directly tilt the swashplate without mechanical linkages from the cockpit.',
    material: 'Titanium / Electronics',
    function: 'Fly-by-wire cyclic and collective pitch control',
    assemblyOrder: 7,
    connections: ['Rotor Mast', 'Flight Computers'],
    failureEffect: 'Handled by triple-redundant backups',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 4, z: -2 }
  });

  // ─── 7. Swept Tail Boom ───
  const tailBoomG = new THREE.Group();
  const boomTube = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 4.5, 6), stealthArmor);
  boomTube.rotation.x = Math.PI / 2;
  boomTube.rotation.z = Math.PI / 6;
  boomTube.position.set(0, 1.2, -3.5);
  tailBoomG.add(boomTube);

  const vStab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 1.0), stealthArmor);
  vStab.position.set(0, 1.5, -5.5);
  vStab.rotation.x = -0.3; // Swept back
  tailBoomG.add(vStab);

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.8), stealthArmor);
  hStab.position.set(0, 1.2, -4.5);
  tailBoomG.add(hStab);

  group.add(tailBoomG);
  parts.push({
    name: 'Stealth Tail Boom & Stabilators',
    description: 'Faceted composite tail boom carrying the enclosed tail drive shaft. Features an all-moving horizontal stabilator for extreme pitch agility.',
    material: 'Radar-Absorbent Composite',
    function: 'Support tail rotor and provide aerodynamic stability',
    assemblyOrder: 2,
    connections: ['Fuselage', 'Fenestron'],
    failureEffect: 'Loss of pitch/yaw stability',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 1, z: -4 }
  });

  // ─── 8. Retractable Landing Gear ───
  const gearG = new THREE.Group();
  // Left Main Gear
  const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), darkSteel);
  strutL.position.set(-1.0, -0.2, -0.5);
  strutL.rotation.z = -0.2;
  gearG.add(strutL);
  const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16), rubber);
  wheelL.rotation.z = Math.PI / 2;
  wheelL.position.set(-1.2, -0.6, -0.5);
  gearG.add(wheelL);

  // Right Main Gear
  const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), darkSteel);
  strutR.position.set(1.0, -0.2, -0.5);
  strutR.rotation.z = 0.2;
  gearG.add(strutR);
  const wheelR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16), rubber);
  wheelR.rotation.z = Math.PI / 2;
  wheelR.position.set(1.2, -0.6, -0.5);
  gearG.add(wheelR);

  // Tail Wheel (Retractable)
  const strutT = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), darkSteel);
  strutT.position.set(0, 0.5, -5.0);
  gearG.add(strutT);
  const wheelT = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), rubber);
  wheelT.rotation.z = Math.PI / 2;
  wheelT.position.set(0, 0.1, -5.0);
  gearG.add(wheelT);

  group.add(gearG);
  parts.push({
    name: 'Retractable Stealth Landing Gear',
    description: 'Fully retractable wheeled landing gear with radar-absorbing doors to eliminate radar returns from exposed struts during flight. Features shock-absorbing oleo struts for hard landings.',
    material: 'High-Tensile Steel / Rubber',
    function: 'Ground taxiing and landing support with stealth integration',
    assemblyOrder: 5,
    connections: ['Fuselage', 'Tail Boom'],
    failureEffect: 'Gear up landing required',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -3, z: 0 }
  });

  // ─── 9. Glass Cockpit & Avionics ───
  const cockpitG = new THREE.Group();
  
  // Pilot and Gunner seats (tandem)
  const seatG = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), stealthDark);
  seatG.position.set(0, 1.0, 1.5); // Gunner front
  cockpitG.add(seatG);
  const seatP = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), stealthDark);
  seatP.position.set(0, 1.4, 0.5); // Pilot raised rear
  cockpitG.add(seatP);

  // Holographic / Glass MFD Displays
  const mfd = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.02), sensorGlass);
  mfd.position.set(0, 1.3, 2.0);
  mfd.rotation.x = -0.2;
  cockpitG.add(mfd);

  group.add(cockpitG);
  parts.push({
    name: 'Tandem Glass Cockpit',
    description: 'Next-generation tandem seating cockpit featuring massive Multi-Function Displays (MFDs), augmented reality helmet integration, and zero analog gauges.',
    material: 'Armor Glass / Advanced Electronics',
    function: 'Crew station and avionics interface',
    assemblyOrder: 6,
    connections: ['Fuselage', 'Flight Computers'],
    failureEffect: 'Loss of situational awareness',
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 3, z: 3 }
  });

  // ─── 10. Rotor Mast ───
  const mastG = new THREE.Group();
  const mastShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16), titanium);
  mastShaft.position.set(0, 2.9, 0.2);
  mastG.add(mastShaft);
  group.add(mastG);
  parts.push({
    name: 'Titanium Rotor Mast',
    description: 'Thick titanium shaft transmitting massive torque from the transmission to the stealth rotor head.',
    material: 'Titanium Alloy',
    function: 'Transmit engine torque to rotor',
    assemblyOrder: 8,
    connections: ['Transmission', 'Swashplate', 'Main Rotor'],
    failureEffect: 'Mast failure — catastrophic',
    cascadeFailures: ['Main Rotor', 'Swashplate'],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 5, z: 1 }
  });

  // ─── Quiz Questions ───
  const quizQuestions = [
    { question: 'What is the primary advantage of a Fenestron (enclosed tail rotor)?', options: ['It provides forward thrust', 'It is significantly quieter, protects the blades from strikes, and reduces radar cross-section.', 'It is cheaper to build', 'It does not require engine power'], correct: 1, explanation: 'Enclosing the tail rotor in a duct reduces acoustic noise propagation, protects ground crews and the blades themselves, and hides the moving blades from radar.', difficulty: 'basic' },
    { question: 'Why do modern stealth helicopters use faceted or angled fuselage shapes?', options: ['To reflect radar waves away from the receiver rather than back at it', 'For better aerodynamics', 'To hold more fuel', 'To make it fly faster'], correct: 0, explanation: 'Faceted shapes scatter incoming radar waves in random directions instead of reflecting them straight back to the radar dish, making the helicopter nearly invisible on radar.', difficulty: 'advanced' },
    { question: 'What is an IR-suppressed exhaust system?', options: ['An exhaust that creates smoke screens', 'A system that mixes cool ambient air with hot engine exhaust to lower the thermal signature, defeating heat-seeking missiles.', 'An exhaust that spins the tail rotor', 'A system that makes the engine louder'], correct: 1, explanation: 'Heat-seeking (IR) missiles lock onto hot engine exhausts. Suppressors dilute the hot gas with cold air before it exits, dramatically lowering the heat signature.', difficulty: 'advanced' },
    { question: 'What does Fly-by-Wire mean in a helicopter?', options: ['The helicopter is powered by wires from the ground', 'Mechanical linkages are replaced by electronic signals sent from computers to hydraulic actuators at the swashplate.', 'The rotor blades are made of wire', 'The helicopter flies automatically without a pilot'], correct: 1, explanation: 'Fly-by-wire removes heavy metal pushrods. The pilot\'s stick sends electrical signals to flight computers, which then command precise electro-hydrostatic actuators.', difficulty: 'expert' }
  ];

  return {
    group,
    parts,
    description: 'A next-generation stealth attack helicopter. Features a faceted radar-absorbent fuselage, enclosed fenestron tail rotor, fly-by-wire controls, and IR-suppressed engines for extreme survivability.',
    quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;

      // Main rotor
      if (meshes[0]) {
        meshes[0].group.rotation.y = -t * 8; // fast
      }

      // Tail rotor fan blades (child index 2 is trFanGroup in tailRotorG)
      if (meshes[1]) {
        const trGroup = parts[1].runtimeGroup || meshes[1].group;
        if (trGroup && trGroup.children[2]) {
           trGroup.children[2].rotation.z = t * 25; // extremely fast fenestron
        }
      }

      // Swashplate — subtle fly-by-wire corrections
      if (meshes[5]) {
        meshes[5].group.rotation.x = Math.sin(t * 2.0) * 0.02;
        meshes[5].group.rotation.z = Math.cos(t * 1.5) * 0.02;
      }

      // Subtle fuselage sway
      if (meshes[2]) {
        meshes[2].group.rotation.z = Math.sin(t * 5) * 0.002;
        meshes[2].group.rotation.x = Math.sin(t * 4) * 0.001;
      }
    }
  };
}
