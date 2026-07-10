import * as THREE from 'three';
export function createHydrogenDipoleInteractions() {
  const group = new THREE.Group();
  
  // HCl Molecule
  const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32,32), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
  const clAtom = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  hAtom.position.set(-1.5, 0, 0);
  clAtom.position.set(0.5, 0, 0);
  group.add(hAtom, clAtom);

  // Electron cloud heavily shifted to Chlorine
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.2}));
  cloud.position.set(0.8, 0, 0);
  cloud.scale.set(1.2, 1, 1);
  group.add(cloud);

  // Delta plus / Delta minus symbols
  const dPlus = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const dPlus2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  dPlus.position.set(-1.8, 1, 0); dPlus2.position.set(-1.8, 1, 0);
  
  const dMinus = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  dMinus.position.set(1, 1.5, 0);
  
  group.add(dPlus, dPlus2, dMinus);

  // Dipole moment arrow
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(-1, 0, 0), 2, 0xffff00);
  group.add(arrow);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed)*0.3;
  };

  return {
    group: group,
    description: "Dipole Interactions. When Hydrogen bonds covalently with a highly electronegative atom (like Chlorine), the shared electrons are pulled strongly away from the Hydrogen. This creates a permanent electric dipole: a partial positive charge (δ+) on H and a partial negative (δ-) on Cl.",
    parts: [
      { name: "Hydrogen (δ+)", material: "White Sphere", function: "Electron-deficient, acting like a weak positive pole." },
      { name: "Chlorine (δ-)", material: "Green Sphere", function: "Highly electronegative, hogging the electron cloud." },
      { name: "Dipole Moment", material: "Yellow Arrow", function: "Points towards the more negative end of the molecule." }
    ],
    quizQuestions: [
      { question: "Why does the Hydrogen atom in Hydrogen Chloride (HCl) develop a partial positive charge (δ+)?", options: ["It loses a proton to Chlorine", "Chlorine is much more electronegative and pulls the shared electron cloud away from Hydrogen", "It naturally glows red", "Hydrogen is heavier than Chlorine"], correct: 1, explanation: "Electronegativity is the tendency of an atom to attract shared electrons. Chlorine is highly electronegative, pulling the negative electrons toward itself, leaving Hydrogen's proton slightly exposed (a partial positive charge)." }
    ]
  };
}