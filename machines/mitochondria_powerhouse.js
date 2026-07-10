export function createMitochondriaPowerhouse(THREE) {
  const group = new THREE.Group();

  // 1. Outer Membrane
  const outerGeo = new THREE.CapsuleGeometry(4, 6, 32, 32);
  const outerMat = new THREE.MeshStandardMaterial({ color: 0xaa5533, transparent: true, opacity: 0.4 });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  outer.rotation.z = Math.PI / 2;
  group.add(outer);
  outer.userData = { id: 'outer_membrane', name: 'Outer Membrane', description: 'Smooth, highly permeable boundary of the organelle.' };

  // 2. Inner Membrane & Cristae
  const innerMat = new THREE.MeshStandardMaterial({ color: 0xff8855, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
  const cristaeGroup = new THREE.Group();
  for(let i=-3; i<=3; i+=1) {
    const cristaGeo = new THREE.PlaneGeometry(6, 3.5);
    const crista = new THREE.Mesh(cristaGeo, innerMat);
    crista.position.set(i * 1.5, 0, 0);
    crista.rotation.y = Math.PI / 2;
    // alternate top/bottom gap
    if (i % 2 === 0) crista.position.y = 1;
    else crista.position.y = -1;
    cristaeGroup.add(crista);
    if(i===0) crista.userData = { id: 'cristae', name: 'Cristae', description: 'Folds of the inner membrane that vastly increase surface area for ATP production.' };
  }
  const innerShellGeo = new THREE.CapsuleGeometry(3.5, 5, 32, 32);
  const innerShell = new THREE.Mesh(innerShellGeo, innerMat);
  innerShell.rotation.z = Math.PI / 2;
  cristaeGroup.add(innerShell);
  group.add(cristaeGroup);

  // 3. Intermembrane Space
  const spaceGeo = new THREE.CapsuleGeometry(3.8, 5.5, 16, 16);
  const spaceMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.1 });
  const space = new THREE.Mesh(spaceGeo, spaceMat);
  space.rotation.z = Math.PI / 2;
  group.add(space);
  space.userData = { id: 'intermembrane_space', name: 'Intermembrane Space', description: 'Where protons (H+) are pumped, creating an electrochemical gradient.' };

  // 4. Matrix
  const matrixGeo = new THREE.CapsuleGeometry(3.4, 4.8, 16, 16);
  const matrixMat = new THREE.MeshBasicMaterial({ color: 0xffaa88, transparent: true, opacity: 0.2 });
  const matrix = new THREE.Mesh(matrixGeo, matrixMat);
  matrix.rotation.z = Math.PI / 2;
  group.add(matrix);
  matrix.userData = { id: 'matrix', name: 'Mitochondrial Matrix', description: 'Fluid inside containing enzymes for the Krebs cycle.' };

  // 5. ATP Synthase Complex
  const atpSynthGeo = new THREE.CylinderGeometry(0.3, 0.1, 1);
  const atpSynthMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  for(let i=0; i<10; i++) {
    const atpSynth = new THREE.Mesh(atpSynthGeo, atpSynthMat);
    atpSynth.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
    // keep on cristae
    atpSynth.rotation.x = Math.random()*Math.PI;
    group.add(atpSynth);
    if(i===0) {
      atpSynth.scale.set(3,3,3);
      atpSynth.position.set(0, 2, 0);
      atpSynth.userData = { id: 'atp_synthase', name: 'ATP Synthase Complex', description: 'Molecular turbine that spins to generate ATP as protons flow through it.' };
    }
  }

  // 6. Electron Transport Chain Proteins
  const etcGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const etcMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const etc = new THREE.Mesh(etcGeo, etcMat);
  etc.position.set(1.5, 2, 0);
  group.add(etc);
  etc.userData = { id: 'etc', name: 'Electron Transport Chain (ETC)', description: 'Proteins that pass electrons and pump protons across the inner membrane.' };

  // 7. Mitochondrial DNA (mtDNA)
  const dnaGeo = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
  const dnaMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  const dna = new THREE.Mesh(dnaGeo, dnaMat);
  dna.position.set(-2, 0, 1);
  group.add(dna);
  dna.userData = { id: 'mtdna', name: 'Mitochondrial DNA (mtDNA)', description: 'Separate, circular DNA inherited only from the mother.' };

  // 8. Ribosomes (Mitoribosomes)
  const riboGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const riboMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const ribo = new THREE.Mesh(riboGeo, riboMat);
  ribo.position.set(2, -1, 1);
  group.add(ribo);
  ribo.userData = { id: 'mitoribosome', name: 'Mitoribosome', description: 'Specialized ribosomes that synthesize proteins inside the mitochondrion.' };

  // 9. ATP Molecules (Energy output)
  const atpMoleculeGeo = new THREE.TetrahedronGeometry(0.2);
  const atpMoleculeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffaa });
  const atp1 = new THREE.Mesh(atpMoleculeGeo, atpMoleculeMat);
  atp1.position.set(0, 3, 0);
  group.add(atp1);
  atp1.userData = { id: 'atp', name: 'ATP (Adenosine Triphosphate)', description: 'The energy currency of the cell.' };

  // 10. Proton (H+) Gradient
  const protonGeo = new THREE.SphereGeometry(0.05, 4, 4);
  const protonMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const protonGroup = new THREE.Group();
  for(let i=0; i<30; i++) {
    const p = new THREE.Mesh(protonGeo, protonMat);
    p.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
    protonGroup.add(p);
  }
  group.add(protonGroup);
  protonGroup.children[0].userData = { id: 'protons', name: 'Protons (H+)', description: 'Concentrated in the intermembrane space to drive ATP Synthase.' };

  group.userData.animate = function(delta) {
    atp1.position.y += 0.05;
    if(atp1.position.y > 6) atp1.position.y = 3;
    dna.rotation.x += 0.01;
    protonGroup.rotation.y += 0.01;
  };

  group.userData.quiz = [
    { question: "What is the primary function of the Mitochondria?", options: ["Storing water", "Generating ATP through cellular respiration", "Synthesizing lipids"], answer: 1 },
    { question: "Why is the inner membrane heavily folded into cristae?", options: ["To trap bacteria", "To increase surface area for more ATP production", "To keep the DNA safe"], answer: 1 }
  ];

  return group;
}
