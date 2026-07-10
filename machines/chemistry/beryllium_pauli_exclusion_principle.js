import * as THREE from 'three';

export function createBerylliumPauliExclusionPrinciple() {
  const group = new THREE.Group();
  
  // Visualizing the "Quantum State Box" / Pauli boxes
  const createBox = (label, yPos, filled) => {
      const bGroup = new THREE.Group();
      
      // Orbital Box
      const box = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 0.5), new THREE.MeshPhysicalMaterial({color: 0x222222, transparent: true, opacity: 0.8, transmission: 0.5}));
      bGroup.add(box);
      
      // Label simulation (we'll just use a glowing dot for label indicator)
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
      dot.position.set(-1.8, 0, 0);
      bGroup.add(dot);
      
      if(filled) {
          // Up Arrow
          const up = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
          up.position.set(-0.5, 0, 0.2);
          bGroup.add(up);
          
          // Down Arrow
          const dn = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
          dn.position.set(0.5, 0, 0.2);
          dn.rotation.x = Math.PI;
          bGroup.add(dn);
          
          bGroup.userData.arrows = {up, dn};
      }
      
      bGroup.position.y = yPos;
      return bGroup;
  };

  const box1s = createBox("1s", -2, true);
  const box2s = createBox("2s", 2, true);
  group.add(box1s);
  group.add(box2s);

  // Force field visual to show rejection if a third tries to enter
  const rejectArrow = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 16), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.5}));
  rejectArrow.position.set(3, 2, 0);
  rejectArrow.rotation.z = Math.PI/2;
  group.add(rejectArrow);
  
  const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.3, wireframe: true}));
  shield.position.set(1.5, 2, 0);
  shield.scale.set(0.2, 1, 1);
  group.add(shield);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      
      // Jiggle allowed arrows
      [box1s, box2s].forEach(b => {
          b.userData.arrows.up.position.y = Math.sin(time*5)*0.1;
          b.userData.arrows.dn.position.y = Math.cos(time*5)*0.1;
      });
      
      // Rejection animation
      rejectArrow.position.x = 4 + Math.sin(time*4);
      if(rejectArrow.position.x < 3.2) {
          shield.material.opacity = 1.0;
      } else {
          shield.material.opacity = 0.2;
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
