import * as THREE from 'three';
export function createHeliumCovalentRadius() {
  const group = new THREE.Group();
  
  // Two Helium atoms refusing to bond
  const atom1 = new THREE.Group();
  const cloud1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.4}));
  atom1.add(cloud1, new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  const atom2 = new THREE.Group();
  const cloud2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.4}));
  atom2.add(cloud2, new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  group.add(atom1, atom2);

  // Red X marking no bond
  const xMark = new THREE.Group();
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xff0000})); m1.rotation.z = Math.PI/4;
  const m2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xff0000})); m2.rotation.z = -Math.PI/4;
  xMark.add(m1, m2);
  group.add(xMark);

  group.userData.animate = function(delta, time, speed) {
      // They approach, repel, and bounce away
      const cycle = Math.sin(time*speed); // goes -1 to 1
      const dist = 2 + Math.abs(cycle) * 2; // bounces between 2 and 4
      
      atom1.position.set(-dist/2, 0, 0);
      atom2.position.set(dist/2, 0, 0);
      
      // X mark appears when they are close
      if (dist < 2.5) {
          xMark.visible = true;
          xMark.scale.setScalar(1 + (2.5-dist)*2);
      } else {
          xMark.visible = false;
      }
  };

  return {
    group: group,
    description: "Covalent Radius (Undefined). Helium does NOT form covalent bonds under standard conditions. A covalent radius is defined as half the distance between two bonded nuclei (like H-H). Because an He-He molecule cannot exist, Helium has no measurable covalent radius.",
    parts: [
      { name: "Helium Atoms", material: "Cyan Spheres", function: "Approaching each other to attempt a bond." },
      { name: "Repulsion (Red X)", material: "Pauli Blockade", function: "Because both 1s shells are totally full, they physically cannot share electrons. They bounce off." }
    ],
    quizQuestions: [
      { question: "Why is the 'Covalent Radius' technically undefined for a Helium atom?", options: ["Because it is a liquid", "Because it is impossible to measure distance", "Because Helium does not form covalent bonds with other atoms, meaning there is no bond distance to measure", "Because it is too large"], correct: 2, explanation: "Covalent radius is specifically measured by dividing the length of a chemical bond in half. Since Helium's valence shell is perfectly full, it refuses to share electrons or form bonds, making the measurement impossible." }
    ]
  };
}