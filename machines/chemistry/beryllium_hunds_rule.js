import * as THREE from 'three';

export function createBerylliumHundsRule() {
  const group = new THREE.Group();
  
  // Show 2p orbitals (3 degenerate boxes)
  // Beryllium is 1s2 2s2, so 2p is empty. We will simulate an *excited* state (1s2 2s1 2p1) to show Hund's rule
  
  const pGroup = new THREE.Group();
  
  for(let i=0; i<3; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.5), new THREE.MeshPhysicalMaterial({color: 0x111111, transparent: true, opacity: 0.8}));
      box.position.set((i-1)*1.8, 0, 0);
      pGroup.add(box);
  }
  
  // 2s box
  const sBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.5), new THREE.MeshPhysicalMaterial({color: 0x111111, transparent: true, opacity: 0.8}));
  sBox.position.set(-4, 0, 0);
  pGroup.add(sBox);
  
  // Add an arrow to 2s
  const upArrowGeo = new THREE.ConeGeometry(0.3, 1, 16);
  const upMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const e1 = new THREE.Mesh(upArrowGeo, upMat);
  e1.position.set(-4, 0, 0.2);
  pGroup.add(e1);
  
  // The excited electron (moving into 2px, demonstrating it goes in singly)
  const e2 = new THREE.Mesh(upArrowGeo, upMat);
  pGroup.add(e2);

  group.add(pGroup);

  group.userData.animate = function(delta, time) {
      group.rotation.y = Math.sin(time*0.5)*0.2;
      
      e1.position.y = Math.sin(time*4)*0.1;
      
      // e2 jumps from 2s (which is now empty of its pair) into the first 2p box
      const phase = time % 4; // 4 second loop
      if(phase < 1) {
          // It's in 2s
          e2.position.set(-4, 0, 0.2);
          e2.position.x += 0.5; // Offset from e1
      } else if (phase < 2) {
          // Moving
          const t = phase - 1;
          e2.position.x = -3.5 + t * (1.8*(-1) - (-3.5));
          e2.position.y = Math.sin(t*Math.PI)*1.5; // Arc
      } else {
          // Settled in first 2p box
          e2.position.set(-1.8, 0, 0.2);
          e2.position.y = Math.cos(time*4)*0.1;
      }
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Orbital Overlap": "In metallic Be, atomic orbitals overlap to form continuous delocalized bands.",
    "Orbital Hybridization": "To form bonds (e.g., BeCl2), the 2s electron is promoted to 2p, forming two linear sp hybrid orbitals (180°).",
    "Electron Spin (ms)": "Intrinsic angular momentum. In each orbital (1s, 2s), electrons must pair with opposite spins (+1/2, -1/2).",
    "Pauli Exclusion Principle": "No two electrons in a Be atom can have the same four quantum numbers (n, l, ml, ms). Thus, a maximum of 2 electrons per orbital with opposite spins.",
    "Hund's Rule": "States that for degenerate orbitals (like 2p), electrons fill singly first. Since Be's ground state has empty 2p orbitals, Hund's rule applies during excitation/hybridization."
  };

  return group;
}
