import * as THREE from 'three';
export function createHeliumDipoleInteractions() {
  const group = new THREE.Group();
  
  // The Helium Dimer (He2) - The weakest bond in the universe
  
  const atom1 = new THREE.Group();
  atom1.position.set(-2, 0, 0);
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom1.add(c1, n1);

  const atom2 = new THREE.Group();
  atom2.position.set(2, 0, 0);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom2.add(c2, n2);
  
  group.add(atom1, atom2);

  // Extremely faint bond line
  const bond = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0), new THREE.Vector3(2,0,0)]), new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1}));
  group.add(bond);

  // Measurement (5200 pm!)
  const label = new THREE.Group();
  const tick1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); tick1.position.set(-2, -1.5, 0);
  const tick2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); tick2.position.set(2, -1.5, 0);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,-1.5,0), new THREE.Vector3(2,-1.5,0)]), new THREE.LineBasicMaterial({color: 0xffff00}));
  label.add(tick1, tick2, line);
  group.add(label);

  group.userData.animate = function(delta, time, speed) {
      // Extremely long, slow vibration
      const dist = 4 + Math.sin(time*speed*0.5) * 1.5;
      atom1.position.set(-dist/2, 0, 0);
      atom2.position.set(dist/2, 0, 0);
      
      bond.geometry.setFromPoints([atom1.position, atom2.position]);
      tick1.position.x = -dist/2;
      tick2.position.x = dist/2;
      line.geometry.setFromPoints([tick1.position, tick2.position]);
  };

  return {
    group: group,
    description: "The Helium Dimer (He2). The weakest and longest molecule in the universe. Helium does not form covalent bonds. However, near absolute zero, two Helium atoms can become bound by ultra-weak London Dispersion (dipole) forces. The resulting 'bond' is over 5,000 picometers long! (A normal chemical bond is ~100 pm).",
    parts: [
      { name: "Faint Bond Line", material: "Van der Waals attraction", function: "About 5,000 times weaker than a normal covalent bond." },
      { name: "Yellow Measurement", material: "5200 pm distance", function: "The atoms are incredibly far apart, yet technically bound together." }
    ],
    quizQuestions: [
      { question: "The Helium Dimer (He2) is considered the largest and weakest diatomic molecule known. What type of bond holds it together?", options: ["Covalent", "Ionic", "Metallic", "Van der Waals (London Dispersion) forces"], correct: 3, explanation: "Because Helium's valence shell is completely full, it cannot share electrons. The only force that can hold two Helium atoms together is the extremely weak electrostatic attraction caused by random quantum fluctuations in their electron clouds." }
    ]
  };
}