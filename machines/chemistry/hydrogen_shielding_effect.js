import * as THREE from 'three';
export function createHydrogenShieldingEffect() {
  const group = new THREE.Group();
  
  // Compare Hydrogen (no shield) with a hypothetical Helium-like setup
  
  // Hydrogen side (Left)
  const hGroup = new THREE.Group();
  hGroup.position.set(-2, 0, 0);
  hGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  const hElec = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  hElec.position.set(2, 0, 0);
  hGroup.add(hElec);
  const hLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(2,0,0)]), new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2}));
  hGroup.add(hLine);
  group.add(hGroup);

  // Shielded side (Right) - e.g. Lithium outer electron
  const liGroup = new THREE.Group();
  liGroup.position.set(2, 0, 0);
  liGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}))); // +3 nuc
  
  // Shielding core
  const shield = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x5555ff, transparent: true, opacity: 0.6}));
  liGroup.add(shield);
  
  const liElec = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  liElec.position.set(2, 0, 0);
  liGroup.add(liElec);
  
  // Weakened force line
  const liLine = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 0.02, 0.02)), new THREE.LineBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2}));
  liLine.position.set(1, 0, 0);
  liGroup.add(liLine);
  group.add(liGroup);

  group.userData.animate = function(delta, time, speed) {
      hGroup.rotation.y = time * speed;
      liGroup.rotation.y = time * speed;
  };

  return {
    group: group,
    description: "The Shielding Effect (or lack thereof). Hydrogen is the ONLY element completely devoid of the shielding effect. In multi-electron atoms (shown on the right), inner core electrons physically block and repel the outer electrons from the nucleus, weakening the electrostatic pull.",
    parts: [
      { name: "Hydrogen (Left)", material: "Unshielded", function: "Experiences the full strength of the nucleus." },
      { name: "Multi-electron Atom (Right)", material: "Shielded", function: "Core electrons 'shield' the outer valence electron, weakening the green attraction line." }
    ],
    quizQuestions: [
      { question: "Why does Hydrogen lack the 'Shielding Effect' entirely?", options: ["Because it has no neutrons", "Because it is a gas", "Because it only has one electron, meaning there are no inner electrons to block the nucleus", "Because its electron moves too fast"], correct: 2, explanation: "The shielding effect is caused by inner core electrons repelling outer valence electrons and blocking the nuclear charge. Since Hydrogen only possesses a single electron, there is nothing between it and the nucleus." }
    ]
  };
}