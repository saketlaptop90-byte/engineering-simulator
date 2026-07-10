export function createTectonicPlateBoundary(THREE) {
  const group = new THREE.Group();

  // 1. Asthenosphere (Ductile Mantle)
  const asthenoGeo = new THREE.BoxGeometry(20, 4, 10);
  const asthenoMat = new THREE.MeshStandardMaterial({ color: 0xff4400, roughness: 1, emissive: 0x441100 });
  const asthenosphere = new THREE.Mesh(asthenoGeo, asthenoMat);
  asthenosphere.position.y = -6;
  group.add(asthenosphere);
  asthenosphere.userData = { id: 'asthenosphere', name: 'Asthenosphere (Mantle)', description: 'The highly viscous, mechanically weak and ductile region of the upper mantle. Convection currents here drive plate motion.' };

  // 2. Continental Crust (Left Plate)
  const contGeo = new THREE.BoxGeometry(8, 3, 10);
  const contMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
  const continentalPlate = new THREE.Mesh(contGeo, contMat);
  continentalPlate.position.set(-6, -2.5, 0);
  group.add(continentalPlate);
  continentalPlate.userData = { id: 'continental_crust', name: 'Continental Crust', description: 'Thick, less dense crust (granitic rock). Floats high on the mantle.' };

  // 3. Oceanic Crust (Right Plate - Subducting)
  const oceanGeo = new THREE.BoxGeometry(10, 1.5, 10);
  const oceanMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
  const oceanicPlate = new THREE.Mesh(oceanGeo, oceanMat);
  oceanicPlate.position.set(5, -3.25, 0);
  group.add(oceanicPlate);
  oceanicPlate.userData = { id: 'oceanic_crust', name: 'Oceanic Crust', description: 'Thin, incredibly dense crust (basaltic rock). Heavy enough to sink into the mantle.' };

  // 4. Subduction Zone / Trench
  const subductGeo = new THREE.BoxGeometry(8, 1.5, 10);
  const subductPlate = new THREE.Mesh(subductGeo, oceanMat);
  subductPlate.position.set(-2, -5, 0);
  subductPlate.rotation.z = Math.PI / 6; // Angled down
  group.add(subductPlate);
  subductPlate.userData = { id: 'subduction_zone', name: 'Subduction Zone (Wadati-Benioff Zone)', description: 'The dense oceanic plate is forced under the lighter continental plate, melting as it descends.' };

  // Trench Visual
  const trenchGeo = new THREE.BoxGeometry(2, 0.5, 10);
  const trenchMat = new THREE.MeshBasicMaterial({ color: 0x000033 });
  const trench = new THREE.Mesh(trenchGeo, trenchMat);
  trench.position.set(-1, -2.5, 0);
  group.add(trench);
  trench.userData = { id: 'ocean_trench', name: 'Oceanic Trench', description: 'A deep topographic depression formed at the subduction line (e.g., Mariana Trench).' };

  // 5. Ocean Water
  const waterGeo = new THREE.BoxGeometry(12, 2.5, 10);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0055aa, transparent: true, opacity: 0.6, roughness: 0.1 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(4, -1.25, 0);
  group.add(water);

  // 6. Volcanic Arc (Formed by melting subducted plate)
  const volcanoGeo = new THREE.ConeGeometry(2, 2.5, 16);
  const volcanoMat = new THREE.MeshStandardMaterial({ color: 0x664433 });
  const volcano = new THREE.Mesh(volcanoGeo, volcanoMat);
  volcano.position.set(-6, 0.25, 0);
  group.add(volcano);
  volcano.userData = { id: 'volcanic_arc', name: 'Continental Volcanic Arc', description: 'Water from the subducted plate lowers the melting point of the mantle, generating magma that rises to form volcanoes (e.g., The Andes).' };

  // Magma rising
  const magmaGeo = new THREE.CylinderGeometry(0.3, 0.1, 4);
  const magma = new THREE.Mesh(magmaGeo, new THREE.MeshBasicMaterial({ color: 0xff3300 }));
  magma.position.set(-6, -2, 0);
  group.add(magma);

  // 7. Accretionary Wedge
  const wedgeGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 3);
  const wedgeMat = new THREE.MeshStandardMaterial({ color: 0x997755 });
  const accretionaryWedge = new THREE.Mesh(wedgeGeo, wedgeMat);
  accretionaryWedge.rotation.x = Math.PI / 2;
  accretionaryWedge.position.set(-2.5, -1.5, 0);
  group.add(accretionaryWedge);
  accretionaryWedge.userData = { id: 'accretionary_wedge', name: 'Accretionary Wedge', description: 'Sediments scraped off the descending oceanic plate, piled up like snow before a plow.' };

  // 8. Earthquakes (Hypocenters)
  const quakeGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const quakeMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const quakesGroup = new THREE.Group();
  group.add(quakesGroup);

  for(let i=0; i<8; i++) {
    const q = new THREE.Mesh(quakeGeo, quakeMat);
    // Position along the subduction interface
    q.position.set(-1 - i*0.8, -3.5 - i*0.5, (Math.random()-0.5)*8);
    quakesGroup.add(q);
  }
  quakesGroup.children[0].userData = { id: 'earthquakes', name: 'Earthquake Hypocenters', description: 'Friction locks the plates together until they snap, releasing massive seismic energy.' };

  // 9. Convection Cell Arrows (Mantle)
  const arrowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4, -5, 5.1),
    new THREE.Vector3(-2, -5, 5.1),
    new THREE.Vector3(-4, -7, 5.1),
    new THREE.Vector3(2, -7, 5.1),
    new THREE.Vector3(4, -5, 5.1)
  ]);
  const arrowGeo = new THREE.TubeGeometry(arrowCurve, 32, 0.1, 8, true);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  group.add(arrow);
  arrow.userData = { id: 'convection', name: 'Mantle Convection Current', description: 'Heat from the core causes mantle rock to rise, move laterally (dragging plates), and sink when cooled.' };

  // 10. Mid-Ocean Ridge (Far right, divergent boundary)
  const ridgeGeo = new THREE.ConeGeometry(3, 1.5, 16);
  const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
  ridge.position.set(9, -3.25, 0);
  group.add(ridge);
  ridge.userData = { id: 'mid_ocean_ridge', name: 'Mid-Ocean Ridge (Divergent)', description: 'New oceanic crust is created here as plates pull apart and magma rises to fill the gap.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;
    
    // Simulate slow subduction (oceanic plate moving left)
    oceanicPlate.position.x = 5 - (t % 1);
    
    // Pulse earthquakes
    quakesGroup.children.forEach(q => {
      q.scale.setScalar(1 + Math.sin(t * 5 + q.position.z)*0.5);
    });
  };

  group.userData.quiz = [
    { question: "Why does the Oceanic crust subduct under the Continental crust?", options: ["Because it is thinner", "Because it is significantly denser (heavier per unit volume)", "Because it is wet"], answer: 1 },
    { question: "What is the primary driving force behind tectonic plate movement?", options: ["The Moon's gravity", "Mantle convection currents driven by heat from the Earth's core", "Ocean waves pushing the continents"], answer: 1 }
  ];

  return group;
}
