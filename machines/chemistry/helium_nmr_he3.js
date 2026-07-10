import * as THREE from 'three';
export function createHeliumNmrHe3() {
  const group = new THREE.Group();
  
  // He-3 nucleus (2p, 1n) -> net spin 1/2
  const nucleus = new THREE.Group();
  const pMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  nucleus.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), pMat)).position.set(0.3,0.3,0);
  nucleus.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), pMat)).position.set(-0.3,-0.3,0);
  nucleus.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), nMat)).position.set(-0.3,0.3,0.3);
  group.add(nucleus);

  // Magnetic field (B0)
  const b0 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(2, -2, 0), 4, 0x0000ff, 0.5, 0.5);
  group.add(b0);

  // Nuclear magnetic moment vector precessing
  const moment = new THREE.ArrowHelper(new THREE.Vector3(0,1,0).normalize(), new THREE.Vector3(0,0,0), 3, 0xff00ff, 0.5, 0.5);
  group.add(moment);

  group.userData.animate = function(delta, time, speed) {
      // Precession (Larmor frequency)
      const angle = time * speed * 3;
      const dir = new THREE.Vector3(Math.cos(angle)*0.5, 1, Math.sin(angle)*0.5).normalize();
      moment.setDirection(dir);
  };

  return {
    group: group,
    description: "He-3 Nuclear Magnetic Resonance (NMR). Because Helium-3 has an odd number of neutrons (1), the nucleus has a net nuclear spin (I=1/2), allowing it to precess in a magnetic field and be detected via NMR.",
    parts: [
      { name: "He-3 Nucleus", material: "Spin-1/2 Fermion", function: "Acts like a tiny bar magnet." },
      { name: "External Magnetic Field (B0)", material: "Magnetic Field", function: "Causes the nuclear spin to align." },
      { name: "Precession", material: "Larmor Motion", function: "The spin vector wobbles around the magnetic field axis." }
    ],
    quizQuestions: [
      { question: "Why is Helium-3 NMR active, while Helium-4 is not?", options: ["He-4 is too heavy", "He-3 has an unpaired neutron giving it a net nuclear spin of 1/2, whereas He-4 has paired protons and neutrons (spin 0)", "He-3 has more electrons", "He-4 is a solid"], correct: 1, explanation: "NMR requires a nucleus with a non-zero spin. He-4 has an even number of protons (2) and neutrons (2), which pair up to give a net spin of 0. He-3 has an unpaired neutron, giving a net spin of 1/2." }
    ]
  };
}
