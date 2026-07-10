import * as THREE from 'three';
export function createHydrogenIonicBonding() {
  const group = new THREE.Group();
  
  // Lithium Cation (Li+)
  const liGroup = new THREE.Group();
  liGroup.position.set(-2, 0, 0);
  const liNuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const liCloud = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshPhysicalMaterial({color: 0xaa00aa, transparent: true, opacity: 0.5}));
  liGroup.add(liNuc, liCloud);
  group.add(liGroup);

  // Hydride Anion (H-)
  const hGroup = new THREE.Group();
  hGroup.position.set(2, 0, 0);
  const hNuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const hCloud = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5}));
  hGroup.add(hNuc, hCloud);
  group.add(hGroup);

  // Ionic bond (electrostatic attraction)
  const bond = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.5, 0.5, 4, 16)), new THREE.LineBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.3}));
  bond.rotation.z = Math.PI/2;
  group.add(bond);

  group.userData.animate = function(delta, time, speed) {
      const dist = 3 + Math.sin(time*speed*2)*0.5;
      liGroup.position.x = -dist/2;
      hGroup.position.x = dist/2;
  };

  return {
    group: group,
    description: "Ionic Bonding. While Hydrogen usually forms covalent bonds, it can form Ionic bonds with highly electropositive alkali metals (like Lithium). The Lithium completely donates its valence electron to Hydrogen, creating a tiny Li+ cation and a massively swelled H- (Hydride) anion held together by pure electrostatic attraction.",
    parts: [
      { name: "Lithium Cation (Li+)", material: "Purple Cloud", function: "Lost its electron, shrinking significantly." },
      { name: "Hydride Anion (H-)", material: "Cyan Cloud", function: "Gained an electron, swelling due to electron repulsion." },
      { name: "Electrostatic Bond", material: "Green Field", function: "Opposites attract, holding the lattice together." }
    ],
    quizQuestions: [
      { question: "In the compound Lithium Hydride (LiH), what type of bond holds the atoms together?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen Bond"], correct: 1, explanation: "Because Lithium wants to lose an electron (to empty its shell) and Hydrogen wants to gain one (to fill its 1s shell), an electron is completely transferred, creating an Ionic bond between Li+ and H-." }
    ]
  };
}