import * as THREE from 'three';
export function createHeliumOxidationReductionInertness() {
  const group = new THREE.Group();
  
  // Helium
  const he = new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.8}));
  he.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  group.add(he);

  // Oxygen Radical (Aggressive oxidizer)
  const ox = new THREE.Group();
  ox.add(new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})));
  ox.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  group.add(ox);

  // Sodium Radical (Aggressive reducer)
  const na = new THREE.Group();
  na.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 32,32), new THREE.MeshBasicMaterial({color: 0xaa00aa, wireframe: true})));
  na.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xaa00aa})));
  group.add(na);

  group.userData.animate = function(delta, time, speed) {
      he.rotation.y = time * speed;
      
      // Oxygen attacking from right (trying to oxidize/steal e-)
      const t1 = (time * speed) % 2;
      ox.position.set(4 - t1*3, 1, 0);
      
      // Sodium attacking from left (trying to reduce/give e-)
      const t2 = (time * speed + 1) % 2;
      na.position.set(-4 + t2*3, -1, 0);
      
      // Both bounce off the impenetrable Helium
  };

  return {
    group: group,
    description: "Oxidation and Reduction Inertness. Helium cannot be oxidized (it refuses to lose an electron) and it cannot be reduced (it refuses to gain an electron because its 1s shell is full and the 2s shell is too high in energy). It is the most chemically inert substance known.",
    parts: [
      { name: "Oxygen (Red)", material: "Oxidizer", function: "Fails to steal an electron from Helium." },
      { name: "Sodium (Purple)", material: "Reducer", function: "Fails to force an extra electron onto Helium." },
      { name: "Helium (Cyan)", material: "Perfectly Inert", function: "Unaffected by all chemical reactions." }
    ],
    quizQuestions: [
      { question: "What happens when you mix Helium with pure Oxygen and apply a spark?", options: ["It explodes into water", "It burns slowly", "Absolutely nothing happens", "It forms Helium Oxide"], correct: 2, explanation: "Helium is completely chemically inert. It cannot be oxidized (burned). This is why Helium is used in blimps today instead of highly flammable Hydrogen." }
    ]
  };
}