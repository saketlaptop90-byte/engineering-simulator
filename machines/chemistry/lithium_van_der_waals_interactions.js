import * as THREE from 'three';
export function createLithiumVanDerWaals() {
  const group = new THREE.Group();
  
  // Two Li atoms interacting via London Dispersion forces (very weak)
  const li1 = new THREE.Group(); li1.position.set(-1.5, 0, 0);
  const nuc1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const cloud1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.3}));
  li1.add(nuc1, cloud1);
  
  const li2 = new THREE.Group(); li2.position.set(1.5, 0, 0);
  const nuc2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const cloud2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.3}));
  li2.add(nuc2, cloud2);
  
  group.add(li1, li2);

  // Flashing plus/minus signs to show instantaneous dipoles
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xffaaaa})); p1.position.set(-2.5, 1, 0);
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xaaaaff})); m1.position.set(-0.5, 1, 0);
  li1.add(p1, m1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xffaaaa})); p2.position.set(0.5, 1, 0);
  const m2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xaaaaff})); m2.position.set(2.5, 1, 0);
  li2.add(p2, m2);

  group.userData.animate = function(delta, time, speed) {
      // Shift clouds to show polarization
      const shift = Math.sin(time * speed * 3) * 0.3;
      cloud1.position.x = shift;
      cloud2.position.x = shift; // They sync up (induced dipole)
      
      // Fade signs
      const opacity = Math.max(0, Math.sin(time * speed * 3));
      p1.material.opacity = opacity; m1.material.opacity = opacity;
      p2.material.opacity = opacity; m2.material.opacity = opacity;
      p1.material.transparent = true; m1.material.transparent = true;
      p2.material.transparent = true; m2.material.transparent = true;
  };

  return {
    group: group,
    description: "Van der Waals (London Dispersion) Forces. Even neutral, non-bonded atoms can attract each other. Because electrons are constantly moving, sometimes they accidentally bunch up on one side of the atom. This creates a temporary negative pole (and a positive pole on the other side). This fleeting magnet induces the neighboring atom to do the same, causing a weak, temporary attraction.",
    parts: [
      { name: "Shifting Clouds", material: "Electron Density", function: "Sloshing back and forth randomly." },
      { name: "Blue / Red Signs", material: "Instantaneous Dipoles", function: "Temporary partial negative (-) and partial positive (+) charges." }
    ],
    quizQuestions: [
      { question: "What causes London Dispersion (Van der Waals) forces?", options: ["Gravity", "Permanent magnets", "The random, temporary sloshing of electrons to one side of an atom, creating a fleeting magnetic dipole", "Nuclear radiation"], correct: 2, explanation: "Electrons are like a fluid. By pure random chance, they will sometimes be more concentrated on the left side of the atom than the right, creating a temporary micro-magnet that pulls on nearby atoms." }
    ]
  };
}