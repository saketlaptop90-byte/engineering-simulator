// ═══════════════════════════════════════════════════════════════════
// Refrigerator
// ═══════════════════════════════════════════════════════════════════
import { whitePlastic, darkSteel, rubber, copper, aluminum, steel, plastic, glass, brass, tinted } from '../utils/materials.js';

export function createRefrigerator(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Outer Casing
  const casingG = new THREE.Group();
  // Main body (open front)
  const backW = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.5, 0.08), whitePlastic.clone());
  backW.position.set(0, 0, -0.7);
  casingG.add(backW);
  const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.5, 1.5), whitePlastic.clone());
  leftW.position.set(-1.0, 0, 0);
  casingG.add(leftW);
  const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.5, 1.5), whitePlastic.clone());
  rightW.position.set(1.0, 0, 0);
  casingG.add(rightW);
  const topW = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.5), whitePlastic.clone());
  topW.position.set(0, 1.75, 0);
  casingG.add(topW);
  const bottomW = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.5), whitePlastic.clone());
  bottomW.position.set(0, -1.75, 0);
  casingG.add(bottomW);
  group.add(casingG);
  parts.push({ name: 'Outer Casing', description: 'Sheet steel outer shell with baked enamel finish. Provides structural rigidity and aesthetic appearance.', material: 'Sheet Steel + Enamel', function: 'Structural shell and appearance', assemblyOrder: 1, connections: ['Door', 'Insulation', 'Compressor'], failureEffect: 'Cosmetic damage, potential insulation exposure', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:0} });

  // 2. Door
  const doorG = new THREE.Group();
  const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(1.85, 3.4, 0.1), whitePlastic.clone());
  doorPanel.position.set(0, 0, 0.8);
  doorG.add(doorPanel);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.12), tinted(steel, 0xaabbcc));
  handle.position.set(0.85, 0.3, 0.88);
  doorG.add(handle);
  group.add(doorG);
  parts.push({ name: 'Door', description: 'Insulated door with magnetic seal. Contains shelves and compartments for frequently accessed items.', material: 'Steel + Insulation', function: 'Seal refrigerated compartment', assemblyOrder: 9, connections: ['Outer Casing', 'Door Seal'], failureEffect: 'Cold air escapes, compressor overworks, energy waste', cascadeFailures: ['Compressor', 'Door Seal'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:3} });

  // 3. Door Seal (Gasket)
  const sealG = new THREE.Group();
  // Frame gasket
  const sTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 0.08), rubber.clone());
  sTop.position.set(0, 1.7, 0.73);
  sealG.add(sTop);
  const sBot = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 0.08), rubber.clone());
  sBot.position.set(0, -1.7, 0.73);
  sealG.add(sBot);
  const sLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.35, 0.08), rubber.clone());
  sLeft.position.set(-0.95, 0, 0.73);
  sealG.add(sLeft);
  const sRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.35, 0.08), rubber.clone());
  sRight.position.set(0.95, 0, 0.73);
  sealG.add(sRight);
  group.add(sealG);
  parts.push({ name: 'Door Seal', description: 'Magnetic gasket creating airtight seal when door closes. Flexible PVC with embedded magnets.', material: 'PVC + Magnets', function: 'Airtight seal to prevent cold air leakage', assemblyOrder: 8, connections: ['Door', 'Outer Casing'], failureEffect: 'Air leakage → frost buildup, higher energy consumption', cascadeFailures: ['Compressor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:4} });

  // 4. Compressor
  const compG = new THREE.Group();
  const compBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), darkSteel.clone());
  compBody.position.set(0.3, -1.7, -0.3);
  compG.add(compBody);
  const compTop = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI*2, 0, Math.PI/2), darkSteel.clone());
  compTop.position.set(0.3, -1.45, -0.3);
  compG.add(compTop);
  const compPlate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), steel.clone());
  compPlate.position.set(0.3, -1.98, -0.3);
  compG.add(compPlate);
  group.add(compG);
  parts.push({ name: 'Compressor', description: 'Hermetically sealed reciprocating compressor. Pumps refrigerant through the system. Mounted on vibration dampeners.', material: 'Cast Iron + Steel', function: 'Circulate and compress refrigerant', assemblyOrder: 2, connections: ['Condenser Coils', 'Evaporator', 'Outer Casing'], failureEffect: 'Complete cooling failure', cascadeFailures: ['Condenser Coils', 'Evaporator'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:-3,z:-2} });

  // 5. Condenser Coils
  const condG = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), darkSteel.clone());
    coil.rotation.z = Math.PI / 2;
    coil.position.set(0, -1.3 + i * 0.25, -0.65);
    condG.add(coil);
  }
  // Connecting bends
  for (let i = 0; i < 11; i++) {
    const bend = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 8, Math.PI), darkSteel.clone());
    bend.position.set(i % 2 === 0 ? 0.9 : -0.9, -1.3 + i * 0.25 + 0.125, -0.65);
    bend.rotation.y = Math.PI / 2;
    bend.rotation.z = i % 2 === 0 ? 0 : Math.PI;
    condG.add(bend);
  }
  group.add(condG);
  parts.push({ name: 'Condenser Coils', description: 'Black wire-on-tube condenser at rear. Dissipates heat from compressed refrigerant to ambient air via natural convection.', material: 'Steel Tubing', function: 'Reject heat from refrigerant', assemblyOrder: 3, connections: ['Compressor', 'Outer Casing'], failureEffect: 'High head pressure, compressor overwork, poor cooling', cascadeFailures: ['Compressor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:-3} });

  // 6. Evaporator
  const evapG = new THREE.Group();
  const evapPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.08), aluminum.clone());
  evapPlate.position.set(0, 1.2, -0.2);
  evapG.add(evapPlate);
  for (let i = 0; i < 4; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), copper.clone());
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, 1.0 + i * 0.15, -0.2);
    evapG.add(tube);
  }
  group.add(evapG);
  parts.push({ name: 'Evaporator', description: 'Plate-type evaporator in freezer compartment. Refrigerant absorbs heat as it evaporates, cooling the compartment below 0°C.', material: 'Aluminum + Copper', function: 'Absorb heat from compartment interior', assemblyOrder: 4, connections: ['Compressor', 'Thermostat'], failureEffect: 'No freezing, food spoilage', cascadeFailures: ['Compressor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:3,z:-2} });

  // 7. Thermostat
  const thermoG = new THREE.Group();
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), whitePlastic.clone());
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.5, 1.5, 0.3);
  thermoG.add(dial);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), tinted(plastic, 0x334455));
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.5, 1.5, 0.35);
  thermoG.add(knob);
  group.add(thermoG);
  parts.push({ name: 'Thermostat', description: 'Temperature-sensing switch controlling compressor on/off cycling. Capillary tube senses evaporator temperature.', material: 'Bimetal / Electronic', function: 'Regulate internal temperature', assemblyOrder: 5, connections: ['Compressor', 'Evaporator'], failureEffect: 'Compressor runs non-stop or not at all', cascadeFailures: ['Compressor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:2,z:2} });

  // 8. Shelves
  const shelvesG = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 1.2), glass.clone());
    shelf.position.set(0, -0.6 + i * 0.8, 0.1);
    shelvesG.add(shelf);
    // shelf rails
    const railL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.2), whitePlastic.clone());
    railL.position.set(-0.85, -0.6 + i * 0.8, 0.1);
    shelvesG.add(railL);
    const railR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.2), whitePlastic.clone());
    railR.position.set(0.85, -0.6 + i * 0.8, 0.1);
    shelvesG.add(railR);
  }
  group.add(shelvesG);
  parts.push({ name: 'Shelves', description: 'Tempered glass shelves with spill-proof edges. Adjustable height for flexible storage configuration.', material: 'Tempered Glass', function: 'Organize and support stored items', assemblyOrder: 7, connections: ['Outer Casing'], failureEffect: 'Items can\'t be organized — no structural impact', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:0,z:2} });

  // 9. Insulation
  const insG = new THREE.Group();
  const insLayer = new THREE.Mesh(new THREE.BoxGeometry(1.85, 3.3, 1.35), tinted(whitePlastic, 0xeeeedd));
  insLayer.material.transparent = true;
  insLayer.material.opacity = 0.15;
  insLayer.position.set(0, 0, 0);
  insG.add(insLayer);
  group.add(insG);
  parts.push({ name: 'Insulation', description: 'Polyurethane foam injected between inner liner and outer shell. R-value determines energy efficiency.', material: 'Cyclopentane-blown PU Foam', function: 'Thermal barrier reducing heat gain', assemblyOrder: 6, connections: ['Outer Casing'], failureEffect: 'Increased heat gain, higher energy usage, warm spots', cascadeFailures: ['Compressor'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:0,z:0} });

  const quizQuestions = [
    { question: 'Where is the compressor located in a refrigerator?', options: ['Top', 'Inside the door', 'Bottom rear', 'In the freezer'], correct: 2, explanation: 'The compressor is mounted at the bottom rear of the refrigerator, usually on a mounting plate with vibration dampeners.', difficulty: 'basic' },
    { question: 'A damaged door gasket causes:', options: ['Noise', 'Air leaks, frost buildup, high energy consumption', 'Better cooling', 'Nothing significant'], correct: 1, explanation: 'A damaged gasket lets warm, humid air in, causing frost on the evaporator and making the compressor work harder.', difficulty: 'basic' },
    { question: 'Polyurethane foam insulation works by:', options: ['Reflecting heat', 'Trapping gas in closed cells with low thermal conductivity', 'Generating cold', 'Absorbing moisture'], correct: 1, explanation: 'PU foam contains trapped gas (cyclopentane) in tiny closed cells, creating very low thermal conductivity.', difficulty: 'advanced' },
    { question: 'If the thermostat fails in the "always on" position:', options: ['Nothing happens', 'Food spoils', 'Compressor runs continuously, freezer becomes too cold', 'Door won\'t close'], correct: 2, explanation: 'A stuck-on thermostat keeps the compressor running continuously, over-cooling the compartment and wasting energy.', difficulty: 'advanced' },
    { question: 'The condenser coils are hot because:', options: ['Electrical fault', 'They reject heat absorbed from inside the fridge', 'Motor friction', 'Poor design'], correct: 1, explanation: 'Condenser coils release the heat that the evaporator absorbed from the food compartment, plus compressor work heat.', difficulty: 'basic' },
    { question: 'Energy Star ratings for refrigerators primarily measure:', options: ['Noise level', 'Annual energy consumption (kWh/year)', 'Cooling speed', 'Size'], correct: 1, explanation: 'Energy Star certification is based on standardized annual energy consumption compared to federal minimum standards.', difficulty: 'expert' },
  ];

  return {
    group, parts, description: 'A domestic refrigerator using vapor-compression cycle to maintain food at safe temperatures. Features insulated cabinet, sealed compressor, and automatic temperature control.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Compressor vibration
      if (meshes[3]) {
        meshes[3].group.position.x = Math.sin(t * 30) * 0.003;
        meshes[3].group.position.z = Math.cos(t * 30) * 0.003;
      }
    }
  };
}
