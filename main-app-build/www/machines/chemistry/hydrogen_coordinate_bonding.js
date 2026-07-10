import * as THREE from 'three';
export function createHydrogenCoordinateBonding() {
  const group = new THREE.Group();
  
  // Water molecule (H2O)
  const oNuc = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.7}));
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  h1.position.set(-1, -1, 0);
  h2.position.set(1, -1, 0);
  group.add(oNuc, h1, h2);

  // Lone pair electrons on Oxygen
  const lp1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const lp2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  lp1.position.set(-0.2, 1, 0);
  lp2.position.set(0.2, 1, 0);
  group.add(lp1, lp2);

  // Incoming H+ (bare proton)
  const hPlus = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(hPlus);

  // Arrow showing coordinate bond formation
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,3,0), 1.5, 0x00ff00);
  group.add(arrow);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      if (cycle < 2) {
          hPlus.position.set(0, 3 - cycle, 0);
          arrow.visible = true;
          arrow.position.set(0, 3 - cycle, 0);
      } else {
          hPlus.position.set(0, 1, 0);
          arrow.visible = false;
      }
      group.rotation.y = Math.sin(time*speed)*0.5;
  };

  return {
    group: group,
    description: "Coordinate Bonding (Dative Bond). When a bare Hydrogen proton (H+) dissolves in water, it has no electrons to share. Instead, the Oxygen atom donates BOTH electrons (a lone pair) to form the bond, creating the Hydronium ion (H3O+).",
    parts: [
      { name: "Oxygen Lone Pair", material: "Cyan Dots", function: "Two electrons belonging entirely to Oxygen." },
      { name: "Hydrogen Proton (H+)", material: "Red Dot", function: "Has zero electrons, accepts the lone pair to form a bond." },
      { name: "Hydronium (H3O+)", material: "Resulting Polyatomic Ion", function: "The actual form of 'acid' in water." }
    ],
    quizQuestions: [
      { question: "What is unique about a Coordinate (or Dative) covalent bond compared to a standard covalent bond?", options: ["It uses protons instead of electrons", "It involves stealing an electron completely", "Both electrons in the shared bond come from only one of the atoms", "It is completely invisible"], correct: 2, explanation: "In a standard covalent bond, each atom donates one electron to share. In a coordinate bond, one atom (like Oxygen) donates BOTH electrons to an atom that has none (like H+)." }
    ]
  };
}