import * as THREE from 'three';
export function createHydrogenEffectiveNuclearCharge() {
  const group = new THREE.Group();
  
  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
  group.add(nuc);
  
  // Electron
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  electron.position.set(3, 0, 0);
  group.add(electron);

  // Zeff text/visualizer (A direct, unblocked line of sight)
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0)]), new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 3}));
  group.add(line);

  // Pulse rings originating from nucleus
  const pulseGroup = new THREE.Group();
  for(let i=0; i<3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i, 0.02, 8, 32), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5}));
      ring.rotation.x = Math.PI/2;
      pulseGroup.add(ring);
  }
  group.add(pulseGroup);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.5;
      pulseGroup.children.forEach((ring, i) => {
          let s = 1 + (time * speed * 2 + i) % 3;
          ring.scale.set(s, s, s);
          ring.material.opacity = 1 - (s/4);
      });
  };

  return {
    group: group,
    description: "Effective Nuclear Charge (Z_eff). This is the net positive charge experienced by an electron. Because Hydrogen has no inner 'core' electrons to block (shield) the nucleus, the electron experiences the full +1 charge of the proton. Therefore, for Hydrogen, Z_eff = Z = 1.",
    parts: [
      { name: "Proton (Z = 1)", material: "Nucleus", function: "Projects a +1 electrostatic field." },
      { name: "Unblocked Force Line", material: "Green Line", function: "Represents 100% of the nuclear charge reaching the electron." }
    ],
    quizQuestions: [
      { question: "What is the Effective Nuclear Charge (Z_eff) experienced by Hydrogen's single electron?", options: ["0", "0.5", "1 (The full charge of the proton)", "2"], correct: 2, explanation: "Z_eff = Z - S, where Z is the actual nuclear charge and S is the shielding constant. Since Hydrogen has no inner electrons to shield the nucleus, S = 0. Therefore, Z_eff = 1 - 0 = 1." }
    ]
  };
}