import * as THREE from 'three';
export function createLithiumGroundState() {
  const group = new THREE.Group();
  
  // The lowest possible energy configuration for Lithium
  
  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // 1s shell (Core)
  const shell1s = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5}));
  group.add(shell1s);
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  shell1s.add(e1, e2);

  // 2s shell (Valence)
  const shell2s = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.3}));
  group.add(shell2s);
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  shell2s.add(e3);

  // A giant ZZZ symbol to show it is 'resting'
  const zzz = new THREE.Group();
  const z1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); z1.position.set(0, 0.4, 0);
  const z2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); z2.position.set(0, -0.4, 0);
  const z3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); z3.rotation.z = Math.PI/4;
  zzz.add(z1, z2, z3);
  zzz.position.set(4, 3, 0);
  group.add(zzz);

  group.userData.animate = function(delta, time, speed) {
      shell1s.rotation.y = time * speed * 0.1; // Slow, calm rotation
      shell2s.rotation.x = time * speed * 0.05;
      
      e1.position.set(1.5, 0, 0);
      e2.position.set(-1.5, 0, 0);
      e3.position.set(3.5, 0, 0);
      
      // Floating ZZZs
      zzz.position.y = 3 + (time*speed*0.5 % 2);
      zzz.material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 1 - (time*speed*0.5 % 2)/2});
      z1.material = zzz.material; z2.material = zzz.material; z3.material = zzz.material;
  };

  return {
    group: group,
    description: "Ground State. The 'ground state' of an atom is its lowest possible energy configuration. For Lithium, this means exactly two electrons in the 1s orbital, and one electron in the 2s orbital. The atom is calm, stable (as far as internal energy goes), and 'resting'. It will stay in this exact configuration forever unless acted upon by outside energy.",
    parts: [
      { name: "Cyan / Magenta Spheres", material: "1s and 2s Orbitals", function: "The lowest available energy 'seats' for the electrons." },
      { name: "Floating ZZZs", material: "Resting State", function: "Symbolizes that the atom is completely relaxed with zero excess energy." }
    ],
    quizQuestions: [
      { question: "What defines the 'ground state' of an atom?", options: ["When it is touching the floor", "When all of its electrons are in the lowest possible energy levels available to them", "When it is a solid", "When it has lost all its electrons"], correct: 1, explanation: "Ground state simply means 'zero excess energy'. Every electron has fallen down to the lowest possible orbital allowed by the Pauli Exclusion Principle." }
    ]
  };
}