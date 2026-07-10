import * as THREE from 'three';
export function createHydrogenBiologicalImportance() {
  const group = new THREE.Group();
  
  // Lipid bilayer membrane
  const membrane = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), new THREE.MeshPhysicalMaterial({color: 0x88aa44, transparent: true, opacity: 0.8}));
  group.add(membrane);

  // ATP Synthase Enzyme
  const atp = new THREE.Group();
  const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  rotor.position.y = 0.5;
  const stator = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), new THREE.MeshStandardMaterial({color: 0x8888ff}));
  stator.position.set(-1, 0, 0);
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshStandardMaterial({color: 0xff00ff}));
  head.position.y = 1.8;
  atp.add(rotor, stator, head);
  group.add(atp);

  // Protons (H+) flowing through
  const protons = new THREE.Group();
  for(let i=0; i<10; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
      p.userData = { offset: i * 0.4 };
      protons.add(p);
  }
  group.add(protons);

  group.userData.animate = function(delta, time, speed) {
      // Protons flowing down the gradient through the rotor
      protons.children.forEach(p => {
          const t = ((time*speed + p.userData.offset) % 4);
          if (t < 2) {
              p.position.set(0.5, -2 + t, 0); // Moving up into rotor
          } else {
              p.position.set(0.5, 0, 0); // Ejected
          }
      });
      // Rotor spinning as protons pass
      rotor.rotation.y = time * speed * 2;
      head.rotation.y = time * speed * 0.5;
  };

  return {
    group: group,
    description: "Biological Importance (Proton Motive Force). Hydrogen protons (H+) are the fundamental energy currency of life. In your mitochondria, a high concentration of H+ flows through the ATP Synthase enzyme, spinning its mechanical rotor to generate ATP (biological energy).",
    parts: [
      { name: "Protons (H+)", material: "Red Dots", function: "Flowing down their electrochemical gradient." },
      { name: "ATP Synthase", material: "Enzyme", function: "A literal nano-motor that spins when H+ passes through it." },
      { name: "Mitochondrial Membrane", material: "Green Barrier", function: "Maintains the high concentration of Protons on one side." }
    ],
    quizQuestions: [
      { question: "How does the flow of Hydrogen ions (H+) generate biological energy in humans?", options: ["They undergo nuclear fusion in the heart", "They mechanically spin a turbine-like enzyme (ATP Synthase) to produce ATP", "They explode when mixing with oxygen", "They dissolve food chemically"], correct: 1, explanation: "Cellular respiration pumps H+ ions across a membrane. As they flow back across the membrane to equalize the pressure, they pass through ATP Synthase, physically rotating it to attach a phosphate group to ADP, creating ATP." }
    ]
  };
}