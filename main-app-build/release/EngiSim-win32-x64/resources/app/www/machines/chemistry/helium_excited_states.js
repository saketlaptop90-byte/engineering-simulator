import * as THREE from 'three';
export function createHeliumExcitedStates() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // 1s orbital (Ground state for e1)
  const innerShell = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 16), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.3, wireframe: true}));
  group.add(innerShell);

  // 2s orbital (Excited state for e2)
  const outerShell = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(outerShell);

  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  
  // Parallel spin arrows (Orthohelium)
  const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.5, 0xffff00);
  const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.5, 0xffff00);
  e1.add(a1); e2.add(a2);
  
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      innerShell.rotation.y = time * speed * 0.5;
      outerShell.rotation.x = time * speed * 0.2;
      
      e1.position.set(Math.cos(time*speed*4)*1.0, 0, Math.sin(time*speed*4)*1.0);
      e2.position.set(Math.cos(time*speed*1.5)*3.0, Math.sin(time*speed*2)*3.0, Math.sin(time*speed*1.5)*3.0);
  };

  return {
    group: group,
    description: "Excited States (Orthohelium). If hit by high energy, one electron jumps to the 2s orbital. While up there, it can flip its spin so that BOTH electrons have 'Up' spins (Parallel). Because they are in different shells, this doesn't violate Pauli. This state is called 'Orthohelium' and is highly metastable.",
    parts: [
      { name: "Inner Electron (1s)", material: "Cyan Dot", function: "Remains in the ground state." },
      { name: "Excited Electron (2s)", material: "White Dot", function: "Orbiting far away in the n=2 shell." },
      { name: "Parallel Spins", material: "Yellow Arrows", function: "Both pointing UP. This makes the atom magnetic (paramagnetic) until it decays." }
    ],
    quizQuestions: [
      { question: "Why is 'Orthohelium' (where both electrons have parallel 'Up' spins) allowed to exist, even though it seems to violate the Pauli Exclusion Principle?", options: ["Because it's an illusion", "Because the two electrons are in entirely different orbitals (1s and 2s), so their overall quantum states are different", "Because Helium is immune to physics rules", "Because they are protons"], correct: 1, explanation: "Pauli says no two electrons can have the EXACT same set of quantum numbers. Since one electron is in shell n=1 and the other is in shell n=2, they can safely share the same spin state without overlapping." }
    ]
  };
}