export function createChemicalBonding(THREE) {
  const group = new THREE.Group();

  // 1. Covalent Bond (Water H2O)
  const covalentGroup = new THREE.Group();
  covalentGroup.position.set(-3, 1, 0);
  group.add(covalentGroup);

  const oMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
  const hMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Electrons

  const oxygen = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), oMat);
  covalentGroup.add(oxygen);
  
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), hMat);
  h1.position.set(0.8, 0.8, 0);
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), hMat);
  h2.position.set(-0.8, 0.8, 0);
  covalentGroup.add(h1, h2);

  // Electron Orbits for Covalent (Sharing)
  // Shared pair between O and H1
  const sharedGeo = new THREE.SphereGeometry(0.1);
  const e1 = new THREE.Mesh(sharedGeo, eMat);
  const e2 = new THREE.Mesh(sharedGeo, eMat);
  covalentGroup.add(e1, e2);
  const e3 = new THREE.Mesh(sharedGeo, eMat);
  const e4 = new THREE.Mesh(sharedGeo, eMat);
  covalentGroup.add(e3, e4);

  covalentGroup.userData = { id: 'covalent', name: 'Covalent Bond (H₂O)', description: 'Nonmetals share electrons to achieve a full outer electron shell.' };

  // 2. Ionic Bond (Sodium Chloride NaCl)
  const ionicGroup = new THREE.Group();
  ionicGroup.position.set(3, 1, 0);
  group.add(ionicGroup);

  const naMat = new THREE.MeshStandardMaterial({ color: 0x8888ff, roughness: 0.5 }); // Na+
  const clMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5 }); // Cl-

  const na = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), naMat);
  na.position.set(-1.5, 0, 0);
  const cl = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), clMat);
  cl.position.set(1.5, 0, 0);
  ionicGroup.add(na, cl);

  // Transfer electron
  const e5 = new THREE.Mesh(sharedGeo, eMat);
  ionicGroup.add(e5);

  ionicGroup.userData = { id: 'ionic', name: 'Ionic Bond (NaCl)', description: 'A metal (Sodium) completely transfers an electron to a nonmetal (Chlorine), creating opposite ions that attract each other.' };

  // Labels (Text simulation using simple planes for now, since TextGeometry needs fonts)
  const bondMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.3 });
  const cBond = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), bondMat);
  cBond.position.set(0.4, 0.4, 0);
  cBond.rotation.z = -Math.PI/4;
  covalentGroup.add(cBond);
  
  const cBond2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), bondMat);
  cBond2.position.set(-0.4, 0.4, 0);
  cBond2.rotation.z = Math.PI/4;
  covalentGroup.add(cBond2);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.003;
    
    // Covalent sharing animation (Figure 8 around O and H)
    const shareRadius = 0.6;
    // e1 and e2 orbit between O and H1
    e1.position.set(0.4 + Math.sin(t)*shareRadius, 0.4 + Math.cos(t)*shareRadius, 0);
    e2.position.set(0.4 - Math.sin(t)*shareRadius, 0.4 - Math.cos(t)*shareRadius, 0);
    // e3 and e4 orbit between O and H2
    e3.position.set(-0.4 + Math.sin(t+Math.PI)*shareRadius, 0.4 + Math.cos(t+Math.PI)*shareRadius, 0);
    e4.position.set(-0.4 - Math.sin(t+Math.PI)*shareRadius, 0.4 - Math.cos(t+Math.PI)*shareRadius, 0);

    // Ionic transfer animation
    // Electron starts at Na, moves to Cl
    const phase = (t * 0.2) % 1.5; // 0 to 1.5
    if (phase < 1.0) {
      // Transferring
      e5.position.x = -1.5 + (phase * 3.0); // moves to 1.5 (Cl)
      e5.position.y = Math.sin(phase * Math.PI) * 1.5; // Arcing path
      na.scale.set(1 - phase*0.2, 1 - phase*0.2, 1 - phase*0.2); // Na gets smaller
      cl.scale.set(1 + phase*0.1, 1 + phase*0.1, 1 + phase*0.1); // Cl gets bigger
    } else {
      // Electron orbiting Cl now
      const orbitPhase = (phase - 1.0) * Math.PI * 4;
      e5.position.x = 1.5 + Math.cos(orbitPhase) * 1.3;
      e5.position.y = Math.sin(orbitPhase) * 1.3;
    }
  };

  group.userData.quiz = [
    { question: "What happens to electrons in an Ionic Bond?", options: ["They are shared equally", "They are completely transferred from one atom to another", "They form a sea of electrons"], answer: 1 },
    { question: "Why is the Oxygen atom in water (H2O) slightly negative?", options: ["Because it loses electrons", "Because it shares electrons unequally, pulling them closer to itself (Electronegativity)", "Because it has no protons"], answer: 1 }
  ];

  return group;
}
