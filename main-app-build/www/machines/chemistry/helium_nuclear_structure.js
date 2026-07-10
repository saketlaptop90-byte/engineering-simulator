import * as THREE from 'three';
export function createHeliumNuclearStructure() {
  const group = new THREE.Group();
  
  // Alpha Particle (Helium Nucleus)
  const nucleus = new THREE.Group();
  
  // 2 Protons (Red)
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.2}));
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.2}));
  
  // 2 Neutrons (Grey)
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshStandardMaterial({color: 0x888888, roughness: 0.2}));
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshStandardMaterial({color: 0x888888, roughness: 0.2}));
  
  p1.position.set(0.5, 0.5, 0);
  p2.position.set(-0.5, -0.5, 0);
  n1.position.set(0.5, -0.5, 0.5);
  n2.position.set(-0.5, 0.5, -0.5);
  
  nucleus.add(p1, p2, n1, n2);
  group.add(nucleus);

  // Strong Nuclear Force (Binding Energy mesh)
  const force = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32,32), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.2, wireframe: true}));
  nucleus.add(force);

  group.userData.animate = function(delta, time, speed) {
      nucleus.rotation.x = time * speed * 0.5;
      nucleus.rotation.y = time * speed * 0.7;
      
      // Jitter
      force.scale.setScalar(1 + Math.sin(time*speed*10)*0.05);
  };

  return {
    group: group,
    description: "Nuclear Structure (The Alpha Particle). Helium's most common isotope (He-4) has a nucleus of 2 protons and 2 neutrons. This specific arrangement is 'doubly magic' in nuclear physics, meaning the strong nuclear force binds them together with extraordinary stability. It is so stable that heavy radioactive elements spit out whole Helium nuclei (Alpha decay) rather than individual protons.",
    parts: [
      { name: "Protons", material: "Red", function: "Charge +2, defines the element." },
      { name: "Neutrons", material: "Grey", function: "Adds mass and provides Strong Force binding without adding electrostatic repulsion." },
      { name: "Binding Energy", material: "Yellow Mesh", function: "The strongest force in the universe holding them together." }
    ],
    quizQuestions: [
      { question: "Why is the Helium-4 nucleus (2 protons, 2 neutrons) considered exceptionally stable in nuclear physics?", options: ["It contains no neutrons", "It is 'doubly magic', perfectly filling nuclear shells for both protons and neutrons", "It has zero mass", "It spins faster than other nuclei"], correct: 1, explanation: "Just like electrons fill shells in chemistry, protons and neutrons fill nuclear shells. He-4 perfectly fills the lowest shell for BOTH protons and neutrons, resulting in an incredibly tight, stable binding energy." }
    ]
  };
}