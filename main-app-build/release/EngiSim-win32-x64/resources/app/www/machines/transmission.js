import { steel, aluminum, castIron, darkSteel, redAccent, brass, glass } from '../utils/materials.js';

export function createTransmission(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Transmission Housing
  const houseG = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.2, 5.0, 32), aluminum.clone());
  housing.rotation.x = Math.PI / 2;
  // Make it transparent so we can see inside
  housing.material.transparent = true;
  housing.material.opacity = 0.3;
  housing.material.wireframe = true;
  houseG.add(housing);
  group.add(houseG);
  parts.push({
    name: 'Bell Housing & Case', description: 'Aluminum casing housing the torque converter and gearsets.', material: 'Cast Aluminum', function: 'Protection and structural rigidity', assemblyOrder: 1, connections: ['Engine Block', 'Driveshaft'], failureEffect: 'Fluid leak', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Torque Converter
  const tcG = new THREE.Group();
  const tc = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.8, 32), darkSteel.clone());
  tc.rotation.x = Math.PI / 2;
  tc.position.set(0, 0, -2.0);
  tcG.add(tc);
  group.add(tcG);
  parts.push({
    name: 'Torque Converter', description: 'Fluid coupling replacing the manual clutch. Uses hydraulic fluid to transfer power.', material: 'Steel', function: 'Power coupling & torque multiplication', assemblyOrder: 2, connections: ['Flywheel', 'Input Shaft'], failureEffect: 'Slipping gears', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-3}
  });

  // 3. Input Shaft
  const inG = new THREE.Group();
  const inShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.5, 16), steel.clone());
  inShaft.rotation.x = Math.PI / 2;
  inShaft.position.set(0, 0, -0.4);
  inG.add(inShaft);
  group.add(inG);
  parts.push({
    name: 'Input Shaft', description: 'Carries power from the torque converter to the planetary gears.', material: 'Hardened Steel', function: 'Power transmission', assemblyOrder: 3, connections: ['Torque Converter', 'Planetary Gearset 1'], failureEffect: 'Loss of drive', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:-1}
  });

  // 4. Planetary Gearset 1 (Front)
  const p1G = new THREE.Group();
  // Sun gear
  const sun1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16), brass.clone());
  sun1.rotation.x = Math.PI / 2;
  sun1.position.set(0, 0, 0);
  p1G.add(sun1);
  // Planet gears
  for(let i=0; i<3; i++) {
     const planet = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), steel.clone());
     planet.rotation.x = Math.PI / 2;
     const angle = (i/3) * Math.PI * 2;
     planet.position.set(Math.cos(angle)*0.7, Math.sin(angle)*0.7, 0);
     p1G.add(planet);
  }
  // Ring gear
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 16, 32), darkSteel.clone());
  p1G.add(ring1);
  group.add(p1G);
  parts.push({
    name: 'Front Planetary Gearset', description: 'Sun, Planet, and Ring gears providing the first set of gear ratios.', material: 'Steel', function: 'Gear reduction', assemblyOrder: 4, connections: ['Input Shaft'], failureEffect: 'Loss of 1st/2nd gear', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 5. Clutch Pack 1
  const c1G = new THREE.Group();
  for(let i=0; i<5; i++) {
     const disc = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 16, 32), redAccent.clone());
     disc.position.set(0, 0, 0.4 + i*0.1);
     c1G.add(disc);
  }
  group.add(c1G);
  parts.push({
    name: 'Forward Clutch Pack', description: 'Hydraulically actuated friction discs that lock gearsets together.', material: 'Friction Material / Steel', function: 'Gear shifting', assemblyOrder: 5, connections: ['Planetary Gearset 1', 'Valve Body'], failureEffect: 'Transmission slipping', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0.5}
  });

  // 6. Planetary Gearset 2 (Rear)
  const p2G = new THREE.Group();
  const sun2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16), brass.clone());
  sun2.rotation.x = Math.PI / 2;
  sun2.position.set(0, 0, 1.2);
  p2G.add(sun2);
  for(let i=0; i<4; i++) {
     const planet = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16), steel.clone());
     planet.rotation.x = Math.PI / 2;
     const angle = (i/4) * Math.PI * 2;
     planet.position.set(Math.cos(angle)*0.75, Math.sin(angle)*0.75, 1.2);
     p2G.add(planet);
  }
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 16, 32), darkSteel.clone());
  ring2.position.set(0, 0, 1.2);
  p2G.add(ring2);
  group.add(p2G);
  parts.push({
    name: 'Rear Planetary Gearset', description: 'Provides overdrive and reverse gear ratios.', material: 'Steel', function: 'Overdrive / Reverse', assemblyOrder: 6, connections: ['Clutch Pack 1', 'Output Shaft'], failureEffect: 'Loss of reverse', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:1.5}
  });

  // 7. Valve Body
  const vbG = new THREE.Group();
  const vb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 3.0), castIron.clone());
  vb.position.set(0, -1.2, 0.5);
  vbG.add(vb);
  group.add(vbG);
  parts.push({
    name: 'Valve Body', description: 'The hydraulic "brain" of the transmission routing pressurized fluid to clutches.', material: 'Machined Aluminum', function: 'Hydraulic control', assemblyOrder: 7, connections: ['Transmission Pan', 'Clutch Packs'], failureEffect: 'Erratic shifting', cascadeFailures: ['Clutch Packs'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:0.5}
  });

  // 8. Transmission Pan & Filter
  const panG = new THREE.Group();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 3.2), steel.clone());
  pan.position.set(0, -1.5, 0.5);
  panG.add(pan);
  group.add(panG);
  parts.push({
    name: 'Oil Pan & Filter', description: 'Holds ATF (Automatic Transmission Fluid).', material: 'Stamped Steel', function: 'Fluid reservoir', assemblyOrder: 8, connections: ['Valve Body'], failureEffect: 'Fluid leak', cascadeFailures: ['Valve Body'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-5, z:0.5}
  });

  // 9. Output Shaft
  const outG = new THREE.Group();
  const outShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 16), steel.clone());
  outShaft.rotation.x = Math.PI / 2;
  outShaft.position.set(0, 0, 2.0);
  outG.add(outShaft);
  group.add(outG);
  parts.push({
    name: 'Output Shaft', description: 'Transfers the multiplied torque out to the driveshaft.', material: 'Hardened Steel', function: 'Power delivery', assemblyOrder: 9, connections: ['Planetary Gearset 2', 'Driveshaft'], failureEffect: 'Loss of drive', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:4}
  });

  // 10. Speed Sensor
  const sensG = new THREE.Group();
  const sens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), brass.clone());
  sens.position.set(0, 1.2, 2.5);
  sensG.add(sens);
  group.add(sensG);
  parts.push({
    name: 'Output Speed Sensor', description: 'Measures output shaft RPM to tell the computer when to shift.', material: 'Plastic / Copper', function: 'Sensor', assemblyOrder: 10, connections: ['Housing'], failureEffect: 'Limp mode', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:2, z:3}
  });

  const quizQuestions = [
    { question: 'What component replaces the mechanical clutch in an automatic transmission?', options: ['Planetary Gearset', 'Valve Body', 'Torque Converter', 'Input Shaft'], correct: 2, explanation: 'The torque converter uses a fluid coupling (impeller and turbine) to transfer power from the engine to the transmission smoothly without a mechanical connection.', difficulty: 'basic' },
    { question: 'What are the three main components of a planetary gearset?', options: ['Sun gear, Planet gears, Ring gear', 'Input shaft, Output shaft, Synchro', 'Impeller, Turbine, Stator', 'Valve body, Clutch pack, Band'], correct: 0, explanation: 'A planetary gearset gets its name because planet gears orbit around a central sun gear, all enclosed within an outer ring gear.', difficulty: 'basic' },
    { question: 'How does an automatic transmission shift gears?', options: ['A robotic arm moves the gears', 'By hydraulically applying clutches and bands to hold or release specific parts of the planetary gearsets', 'By changing the size of the torque converter', 'It uses a CVT belt'], correct: 1, explanation: 'By locking the sun gear, ring gear, or planet carrier, a single planetary gearset can provide multiple different gear ratios (reduction, direct drive, or overdrive).', difficulty: 'advanced' },
    { question: 'What is the function of the Valve Body?', options: ['To cool the fluid', 'To act as the hydraulic brain, routing pressurized fluid to engage specific clutches based on speed and load', 'To connect the engine to the transmission', 'To hold the planetary gears'], correct: 1, explanation: 'The valve body contains a maze of passages and valves (originally mechanical, now electronic solenoids) that direct fluid pressure to actuate shifts.', difficulty: 'advanced' },
    { question: 'What happens inside the torque converter at highway speeds to improve fuel economy?', options: ['It drains its fluid', 'The lock-up clutch engages, creating a direct 1:1 mechanical connection between engine and transmission', 'It spins backwards', 'It disconnects entirely'], correct: 1, explanation: 'Fluid couplings always have some "slip," wasting energy. Modern converters have a lock-up clutch that engages at cruising speeds to eliminate this slip and improve MPG.', difficulty: 'expert' },
    { question: 'What color is standard Automatic Transmission Fluid (ATF)?', options: ['Green', 'Clear', 'Red', 'Black'], correct: 2, explanation: 'ATF is dyed red to help distinguish it from motor oil or coolant in the event of a leak.', difficulty: 'basic' },
  ];

  return {
    group, parts, description: 'An Automatic Transmission utilizing a Torque Converter and Planetary Gears.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      if (meshes[1]) meshes[1].group.rotation.z = t * 10; // TC spinning with engine
      if (meshes[2]) meshes[2].group.rotation.z = t * 8; // Input shaft
      
      // Planetary 1
      if (meshes[3]) {
         const p1 = meshes[3].group;
         p1.children[0].rotation.z = t * 8; // sun
         // planet gears orbit
         for(let i=1; i<=3; i++) {
             const angle = ((i-1)/3) * Math.PI * 2 + (t * 2);
             p1.children[i].position.set(Math.cos(angle)*0.7, Math.sin(angle)*0.7, 0);
             p1.children[i].rotation.z = -t * 10; // spin on axis
         }
      }
      
      // Planetary 2
      if (meshes[5]) {
         const p2 = meshes[5].group;
         p2.children[0].rotation.z = t * 4; // sun
         for(let i=1; i<=4; i++) {
             const angle = ((i-1)/4) * Math.PI * 2 + (t * 1.5);
             p2.children[i].position.set(Math.cos(angle)*0.75, Math.sin(angle)*0.75, 1.2);
             p2.children[i].rotation.z = -t * 6;
         }
         p2.children[5].rotation.z = t * 2; // ring gear
      }
      
      if (meshes[8]) meshes[8].group.rotation.z = t * 2; // Output shaft (reduced speed)
    }
  };
}
