export function createGelElectrophoresisChamber(THREE) {
  const group = new THREE.Group();

  // 1. Buffer Tank (Chamber)
  const tankGeo = new THREE.BoxGeometry(6, 2, 8);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.3 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.y = 1;
  group.add(tank);
  tank.userData = { id: 'buffer_tank', name: 'Electrophoresis Chamber', description: 'Holds the conductive TAE/TBE buffer solution.' };

  // 2. Buffer Solution (Water/Salt)
  const bufferGeo = new THREE.BoxGeometry(5.8, 1.2, 7.8);
  const bufferMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4 });
  const buffer = new THREE.Mesh(bufferGeo, bufferMat);
  buffer.position.y = 0.7;
  group.add(buffer);
  buffer.userData = { id: 'buffer', name: 'Conductive Buffer', description: 'Provides ions to carry the electrical current and maintains pH.' };

  // 3. Agarose Gel Matrix
  const gelGeo = new THREE.BoxGeometry(4, 0.4, 5);
  const gelMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.7 });
  const gel = new THREE.Mesh(gelGeo, gelMat);
  gel.position.set(0, 0.5, 0);
  group.add(gel);
  gel.userData = { id: 'agarose_gel', name: 'Agarose Gel', description: 'Porous matrix that acts like a sieve to separate DNA molecules by size.' };

  // 4. Sample Wells
  const wellGeo = new THREE.BoxGeometry(0.4, 0.3, 0.1);
  const wellMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for(let i=-1.5; i<=1.5; i+=0.6) {
    const well = new THREE.Mesh(wellGeo, wellMat);
    well.position.set(i, 0.6, -2);
    group.add(well);
    if(i===-1.5) well.userData = { id: 'wells', name: 'Loading Wells', description: 'Indented slots where the DNA samples are initially injected.' };
  }

  // 5. DNA Bands (Migrating)
  const bandMat = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // Ethidium bromide glow
  const bandsGroup = new THREE.Group();
  group.add(bandsGroup);
  
  const bandGeo = new THREE.BoxGeometry(0.3, 0.05, 0.1);
  
  for(let lane=0; lane<6; lane++) {
    const x = -1.5 + (lane * 0.6);
    // Add 3-4 bands per lane at different distances
    for(let b=0; b<3; b++) {
      const band = new THREE.Mesh(bandGeo, bandMat);
      // Small fragments travel further (higher Z)
      const dist = (b+1) * (0.5 + Math.random()*0.5);
      band.position.set(x, 0.6, -2 + dist);
      bandsGroup.add(band);
    }
  }
  bandsGroup.children[0].userData = { id: 'dna_bands', name: 'DNA Bands', description: 'Shorter DNA fragments travel faster and further through the gel than longer ones.' };

  // 6. Negative Electrode (Cathode - Black)
  const cathGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
  const cathMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const cathode = new THREE.Mesh(cathGeo, cathMat);
  cathode.position.set(0, 0.5, -3.5);
  cathode.rotation.z = Math.PI / 2;
  group.add(cathode);
  cathode.userData = { id: 'cathode', name: 'Cathode (Negative)', description: 'Repels the negatively charged DNA backbone.' };

  // 7. Positive Electrode (Anode - Red)
  const anodeMat = new THREE.MeshStandardMaterial({ color: 0xdd2222 });
  const anode = new THREE.Mesh(cathGeo, anodeMat);
  anode.position.set(0, 0.5, 3.5);
  anode.rotation.z = Math.PI / 2;
  group.add(anode);
  anode.userData = { id: 'anode', name: 'Anode (Positive)', description: 'Attracts the negatively charged DNA.' };

  // 8. Power Supply
  const powerGeo = new THREE.BoxGeometry(3, 2, 2);
  const powerMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const power = new THREE.Mesh(powerGeo, powerMat);
  power.position.set(-5, 1, 0);
  group.add(power);
  power.userData = { id: 'power_supply', name: 'Power Supply', description: 'Provides the 100V-150V DC current required for migration.' };

  // 9. Wiring
  const wireGeo = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 1, -1),
    new THREE.Vector3(-3, 0, -3.5),
    new THREE.Vector3(-2.5, 0.5, -3.5)
  ]);
  const wireMesh1 = new THREE.Mesh(new THREE.TubeGeometry(wireGeo, 16, 0.05, 8, false), cathMat);
  group.add(wireMesh1);
  
  const wireGeo2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 1, 1),
    new THREE.Vector3(-3, 0, 3.5),
    new THREE.Vector3(-2.5, 0.5, 3.5)
  ]);
  const wireMesh2 = new THREE.Mesh(new THREE.TubeGeometry(wireGeo2, 16, 0.05, 8, false), anodeMat);
  group.add(wireMesh2);
  wireMesh2.userData = { id: 'cables', name: 'Electrode Cables', description: 'Connects the power supply to the platinum wires in the tank.' };

  // 10. UV Transilluminator (Base)
  const uvGeo = new THREE.BoxGeometry(4.5, 0.5, 5.5);
  const uvMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x220033 });
  const uv = new THREE.Mesh(uvGeo, uvMat);
  uv.position.set(0, -0.2, 0);
  group.add(uv);
  uv.userData = { id: 'uv_light', name: 'UV Transilluminator', description: 'Shines UV light to excite the intercalating dye, making the DNA visible.' };

  group.userData.animate = function(delta) {
    // Pulse the DNA bands to simulate fluorescence
    const t = Date.now() * 0.005;
    bandsGroup.children.forEach(b => {
      b.material.color.setHSL(0.83, 1, 0.5 + Math.sin(t)*0.2); // Pinkish pulse
    });
  };

  group.userData.quiz = [
    { question: "Why does DNA migrate towards the red (positive) electrode?", options: ["Because it loves red", "Because the phosphate groups in its backbone are negatively charged", "Because gravity pulls it that way"], answer: 1 },
    { question: "Which DNA fragments travel the furthest in the gel?", options: ["The longest/heaviest fragments", "The shortest/lightest fragments", "They all travel at the same speed"], answer: 1 }
  ];

  return group;
}
