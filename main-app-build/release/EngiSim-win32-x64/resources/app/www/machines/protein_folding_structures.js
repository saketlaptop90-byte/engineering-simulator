export function createProteinFolding(THREE) {
  const group = new THREE.Group();

  // Visualize the 4 levels of protein structure
  
  // Font/Text won't work without loader, so we use distinct visual zones.
  const spacing = 4;

  // 1. Primary Structure (Sequence of Amino Acids - Beads on a string)
  const primaryGroup = new THREE.Group();
  primaryGroup.position.set(-spacing*1.5, 0, 0);
  group.add(primaryGroup);

  const numAAs = 15;
  const beadGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];
  
  const pList = [];
  for(let i=0; i<numAAs; i++) {
    const mat = new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random()*colors.length)] });
    const bead = new THREE.Mesh(beadGeo, mat);
    
    // Zig-zag line
    bead.position.set(0, (i - numAAs/2)*0.5, Math.sin(i*Math.PI/2)*0.3);
    primaryGroup.add(bead);
    pList.push(bead);

    if (i > 0) {
      const prev = pList[i-1];
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      // calculate position and rotation to connect them (simplified)
      bond.position.copy(prev.position).lerp(bead.position, 0.5);
      bond.lookAt(bead.position);
      bond.rotation.x += Math.PI/2;
      primaryGroup.add(bond);
    }
  }
  primaryGroup.children[0].userData = { id: 'primary', name: 'Primary Structure', description: 'The linear sequence of amino acids, dictated directly by DNA. Held together by strong peptide (covalent) bonds.' };

  // 2. Secondary Structure (Alpha Helix & Beta Sheet)
  const secondaryGroup = new THREE.Group();
  secondaryGroup.position.set(-spacing*0.5, 0, 0);
  group.add(secondaryGroup);

  // Alpha Helix (Spiral)
  const helixCurve = new THREE.CatmullRomCurve3(
    Array.from({length: 40}, (_, i) => new THREE.Vector3(Math.cos(i*0.5)*0.6, (i-20)*0.1, Math.sin(i*0.5)*0.6))
  );
  const helix = new THREE.Mesh(new THREE.TubeGeometry(helixCurve, 64, 0.15, 8, false), new THREE.MeshStandardMaterial({ color: 0x4488ff }));
  helix.position.y = 1;
  secondaryGroup.add(helix);

  // Beta Sheet (Folded plane)
  const sheet = new THREE.Group();
  sheet.position.y = -1.5;
  const sMat = new THREE.MeshStandardMaterial({ color: 0x44ff88, side: THREE.DoubleSide });
  for(let i=0; i<3; i++) {
    const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2), sMat);
    arrow.position.x = (i-1)*0.9;
    arrow.rotation.x = Math.sin(i*Math.PI)*0.2; // slight twist
    
    // Add arrow head
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.5, 3), sMat);
    head.position.y = 1.25;
    // alternate direction
    if (i%2 === 1) {
      arrow.rotation.z = Math.PI;
      head.position.y = -1.25;
      head.rotation.z = Math.PI;
    }
    arrow.add(head);
    sheet.add(arrow);
  }
  secondaryGroup.add(sheet);
  
  helix.userData = { id: 'secondary', name: 'Secondary Structure', description: 'Local folding into Alpha Helices and Beta Pleated Sheets, held together by Hydrogen Bonds between the backbone atoms.' };

  // 3. Tertiary Structure (3D folding of one chain)
  const tertiaryGroup = new THREE.Group();
  tertiaryGroup.position.set(spacing*0.5, 0, 0);
  group.add(tertiaryGroup);

  // Combine helices, sheets, and random coils into a globule
  const tertMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
  
  // A knotted tube to represent the 3D fold
  const tCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 1, 0)
  ], true);
  const tertiary = new THREE.Mesh(new THREE.TubeGeometry(tCurve, 64, 0.3, 8, true), tertMat);
  tertiaryGroup.add(tertiary);

  // Add a disulfide bridge (yellow bond)
  const dsBond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
  dsBond.position.set(0, 0, 0);
  dsBond.rotation.x = Math.PI/4;
  tertiaryGroup.add(dsBond);

  tertiary.userData = { id: 'tertiary', name: 'Tertiary Structure', description: 'The final 3D shape of a single polypeptide chain. Driven by hydrophobic interactions (water-fearing parts hide inside) and disulfide bridges.' };

  // 4. Quaternary Structure (Multiple chains combining)
  const quaternaryGroup = new THREE.Group();
  quaternaryGroup.position.set(spacing*1.5, 0, 0);
  group.add(quaternaryGroup);

  // E.g., Hemoglobin (4 subunits)
  const qMat1 = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const qMat2 = new THREE.MeshStandardMaterial({ color: 0xaa2222 });

  const sub1 = tertiary.clone();
  sub1.material = qMat1;
  sub1.position.set(-0.8, 0.8, 0);
  
  const sub2 = tertiary.clone();
  sub2.material = qMat2;
  sub2.position.set(0.8, 0.8, 0);
  sub2.rotation.y = Math.PI/2;

  const sub3 = tertiary.clone();
  sub3.material = qMat1;
  sub3.position.set(-0.8, -0.8, 0);
  sub3.rotation.x = Math.PI/2;

  const sub4 = tertiary.clone();
  sub4.material = qMat2;
  sub4.position.set(0.8, -0.8, 0);
  sub4.rotation.z = Math.PI/2;

  quaternaryGroup.add(sub1, sub2, sub3, sub4);
  
  // Heme groups (iron)
  const hemeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05);
  const hemeMat = new THREE.MeshStandardMaterial({ color: 0x44ff44 }); // Green to stand out
  [sub1, sub2, sub3, sub4].forEach(s => {
    const heme = new THREE.Mesh(hemeGeo, hemeMat);
    heme.position.set(0, 0, 1.2);
    s.add(heme);
  });

  sub1.userData = { id: 'quaternary', name: 'Quaternary Structure', description: 'Multiple folded protein chains (subunits) coming together to form a larger functional complex. Example: Hemoglobin has 4 subunits.' };

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    // Gentle floating for all
    primaryGroup.position.y = Math.sin(t)*0.2;
    secondaryGroup.position.y = Math.cos(t)*0.2;
    tertiaryGroup.position.y = Math.sin(t+1)*0.2;
    quaternaryGroup.position.y = Math.cos(t+1)*0.2;

    // Rotation to see 3D structure
    primaryGroup.rotation.y = t * 0.2;
    secondaryGroup.rotation.y = t * 0.2;
    tertiaryGroup.rotation.y = t * 0.2;
    quaternaryGroup.rotation.y = t * 0.2;
    
    // Simulate primary chain wiggling (thermal motion)
    pList.forEach((bead, i) => {
      bead.position.x = Math.sin(t*2 + i) * 0.1;
    });
  };

  group.userData.quiz = [
    { question: "What primarily drives a protein to fold into its 3D Tertiary structure?", options: ["Magnetic fields", "Hydrophobic interactions (water-fearing amino acids hiding in the core)", "Gravity"], answer: 1 },
    { question: "An Alpha Helix is an example of which level of protein structure?", options: ["Primary", "Secondary", "Quaternary"], answer: 1 }
  ];

  return group;
}
