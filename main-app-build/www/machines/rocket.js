// ═══════════════════════════════════════════════════════════════════
// Rocket Engine (Liquid Fuel)
// ═══════════════════════════════════════════════════════════════════
import { aluminum, darkSteel, steel, titanium, copper, brass, fire, carbonFiber, chrome, tinted } from '../utils/materials.js';

export function createRocket(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Nose Cone
  const noseG = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 24), aluminum.clone());
  cone.position.y = 5.5;
  noseG.add(cone);
  const coneTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 12), chrome.clone());
  coneTip.position.y = 6.35;
  noseG.add(coneTip);
  group.add(noseG);
  parts.push({ name: 'Nose Cone', description: 'Aerodynamic fairing protecting payload. Ogive shape minimizes drag. Jettisoned after atmospheric exit.', material: 'Aluminum / Carbon Fiber', function: 'Aerodynamic drag reduction, payload protection', assemblyOrder: 10, connections: ['Oxidizer Tank'], failureEffect: 'Increased drag, structural failure at high velocity', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:4,z:0} });

  // 2. Oxidizer Tank
  const oxiG = new THREE.Group();
  const oxiBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.0, 24), tinted(aluminum, 0xccddee));
  oxiBody.position.y = 3.7;
  oxiG.add(oxiBody);
  const oxiTop = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI*2, 0, Math.PI/2), tinted(aluminum, 0xccddee));
  oxiTop.position.y = 4.7;
  oxiG.add(oxiTop);
  const oxiBot = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI*2, Math.PI/2, Math.PI/2), tinted(aluminum, 0xccddee));
  oxiBot.position.y = 2.7;
  oxiG.add(oxiBot);
  // LOX label ring
  const oxiRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.02, 8, 24), tinted(steel, 0x6688bb));
  oxiRing.position.y = 3.7;
  oxiG.add(oxiRing);
  group.add(oxiG);
  parts.push({ name: 'Oxidizer Tank', description: 'Pressurized tank containing liquid oxygen (LOX) at -183°C. Feeds oxidizer to combustion chamber via turbopump.', material: 'Aluminum-Lithium Alloy', function: 'Store liquid oxidizer', assemblyOrder: 2, connections: ['Nose Cone', 'Fuel Tank', 'Oxidizer Lines', 'Turbopump'], failureEffect: 'Catastrophic — loss of oxidizer, engine shutdown', cascadeFailures: ['Turbopump', 'Combustion Chamber'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:4,z:2} });

  // 3. Fuel Tank
  const fuelG = new THREE.Group();
  const fuelBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.8, 24), tinted(aluminum, 0xddccaa));
  fuelBody.position.y = 1.5;
  fuelG.add(fuelBody);
  const fuelTop = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI*2, 0, Math.PI/2), tinted(aluminum, 0xddccaa));
  fuelTop.position.y = 2.4;
  fuelG.add(fuelTop);
  const fuelBot = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI*2, Math.PI/2, Math.PI/2), tinted(aluminum, 0xddccaa));
  fuelBot.position.y = 0.6;
  fuelG.add(fuelBot);
  const fuelRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.02, 8, 24), tinted(steel, 0xbb8844));
  fuelRing.position.y = 1.5;
  fuelG.add(fuelRing);
  group.add(fuelG);
  parts.push({ name: 'Fuel Tank', description: 'Contains RP-1 (refined kerosene) or liquid hydrogen. Insulated to minimize boil-off for cryogenic fuels.', material: 'Aluminum-Lithium Alloy', function: 'Store propellant fuel', assemblyOrder: 3, connections: ['Oxidizer Tank', 'Fuel Lines', 'Turbopump'], failureEffect: 'Catastrophic — loss of fuel, engine shutdown', cascadeFailures: ['Turbopump', 'Combustion Chamber'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:2,z:-2} });

  // 4. Turbopump
  const pumpG = new THREE.Group();
  const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16), darkSteel.clone());
  pumpBody.position.y = 0.1;
  pumpG.add(pumpBody);
  // Turbine section
  const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.2, 16), titanium.clone());
  turbine.position.y = 0.4;
  pumpG.add(turbine);
  // Blades visible
  for (let i = 0; i < 8; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.04), steel.clone());
    const a = (i / 8) * Math.PI * 2;
    blade.position.set(Math.sin(a) * 0.2, 0.4, Math.cos(a) * 0.2);
    blade.rotation.y = a;
    pumpG.add(blade);
  }
  group.add(pumpG);
  parts.push({ name: 'Turbopump', description: 'High-speed pump (30,000+ RPM) driven by hot-gas turbine. Raises propellant pressure from tank level to combustion chamber pressure.', material: 'Inconel / Titanium', function: 'Pressurize propellants for injection', assemblyOrder: 4, connections: ['Fuel Tank', 'Oxidizer Tank', 'Combustion Chamber'], failureEffect: 'Catastrophic — cannot deliver propellant at required pressure', cascadeFailures: ['Combustion Chamber', 'Nozzle'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:0,z:0} });

  // 5. Combustion Chamber
  const chamberG = new THREE.Group();
  const chamberWall = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 24), darkSteel.clone());
  chamberWall.position.y = -0.6;
  chamberG.add(chamberWall);
  // Cooling channels (visual rings)
  for (let i = 0; i < 5; i++) {
    const coolRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.015, 8, 24), copper.clone());
    coolRing.position.y = -0.3 - i * 0.15;
    chamberG.add(coolRing);
  }
  group.add(chamberG);
  parts.push({ name: 'Combustion Chamber', description: 'Where fuel and oxidizer combust at ~3,500°C and ~200 atm. Regeneratively cooled by fuel flowing through wall channels.', material: 'Inconel + Copper liner', function: 'Contain and direct combustion', assemblyOrder: 5, connections: ['Turbopump', 'Injector Plate', 'Nozzle'], failureEffect: 'Catastrophic — burn-through, uncontained explosion', cascadeFailures: ['Nozzle'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-2,z:2} });

  // 6. Nozzle (Bell)
  const nozzleG = new THREE.Group();
  // Bell nozzle - converging then diverging
  const nozzleShape = new THREE.LatheGeometry([
    new THREE.Vector2(0.4, 0), new THREE.Vector2(0.2, -0.3),
    new THREE.Vector2(0.15, -0.5), new THREE.Vector2(0.2, -0.7),
    new THREE.Vector2(0.5, -1.2), new THREE.Vector2(0.7, -1.8)
  ], 32);
  const nozzle = new THREE.Mesh(nozzleShape, darkSteel.clone());
  nozzle.position.y = -1.0;
  nozzleG.add(nozzle);
  // Nozzle extension rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3 + i * 0.15, 0.02, 8, 24), steel.clone());
    ring.position.y = -1.5 - i * 0.5;
    nozzleG.add(ring);
  }
  group.add(nozzleG);
  parts.push({ name: 'Nozzle', description: 'De Laval (converging-diverging) nozzle. Accelerates exhaust gases to supersonic velocities. Area ratio determines expansion and thrust.', material: 'Ablative / Regen-cooled Inconel', function: 'Expand and accelerate exhaust gases', assemblyOrder: 6, connections: ['Combustion Chamber'], failureEffect: 'Loss of thrust vectoring, reduced Isp', cascadeFailures: [], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:0,y:-4,z:0} });

  // 7. Injector Plate
  const injG = new THREE.Group();
  const injDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 24), copper.clone());
  injDisc.position.y = -0.17;
  injG.add(injDisc);
  // Injection ports
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 6), brass.clone());
    port.position.set(Math.sin(a) * 0.25, -0.17, Math.cos(a) * 0.25);
    injG.add(port);
  }
  group.add(injG);
  parts.push({ name: 'Injector Plate', description: 'Perforated plate with precisely designed orifices that atomize and mix fuel and oxidizer for efficient combustion.', material: 'Copper Alloy', function: 'Atomize and mix propellants', assemblyOrder: 7, connections: ['Combustion Chamber', 'Turbopump'], failureEffect: 'Combustion instability, hot spots, potential chamber burnthrough', cascadeFailures: ['Combustion Chamber'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:2,y:-1,z:2} });

  // 8. Fuel Lines
  const fLineG = new THREE.Group();
  const fPoints = [new THREE.Vector3(0.3,0.6,0.4), new THREE.Vector3(0.5,0.3,0.3), new THREE.Vector3(0.4,0.1,0.2)];
  const fCurve = new THREE.CatmullRomCurve3(fPoints);
  const fTube = new THREE.Mesh(new THREE.TubeGeometry(fCurve, 12, 0.04, 8, false), copper.clone());
  fLineG.add(fTube);
  group.add(fLineG);
  parts.push({ name: 'Fuel Lines', description: 'High-pressure tubing carrying fuel from tank to turbopump. Must withstand cryogenic temperatures and high pressures.', material: 'Stainless Steel / Inconel', function: 'Transport fuel to turbopump', assemblyOrder: 8, connections: ['Fuel Tank', 'Turbopump'], failureEffect: 'Fuel leak — fire/explosion risk', cascadeFailures: ['Turbopump'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:1,z:2} });

  // 9. Oxidizer Lines
  const oLineG = new THREE.Group();
  const oPoints = [new THREE.Vector3(-0.3,2.7,-0.4), new THREE.Vector3(-0.5,1.5,-0.3), new THREE.Vector3(-0.4,0.3,-0.2)];
  const oCurve = new THREE.CatmullRomCurve3(oPoints);
  const oTube = new THREE.Mesh(new THREE.TubeGeometry(oCurve, 12, 0.04, 8, false), tinted(copper, 0x88aacc));
  oLineG.add(oTube);
  group.add(oLineG);
  parts.push({ name: 'Oxidizer Lines', description: 'Insulated tubing carrying LOX from tank to turbopump. Vacuum-jacketed to minimize boil-off.', material: 'Stainless Steel + Vacuum Jacket', function: 'Transport oxidizer to turbopump', assemblyOrder: 9, connections: ['Oxidizer Tank', 'Turbopump'], failureEffect: 'Oxidizer leak — extreme fire/explosion hazard', cascadeFailures: ['Turbopump'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:-3,y:3,z:-2} });

  // 10. Outer Shell / Fairing
  const shellG = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 6.0, 32, 1, true), carbonFiber.clone());
  shell.material.transparent = true; shell.material.opacity = 0.15;
  shell.position.y = 2.5;
  shellG.add(shell);
  group.add(shellG);
  parts.push({ name: 'Outer Shell', description: 'Structural fairing enclosing tanks and engine. Provides aerodynamic profile and structural load path.', material: 'Carbon Fiber / Aluminum', function: 'Aerodynamic shell, structural integrity', assemblyOrder: 1, connections: ['Oxidizer Tank', 'Fuel Tank'], failureEffect: 'Aerodynamic breakup at high velocity', cascadeFailures: ['Oxidizer Tank', 'Fuel Tank'], originalPosition:{x:0,y:0,z:0}, explodedPosition:{x:3,y:2,z:3} });

  const quizQuestions = [
    { question: 'What type of nozzle is used in a rocket engine?', options: ['Straight pipe', 'De Laval (converging-diverging)', 'Orifice plate', 'Venturi only'], correct: 1, explanation: 'A De Laval nozzle converges to a throat then diverges, accelerating exhaust from subsonic to supersonic velocities.', difficulty: 'basic' },
    { question: 'What is specific impulse (Isp)?', options: ['Engine weight', 'Thrust per unit mass flow rate of propellant', 'Fuel temperature', 'Tank pressure'], correct: 1, explanation: 'Isp measures engine efficiency — how much thrust is produced per unit of propellant consumed per second.', difficulty: 'advanced' },
    { question: 'The turbopump typically rotates at:', options: ['100 RPM', '1,000 RPM', '30,000+ RPM', '1 RPM'], correct: 2, explanation: 'Turbopumps spin at extremely high speeds (30,000-70,000 RPM) to achieve the required pressure ratios.', difficulty: 'advanced' },
    { question: 'Regenerative cooling means:', options: ['Using ice', 'Fuel flows through chamber wall channels before combustion', 'External water spray', 'Radiative cooling'], correct: 1, explanation: 'Fuel circulates through channels in the chamber walls, absorbing heat before being injected for combustion — dual benefit.', difficulty: 'expert' },
    { question: 'Why is the oxidizer tank above the fuel tank?', options: ['Convention', 'LOX is denser — keeps center of gravity forward for stability', 'Easier to fill', 'No reason'], correct: 1, explanation: 'LOX is denser than RP-1, so placing it higher keeps the vehicle center of gravity forward for aerodynamic stability.', difficulty: 'expert' },
    { question: 'Newton\'s Third Law in rocketry means:', options: ['F = ma only', 'Exhaust pushed backward creates equal forward thrust', 'Gravity pulls equally', 'Mass is conserved'], correct: 1, explanation: 'The rocket pushes exhaust mass backward; by Newton\'s Third Law, the exhaust pushes the rocket forward with equal force.', difficulty: 'basic' },
  ];

  return {
    group, parts, description: 'A liquid-fueled rocket engine using LOX/RP-1 propellants. Features turbopump-fed combustion chamber with regenerative cooling and De Laval nozzle.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // Fire glow in nozzle
      if (meshes[5]) {
        meshes[5].group.children.forEach(c => {
          if (c.isMesh && c.material.emissive) {
            c.material.emissive.set(0xff4400);
            c.material.emissiveIntensity = 0.3 + Math.sin(t * 10) * 0.2;
          }
        });
      }
      // Turbopump spin
      if (meshes[3]) meshes[3].group.rotation.y = t * 15;
    }
  };
}
