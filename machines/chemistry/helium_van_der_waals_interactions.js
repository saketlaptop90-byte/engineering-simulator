import * as THREE from 'three';
export function createHeliumVanDerWaalsInteractions() {
  const group = new THREE.Group();
  
  // Two Helium atoms
  const atom1 = new THREE.Group();
  atom1.position.set(-1.5, 0, 0);
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom1.add(c1, n1);

  const atom2 = new THREE.Group();
  atom2.position.set(1.5, 0, 0);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  atom2.add(c2, n2);
  
  group.add(atom1, atom2);

  // Tiny Delta charges appearing briefly
  const dPlus = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const dPlus2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.05), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const dPlusGroup = new THREE.Group(); dPlusGroup.add(dPlus, dPlus2);
  
  const dMinus = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  
  atom1.add(dPlusGroup.clone().translateX(-1.5));
  atom1.add(dMinus.clone().translateX(1.5));
  
  atom2.add(dPlusGroup.clone().translateX(-1.5));
  atom2.add(dMinus.clone().translateX(1.5));

  group.userData.animate = function(delta, time, speed) {
      // Synchronized cloud shifting (London Dispersion Forces)
      const shift = Math.sin(time*speed*3) * 0.3;
      c1.position.x = shift;
      c2.position.x = shift;
      
      // Highlight the temporary dipole when shifted right
      if (shift > 0.1) {
          atom1.children[2].visible = true; atom1.children[3].visible = true;
          atom2.children[2].visible = true; atom2.children[3].visible = true;
      } else {
          atom1.children[2].visible = false; atom1.children[3].visible = false;
          atom2.children[2].visible = false; atom2.children[3].visible = false;
      }
  };

  return {
    group: group,
    description: "Van der Waals (London Dispersion) Forces. How does a gas that refuses to bond EVER turn into a liquid? Random quantum fluctuations! Occasionally, both electrons end up on the same side of the atom, creating a temporary, ultra-weak electric dipole. This triggers a chain reaction in neighboring atoms, creating enough magnetic stickiness to liquefy Helium at -269 °C.",
    parts: [
      { name: "Shifting Electron Clouds", material: "Cyan Spheres", function: "Sloshing back and forth due to quantum randomness." },
      { name: "Temporary Dipoles", material: "Red/Blue Symbols", function: "Fleeting moments of partial charge (+ and -) that cause atoms to weakly attract." }
    ],
    quizQuestions: [
      { question: "If Helium doesn't form chemical bonds, what force allows it to condense into Liquid Helium at extremely low temperatures?", options: ["Gravity", "Strong Nuclear Force", "London Dispersion Forces (temporary quantum dipoles)", "Covalent bonding"], correct: 2, explanation: "London Dispersion forces occur when electron clouds randomly shift, creating a temporary partial charge. At normal temperatures, atoms move too fast for this weak force to matter, but near absolute zero, it's just enough to make Helium sticky and turn it into a liquid." }
    ]
  };
}