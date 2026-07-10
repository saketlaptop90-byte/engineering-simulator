import * as THREE from 'three';
export function createLithiumNuclearStructure() {
  const group = new THREE.Group();
  
  // A close-up of a Lithium-7 nucleus
  const core = new THREE.Group();
  
  // 3 Protons
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, clearcoat: 1.0})); p1.position.set(0, 0.8, 0.5);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, clearcoat: 1.0})); p2.position.set(-0.8, -0.5, 0);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, clearcoat: 1.0})); p3.position.set(0.8, -0.5, 0);
  
  // 4 Neutrons
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, clearcoat: 1.0})); n1.position.set(0, 0, -1);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, clearcoat: 1.0})); n2.position.set(-0.5, 0.8, -0.5);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, clearcoat: 1.0})); n3.position.set(0.5, 0.8, -0.5);
  const n4 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa, clearcoat: 1.0})); n4.position.set(0, -1, 0.8);
  
  core.add(p1, p2, p3, n1, n2, n3, n4);
  group.add(core);

  // Strong Nuclear Force (Glowing binding energy)
  const snf = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.3, wireframe: true}));
  group.add(snf);

  group.userData.animate = function(delta, time, speed) {
      core.rotation.y = time * speed * 0.2;
      core.rotation.x = time * speed * 0.1;
      core.rotation.z = time * speed * 0.15;
      
      // Jiggle the nucleons (Quantum fluctuations)
      core.children.forEach((c, idx) => {
          c.position.x += Math.sin(time*speed*10 + idx)*0.01;
          c.position.y += Math.cos(time*speed*12 + idx)*0.01;
      });
      
      // Pulse SNF
      snf.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
  };

  return {
    group: group,
    description: "Nuclear Structure (Strong Nuclear Force). You might wonder: if protons repel each other like magnets, why doesn't the Lithium nucleus (with 3 protons crammed together) explode? The answer is the 'Strong Nuclear Force'. This force is 137 times stronger than electromagnetism, but only works at ultra-microscopic distances. The neutrons act like glue, helping the Strong Force overcome the electrostatic repulsion of the protons.",
    parts: [
      { name: "Red Spheres", material: "Protons", function: "Positively charged. They desperately want to push away from each other." },
      { name: "Grey Spheres", material: "Neutrons", function: "Neutral charge. They add extra Strong Force 'glue' without adding repulsive electrical charge." },
      { name: "Yellow Aura", material: "Strong Nuclear Force", function: "The ultra-powerful force binding them all together." }
    ],
    quizQuestions: [
      { question: "What is the primary role of neutrons in the Lithium nucleus?", options: ["To make the atom heavier so it sinks", "To balance out the electrons", "To provide extra 'Strong Nuclear Force' glue to hold the repelling protons together", "To generate electricity"], correct: 2, explanation: "Without neutrons, the protons would violently repel each other and tear the nucleus apart. Neutrons feel the Strong Nuclear Force (pulling inward) but do not have an electrical charge (so they don't push outward), making them perfect nuclear glue." }
    ]
  };
}