export function createPulsarStar(THREE) {
  const group = new THREE.Group();

  // 1. Neutron Star Core
  const coreGeo = new THREE.SphereGeometry(2, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xaaaaff, emissive: 0x5555ff, emissiveIntensity: 0.8 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.userData = { id: 'core', name: 'Neutron Star Core', description: 'Extremely dense degenerate matter.' };
  group.add(core);

  // 2. Crust
  const crustGeo = new THREE.SphereGeometry(2.1, 32, 32);
  const crustMat = new THREE.MeshStandardMaterial({ color: 0x8888aa, transparent: true, opacity: 0.5, wireframe: true });
  const crust = new THREE.Mesh(crustGeo, crustMat);
  crust.userData = { id: 'crust', name: 'Solid Crust', description: 'Rigid outer layer of nuclei and electrons.' };
  group.add(crust);

  // 3. Magnetic Axis Top
  const magAxisTGeo = new THREE.CylinderGeometry(0.1, 0.1, 10);
  const axisMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const magAxisT = new THREE.Mesh(magAxisTGeo, axisMat);
  magAxisT.position.y = 5;
  magAxisT.userData = { id: 'mag_axis_top', name: 'Magnetic Axis', description: 'Axis of the intense magnetic field, offset from rotation axis.' };
  group.add(magAxisT);

  // 4. Magnetic Axis Bottom
  const magAxisB = new THREE.Mesh(magAxisTGeo, axisMat);
  magAxisB.position.y = -5;
  magAxisB.userData = { id: 'mag_axis_bottom', name: 'Magnetic Axis (South)', description: 'Southern pole of the magnetic field.' };
  group.add(magAxisB);

  // 5. Rotation Axis
  const rotAxisGeo = new THREE.CylinderGeometry(0.05, 0.05, 12);
  const rotAxisMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const rotAxis = new THREE.Mesh(rotAxisGeo, rotAxisMat);
  rotAxis.userData = { id: 'rot_axis', name: 'Rotation Axis', description: 'The axis around which the star rapidly spins.' };
  group.add(rotAxis);

  // 6. Radiation Beam Top
  const beamGeo = new THREE.ConeGeometry(2, 15, 32);
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2, transparent: true, opacity: 0.6 });
  const beamTop = new THREE.Mesh(beamGeo, beamMat);
  beamTop.position.y = 8;
  beamTop.userData = { id: 'beam_top', name: 'Radiation Beam', description: 'Electromagnetic radiation emitted from the magnetic pole.' };
  group.add(beamTop);

  // 7. Radiation Beam Bottom
  const beamBottom = new THREE.Mesh(beamGeo, beamMat);
  beamBottom.position.y = -8;
  beamBottom.rotation.x = Math.PI;
  beamBottom.userData = { id: 'beam_bottom', name: 'Radiation Beam (South)', description: 'Electromagnetic radiation from the southern pole.' };
  group.add(beamBottom);

  // 8. Magnetic Field Lines Inner
  const magLinesIGeo = new THREE.TorusGeometry(4, 0.1, 8, 32);
  const magLinesIMat = new THREE.MeshBasicMaterial({ color: 0xff55ff, transparent: true, opacity: 0.4 });
  const magLinesI = new THREE.Mesh(magLinesIGeo, magLinesIMat);
  magLinesI.userData = { id: 'mag_lines_in', name: 'Inner Magnetic Field', description: 'Trillions of Gauss strong field lines.' };
  group.add(magLinesI);

  // 9. Magnetic Field Lines Outer
  const magLinesOGeo = new THREE.TorusGeometry(7, 0.1, 8, 32);
  const magLinesO = new THREE.Mesh(magLinesOGeo, magLinesIMat);
  magLinesO.userData = { id: 'mag_lines_out', name: 'Outer Magnetic Field', description: 'Further field lines.' };
  group.add(magLinesO);

  // 10. Accretion Spark
  const sparkGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const spark = new THREE.Mesh(sparkGeo, sparkMat);
  spark.position.set(1.5, 1.5, 0);
  spark.userData = { id: 'spark', name: 'Hotspot', description: 'Region where matter hits the surface, emitting X-rays.' };
  group.add(spark);

  // Parent rotation group for offset magnetic axis
  const pulsarSystem = new THREE.Group();
  pulsarSystem.add(magAxisT);
  pulsarSystem.add(magAxisB);
  pulsarSystem.add(beamTop);
  pulsarSystem.add(beamBottom);
  pulsarSystem.add(magLinesI);
  pulsarSystem.add(magLinesO);
  pulsarSystem.add(spark);
  
  // Tilt magnetic axis by 20 degrees
  pulsarSystem.rotation.z = Math.PI / 9;
  
  const mainSystem = new THREE.Group();
  mainSystem.add(core);
  mainSystem.add(crust);
  mainSystem.add(rotAxis);
  mainSystem.add(pulsarSystem);

  group.userData.animate = function(delta) {
    // Rapid rotation of the tilted pulsar system
    mainSystem.rotation.y += 0.2;
    core.rotation.y += 0.2;
    crust.rotation.y += 0.2;
  };

  group.userData.quiz = [
    { question: "What causes the 'pulsing' effect of a pulsar?", options: ["The star swelling and shrinking", "Radiation beams sweeping across our line of sight", "Nuclear explosions on the surface"], answer: 1 },
    { question: "Pulsars are a highly magnetized, rotating type of which star?", options: ["White Dwarf", "Red Giant", "Neutron Star"], answer: 2 }
  ];

  group.add(mainSystem);
  return group;
}
