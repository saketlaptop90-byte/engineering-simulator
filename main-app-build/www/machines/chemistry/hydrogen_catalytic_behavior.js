import * as THREE from 'three';
export function createHydrogenCatalyticBehavior() {
  const group = new THREE.Group();
  
  // Palladium Metal Surface
  const surface = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 1.0, roughness: 0.4}));
  surface.position.y = -1;
  group.add(surface);

  // H2 Molecule approaching
  const h2 = new THREE.Group();
  const hA = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const hB = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  hA.position.x = -0.3; hB.position.x = 0.3;
  h2.add(hA, hB);
  group.add(h2);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 6;
      
      if (cycle < 2) {
          // Approaching
          hA.position.set(-0.3, 0, 0); hB.position.set(0.3, 0, 0);
          h2.position.set(0, 3 - cycle*1.5, 0);
      } else if (cycle < 4) {
          // Cleaving on surface
          const spread = (cycle - 2) * 1.5;
          hA.position.set(-0.3 - spread, 0, 0);
          hB.position.set(0.3 + spread, 0, 0);
          // Adsorbing into metal
          h2.position.y = 0 - (cycle-2)*0.2;
      } else {
          // Reset
          h2.position.y = 3;
          hA.position.x = -0.3; hB.position.x = 0.3;
      }
  };

  return {
    group: group,
    description: "Catalytic Hydrogenation. Metals like Palladium, Platinum, and Nickel act as incredible catalysts for Hydrogen. When an H2 molecule hits the metal surface, the metal breaks the strong H-H bond (cleavage), absorbing the individual reactive H atoms into its crystal lattice.",
    parts: [
      { name: "Palladium Surface", material: "Transition Metal", function: "Provides electrons to break the H-H bond." },
      { name: "H2 Molecule", material: "Diatomic Gas", function: "Approaches the surface intact." },
      { name: "Adsorbed H Atoms", material: "Radicals", function: "Split apart, making them highly reactive for chemical synthesis (like making margarine)." }
    ],
    quizQuestions: [
      { question: "What is the primary role of the Palladium catalyst in a hydrogenation reaction?", options: ["To burn the hydrogen", "To freeze the hydrogen", "To break the strong H-H covalent bond and adsorb individual, reactive H atoms onto its surface", "To turn hydrogen into helium"], correct: 2, explanation: "H2 gas is very stable and unreactive. The transition metal catalyst breaks the covalent bond, holding the individual Hydrogen atoms on its surface so they can easily react with other molecules." }
    ]
  };
}