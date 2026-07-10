import { steel, aluminum, darkSteel, gold, copper, brass, redAccent } from '../utils/materials.js';

export function createTurbine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Material for hot section (Inconel/Ceramic)
  const hotMat = new THREE.MeshStandardMaterial({
    color: 0x331100, emissive: 0xff3300, emissiveIntensity: 0.1, roughness: 0.7, metalness: 0.8
  });

  // 1. Intake Cowling (Outer Casing Front)
  const intakeG = new THREE.Group();
  const cowling = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.8, 1.5, 32, 1, true), aluminum.clone());
  cowling.rotation.z = Math.PI / 2;
  cowling.position.set(-3.5, 0, 0);
  cowling.material.side = THREE.DoubleSide;
  intakeG.add(cowling);
  group.add(intakeG);
  parts.push({
    name: 'Air Intake Cowling', description: 'Aerodynamic housing that directs ambient air into the compressor section.', material: 'Aluminum / Composite', function: 'Air guidance', assemblyOrder: 1, connections: ['Compressor Casing'], failureEffect: 'Airflow disruption (Compressor Stall)', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-2, y:0, z:0}
  });

  // 2. Main Fan (Bypass Fan)
  const fanG = new THREE.Group();
  const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16), steel.clone());
  fanHub.rotation.z = Math.PI / 2;
  fanHub.position.set(-3.5, 0, 0);
  fanG.add(fanHub);
  
  for(let i=0; i<24; i++) {
      const angle = (i/24) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.3), darkSteel.clone());
      blade.position.set(-3.5, Math.sin(angle)*1.2, Math.cos(angle)*1.2);
      blade.rotation.x = -angle;
      blade.rotation.y = 0.3; // pitch
      fanG.add(blade);
  }
  group.add(fanG);
  parts.push({
    name: 'Main Turbofan', description: 'Massive front fan that pulls in air. In modern engines, 80% of this air bypasses the core entirely to provide thrust.', material: 'Titanium', function: 'Initial compression & Thrust', assemblyOrder: 2, connections: ['Low Pressure Shaft'], failureEffect: 'Bird strike / Blade containment failure', cascadeFailures: ['Compressor'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-4, y:0, z:0}
  });

  // 3. Low Pressure Compressor (LPC)
  const lpcG = new THREE.Group();
  for(let stage=0; stage<4; stage++) {
      const radius = 1.3 - (stage * 0.1);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), steel.clone());
      hub.rotation.z = Math.PI / 2;
      hub.position.set(-2.5 + stage*0.3, 0, 0);
      lpcG.add(hub);
      
      for(let i=0; i<30; i++) {
          const angle = (i/30) * Math.PI * 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, radius, 0.15), darkSteel.clone());
          blade.position.set(-2.5 + stage*0.3, Math.sin(angle)*(radius/2 + 0.2), Math.cos(angle)*(radius/2 + 0.2));
          blade.rotation.x = -angle;
          blade.rotation.y = 0.4;
          lpcG.add(blade);
      }
  }
  group.add(lpcG);
  parts.push({
    name: 'Low Pressure Compressor (LPC)', description: 'Multi-stage axial compressor that begins squeezing the air, raising its pressure and temperature.', material: 'Titanium Alloys', function: 'Air compression', assemblyOrder: 3, connections: ['Main Fan', 'HPC'], failureEffect: 'Compressor surge', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 4. High Pressure Compressor (HPC)
  const hpcG = new THREE.Group();
  for(let stage=0; stage<6; stage++) {
      const radius = 0.9 - (stage * 0.05);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16), steel.clone());
      hub.rotation.z = Math.PI / 2;
      hub.position.set(-1.0 + stage*0.2, 0, 0);
      hpcG.add(hub);
      
      for(let i=0; i<40; i++) {
          const angle = (i/40) * Math.PI * 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, radius, 0.1), brass.clone());
          blade.position.set(-1.0 + stage*0.2, Math.sin(angle)*(radius/2 + 0.15), Math.cos(angle)*(radius/2 + 0.15));
          blade.rotation.x = -angle;
          blade.rotation.y = 0.5;
          hpcG.add(blade);
      }
  }
  group.add(hpcG);
  parts.push({
    name: 'High Pressure Compressor (HPC)', description: 'Spins much faster than the LPC. Squeezes air to extreme pressures (up to 40x atmospheric) before combustion.', material: 'Nickel Alloys', function: 'Final compression', assemblyOrder: 4, connections: ['LPC', 'Combustion Chamber'], failureEffect: 'Flameout', cascadeFailures: ['Combustion Chamber'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 5. Combustion Chamber (Combustor)
  const combG = new THREE.Group();
  const combustor = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 16, 32), hotMat);
  combustor.rotation.y = Math.PI / 2;
  combustor.position.set(0.5, 0, 0);
  combG.add(combustor);
  // Fuel Injectors
  for(let i=0; i<12; i++) {
      const inj = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), steel.clone());
      const angle = (i/12) * Math.PI * 2;
      inj.position.set(0.2, Math.sin(angle)*0.8, Math.cos(angle)*0.8);
      inj.rotation.x = -angle;
      inj.rotation.z = Math.PI / 2;
      combG.add(inj);
  }
  group.add(combG);
  parts.push({
    name: 'Combustion Chamber', description: 'Fuel is continuously sprayed into the highly compressed air and ignited. Temperatures exceed the melting point of the metal itself.', material: 'Ceramic Matrix Composites', function: 'Energy addition (Combustion)', assemblyOrder: 5, connections: ['HPC', 'HPT'], failureEffect: 'Engine explosion', cascadeFailures: ['HPT', 'Outer Casing'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:7, z:0}
  });

  // 6. High Pressure Turbine (HPT)
  const hptG = new THREE.Group();
  for(let stage=0; stage<2; stage++) {
      const radius = 0.8;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), hotMat.clone());
      hub.rotation.z = Math.PI / 2;
      hub.position.set(1.2 + stage*0.3, 0, 0);
      hptG.add(hub);
      
      for(let i=0; i<36; i++) {
          const angle = (i/36) * Math.PI * 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, radius, 0.15), hotMat.clone());
          blade.position.set(1.2 + stage*0.3, Math.sin(angle)*(radius/2 + 0.15), Math.cos(angle)*(radius/2 + 0.15));
          blade.rotation.x = -angle;
          blade.rotation.y = -0.5; // Opposite pitch to extract energy
          hptG.add(blade);
      }
  }
  group.add(hptG);
  parts.push({
    name: 'High Pressure Turbine (HPT)', description: 'Extracts kinetic energy from the blazing exhaust gases to drive the High Pressure Compressor via a hollow outer shaft.', material: 'Single-crystal Inconel', function: 'Power extraction for HPC', assemblyOrder: 6, connections: ['Combustion Chamber', 'HPC'], failureEffect: 'Turbine blade creep/shatter', cascadeFailures: ['LPT'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:5, z:0}
  });

  // 7. Low Pressure Turbine (LPT)
  const lptG = new THREE.Group();
  for(let stage=0; stage<4; stage++) {
      const radius = 1.0 + (stage * 0.05);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), steel.clone());
      hub.rotation.z = Math.PI / 2;
      hub.position.set(2.2 + stage*0.3, 0, 0);
      lptG.add(hub);
      
      for(let i=0; i<40; i++) {
          const angle = (i/40) * Math.PI * 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, radius, 0.2), darkSteel.clone());
          blade.position.set(2.2 + stage*0.3, Math.sin(angle)*(radius/2 + 0.2), Math.cos(angle)*(radius/2 + 0.2));
          blade.rotation.x = -angle;
          blade.rotation.y = -0.4;
          lptG.add(blade);
      }
  }
  group.add(lptG);
  parts.push({
    name: 'Low Pressure Turbine (LPT)', description: 'Extracts the remaining energy from the exhaust to drive the massive front Fan and LPC via an inner concentric shaft.', material: 'Nickel Alloys', function: 'Power extraction for Fan/LPC', assemblyOrder: 7, connections: ['HPT', 'Main Fan'], failureEffect: 'Loss of thrust', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 8. Concentric Shafts (Spools)
  const shaftG = new THREE.Group();
  // Inner shaft (LPC to Fan)
  const innerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6.5, 16), steel.clone());
  innerShaft.rotation.z = Math.PI / 2;
  innerShaft.position.set(-0.25, 0, 0);
  shaftG.add(innerShaft);
  // Outer shaft (HPT to HPC)
  const outerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16), brass.clone());
  outerShaft.rotation.z = Math.PI / 2;
  outerShaft.position.set(0.1, 0, 0);
  shaftG.add(outerShaft);
  group.add(shaftG);
  parts.push({
    name: 'Dual Concentric Shafts', description: 'The inner shaft spins slower (driving the fan), while the outer hollow shaft spins rapidly (driving the core compressor).', material: 'High-strength Steel', function: 'Power transmission', assemblyOrder: 8, connections: ['Turbines', 'Compressors'], failureEffect: 'Shaft shear / Catastrophic failure', cascadeFailures: ['Turbines', 'Compressors'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-3, z:0}
  });

  // 9. Exhaust Nozzle
  const exhaustG = new THREE.Group();
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.0, 1.5, 32, 1, true), darkSteel.clone());
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(4.0, 0, 0);
  nozzle.material.side = THREE.DoubleSide;
  exhaustG.add(nozzle);
  group.add(exhaustG);
  parts.push({
    name: 'Exhaust Nozzle', description: 'Shapes the expanding hot gases to maximize rearward thrust (Newton\'s Third Law).', material: 'Titanium', function: 'Thrust vectoring / Generation', assemblyOrder: 9, connections: ['LPT'], failureEffect: 'Thrust reduction', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:2, y:0, z:0}
  });

  // 10. Outer Casing (Cutaway)
  const casingG = new THREE.Group();
  const caseHPC = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32, 1, true, 0, Math.PI), aluminum.clone());
  caseHPC.rotation.z = Math.PI / 2;
  caseHPC.position.set(-0.5, 0, 0);
  caseHPC.material.side = THREE.DoubleSide;
  caseHPC.material.transparent = true;
  caseHPC.material.opacity = 0.3;
  casingG.add(caseHPC);
  group.add(casingG);
  parts.push({
    name: 'Engine Core Casing', description: 'Contains the extreme pressures of the core. Shown as a transparent cutaway.', material: 'Titanium / Kevlar', function: 'Containment', assemblyOrder: 10, connections: ['All Stages'], failureEffect: 'Uncontained engine failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-5, z:0}
  });

  const quizQuestions = [
    { question: 'What is the "Bypass Ratio" in a modern turbofan engine?', options: ['The ratio of fuel to air', 'The amount of air that goes around the core vs the amount that goes through the combustion core', 'The speed of the fan compared to the speed of the plane', 'The ratio of compressor blades to turbine blades'], correct: 1, explanation: 'In modern airliners, up to 80-90% of the thrust comes from the giant fan pushing cold air AROUND the engine core (high bypass). Only a fraction goes into the core to keep the engine running.', difficulty: 'basic' },
    { question: 'Why does a gas turbine engine have two (or sometimes three) concentric shafts?', options: ['For backup in case one breaks', 'Because the massive front fan needs to spin much slower than the small, high-pressure inner compressor', 'To pump fuel through the middle', 'To reverse the thrust'], correct: 1, explanation: 'If the giant front fan spun as fast as the core compressor, the tips of the fan blades would go supersonic and shatter. The inner shaft allows the fan and Low Pressure Turbine to spin slower than the core.', difficulty: 'advanced' },
    { question: 'The temperature inside the combustion chamber is higher than the melting point of the turbine blades. How do the blades survive?', options: ['They are made of diamond', 'They are cooled by a layer of air bled from the compressor that flows through tiny holes in the blades', 'They actually do melt slightly and reform', 'They are sprayed with water'], correct: 1, explanation: 'Complex internal cooling channels and microscopic holes in the turbine blades create a thin "film" of cooler air that insulates the metal from the 2000°C+ exhaust gases.', difficulty: 'expert' },
    { question: 'What is a "Compressor Stall"?', options: ['When the engine runs out of fuel', 'An aerodynamic disruption where the compressor blades stall (like an airplane wing), causing air to violently blast backward out the front', 'When the gears lock up', 'When the turbine melts'], correct: 1, explanation: 'Compressor blades are just spinning airfoils. If the air enters at the wrong angle or speed, they lose lift (stall), the pressure gradient collapses, and fiery air surges backward.', difficulty: 'advanced' },
    { question: 'What principle governs the thrust generated by a jet engine?', options: ['Bernoulli\'s Principle', 'Newton\'s Third Law of Motion', 'Thermodynamic Equilibrium', 'The Doppler Effect'], correct: 1, explanation: '"For every action, there is an equal and opposite reaction." The engine accelerates a mass of air backward (action), which pushes the engine forward (reaction).', difficulty: 'basic' }
  ];

  return {
    group, parts, description: 'A dual-spool High-Bypass Turbofan Engine (Jet Engine).', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      // N1 Spool (Low Pressure - Fan, LPC, LPT) spins slower
      const n1Speed = t * 10;
      if (meshes[1]) meshes[1].group.rotation.x = n1Speed; // Fan
      if (meshes[2]) meshes[2].group.rotation.x = n1Speed; // LPC
      if (meshes[6]) meshes[6].group.rotation.x = n1Speed; // LPT
      
      // N2 Spool (High Pressure - HPC, HPT) spins faster
      const n2Speed = t * 25;
      if (meshes[3]) meshes[3].group.rotation.x = n2Speed; // HPC
      if (meshes[5]) meshes[5].group.rotation.x = n2Speed; // HPT
      
      // Shafts
      if (meshes[7]) {
          meshes[7].group.children[0].rotation.x = n1Speed; // Inner
          meshes[7].group.children[1].rotation.x = n2Speed; // Outer
      }
      
      // Combustion pulse
      if (meshes[4]) {
          meshes[4].group.children[0].material.emissiveIntensity = 0.2 + Math.sin(t*20)*0.1;
      }
    }
  };
}
