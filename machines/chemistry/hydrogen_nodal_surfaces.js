import * as THREE from 'three';
export function createHydrogenNodalSurfaces() {
  const group = new THREE.Group();
  
  // 3s Orbital has 2 radial nodes (regions of zero probability)
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.6}));
  
  // Node 1 (Black/Empty space)
  const node1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.4, side: THREE.DoubleSide}));
  
  const mid = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide}));
  
  // Node 2 (Black/Empty space)
  const node2 = new THREE.Mesh(new THREE.SphereGeometry(2.8, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.3, side: THREE.DoubleSide}));
  
  const outer = new THREE.Mesh(new THREE.SphereGeometry(4.0, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide}));

  group.add(center); group.add(node1); group.add(mid); group.add(node2); group.add(outer);

  // Cutting plane effect using clipping planes (simulated by scaling half)
  group.userData.animate = function(delta, time, speed) {
      const scale = 1 + Math.sin(time*speed*3)*0.02;
      group.scale.set(scale, scale, scale);
  };

  return {
    group: group,
    description: "Nodal Surfaces in 3s Orbital. A 'node' is a region where the probability of finding an electron drops to absolutely zero. A 3s orbital has exactly 2 spherical radial nodes separating its probability density into three distinct shells.",
    parts: [
      { name: "Colored Shells", material: "Probability > 0", function: "Regions where the electron can exist." },
      { name: "Dark Spheres", material: "Probability = 0", function: "The Nodal Surfaces where the wavefunction crosses zero." }
    ],
    quizQuestions: [
      { question: "How does an electron move from the inner probability shell to the outer shell across a node where the probability of existing is zero?", options: ["It breaks the speed of light", "It tunnels through it mechanically", "It doesn't move 'through' space like a particle; it exists as a continuous quantum wave that spans both regions simultaneously", "It waits until the node disappears"], correct: 2, explanation: "This highlights the failure of treating electrons purely as classical particles. The electron is a standing wave that naturally has nodes, much like a vibrating guitar string has stationary points. It exists everywhere the wave is non-zero simultaneously." }
    ]
  };
}