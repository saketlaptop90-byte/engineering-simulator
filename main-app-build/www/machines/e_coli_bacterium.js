export function createEColiBacterium(THREE) {
  const group = new THREE.Group();

  // 1. Cell Membrane/Wall (Capsule)
  const cellGeo = new THREE.CapsuleGeometry(2, 4, 32, 32);
  const cellMat = new THREE.MeshStandardMaterial({ color: 0xddaa77, transparent: true, opacity: 0.5 });
  const cell = new THREE.Mesh(cellGeo, cellMat);
  cell.rotation.z = Math.PI / 2;
  group.add(cell);
  cell.userData = { id: 'capsule', name: 'Cell Capsule / Wall', description: 'Protective outer layer of the Gram-negative bacterium.' };

  // 2. Nucleoid (Circular DNA)
  const dnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0.5, 0),
    new THREE.Vector3(-1, -0.5, 0.5),
    new THREE.Vector3(0, 0.8, -0.5),
    new THREE.Vector3(1, -0.5, 0.5),
    new THREE.Vector3(2, 0.5, 0),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(-1, 0, -1)
  ], true);
  const dnaGeo = new THREE.TubeGeometry(dnaCurve, 64, 0.1, 8, true);
  const dnaMat = new THREE.MeshStandardMaterial({ color: 0xff5555 });
  const nucleoid = new THREE.Mesh(dnaGeo, dnaMat);
  group.add(nucleoid);
  nucleoid.userData = { id: 'nucleoid', name: 'Nucleoid (DNA)', description: 'Tangled mass of a single circular chromosome.' };

  // 3. Plasmids
  const plasmidGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
  const plasmidMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  for(let i=0; i<3; i++) {
    const plasmid = new THREE.Mesh(plasmidGeo, plasmidMat);
    plasmid.position.set(-2 + i*2, -1, 0.8 - i*0.2);
    plasmid.rotation.x = Math.random() * Math.PI;
    group.add(plasmid);
    plasmid.userData = { id: `plasmid_${i}`, name: 'Plasmid', description: 'Small ring of accessory DNA, often carrying antibiotic resistance genes.' };
  }

  // 4. Ribosomes
  const riboGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const riboMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  for(let i=0; i<50; i++) {
    const ribo = new THREE.Mesh(riboGeo, riboMat);
    ribo.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    );
    // keep inside roughly
    if (ribo.position.length() < 1.8 || Math.abs(ribo.position.x) < 2) {
      group.add(ribo);
    }
  }
  const sampleRibo = new THREE.Mesh(riboGeo, riboMat);
  sampleRibo.position.set(0, 1, 0);
  group.add(sampleRibo);
  sampleRibo.userData = { id: 'ribosomes', name: '70S Ribosomes', description: 'Protein factories floating in the cytoplasm.' };

  // 5. Flagella
  const flagMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const flagellaGroup = new THREE.Group();
  for(let i=0; i<4; i++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(6, Math.sin(i), Math.cos(i)),
      new THREE.Vector3(8, Math.sin(i*2)*2, Math.cos(i*2)*2),
      new THREE.Vector3(10, Math.sin(i*3)*3, Math.cos(i*3)*3)
    ]);
    const flagGeo = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
    const flagellum = new THREE.Mesh(flagGeo, flagMat);
    flagellaGroup.add(flagellum);
    flagellum.userData = { id: `flagellum_${i}`, name: 'Flagellum', description: 'Whip-like tail rotated by a motor protein for swimming.' };
  }
  group.add(flagellaGroup);

  // 6. Flagellar Motor
  const motorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5);
  const motorMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const motor = new THREE.Mesh(motorGeo, motorMat);
  motor.position.set(4, 0, 0);
  motor.rotation.z = Math.PI / 2;
  group.add(motor);
  motor.userData = { id: 'motor', name: 'Flagellar Motor', description: 'Biological rotary engine powered by proton flow.' };

  // 7. Pili / Fimbriae
  const piliGeo = new THREE.CylinderGeometry(0.02, 0.02, 1);
  const piliMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  for(let i=0; i<40; i++) {
    const pilus = new THREE.Mesh(piliGeo, piliMat);
    const phi = Math.acos(-1 + (2 * i) / 40);
    const theta = Math.sqrt(40 * Math.PI) * phi;
    
    // Distribute on a capsule shape roughly
    const x = 3 * Math.cos(theta) * Math.sin(phi);
    const y = 2 * Math.sin(theta) * Math.sin(phi);
    const z = 2 * Math.cos(phi);
    
    pilus.position.set(x, y, z);
    pilus.lookAt(x*2, y*2, z*2);
    pilus.rotation.x += Math.PI/2;
    group.add(pilus);
  }
  const samplePilus = new THREE.Mesh(piliGeo, piliMat);
  samplePilus.position.set(0, 2.5, 0);
  group.add(samplePilus);
  samplePilus.userData = { id: 'pili', name: 'Fimbriae/Pili', description: 'Hair-like appendages for attaching to surfaces.' };

  // 8. Cytoplasm
  const cytoGeo = new THREE.SphereGeometry(1.8, 16, 16);
  const cytoMat = new THREE.MeshBasicMaterial({ color: 0xaaeecc, transparent: true, opacity: 0.1 });
  const cytoplasm = new THREE.Mesh(cytoGeo, cytoMat);
  group.add(cytoplasm);
  cytoplasm.userData = { id: 'cytoplasm', name: 'Cytoplasm', description: 'Jelly-like substance filling the cell.' };

  // 9. Outer Membrane Proteins (Porins)
  const porinGeo = new THREE.TorusGeometry(0.1, 0.05, 8, 16);
  const porinMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const porin = new THREE.Mesh(porinGeo, porinMat);
  porin.position.set(0, 2, 0);
  porin.rotation.x = Math.PI / 2;
  group.add(porin);
  porin.userData = { id: 'porin', name: 'Porin Channel', description: 'Allows molecules to diffuse through the outer membrane.' };

  // 10. Sex Pilus
  const sexGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
  const sexMat = new THREE.MeshStandardMaterial({ color: 0xaa00aa });
  const sexPilus = new THREE.Mesh(sexGeo, sexMat);
  sexPilus.position.set(-2, 0, 3);
  sexPilus.rotation.x = Math.PI / 2;
  group.add(sexPilus);
  sexPilus.userData = { id: 'sex_pilus', name: 'Conjugation (Sex) Pilus', description: 'Tube used to transfer plasmids to other bacteria.' };

  group.userData.animate = function(delta) {
    flagellaGroup.rotation.x += 0.2; // Motor spinning
    nucleoid.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
  };

  group.userData.quiz = [
    { question: "What is the function of the flagellum?", options: ["Reproduction", "Locomotion/Swimming", "Digestion"], answer: 1 },
    { question: "What are plasmids?", options: ["The main chromosome", "Small, circular pieces of DNA exchanged between bacteria", "Energy factories"], answer: 1 }
  ];

  return group;
}
