import * as THREE from 'three';
export function createHeliumElectronDensity() {
  const group = new THREE.Group();
  
  // Concentric spheres for Helium 1s^2. 
  // Helium's 1s orbital is much smaller and denser than Hydrogen's because of the +2 nuclear charge.
  const createDensityShell = (radius, opacity, colorHex) => {
      const mat = new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: opacity, side: THREE.DoubleSide});
      return new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
  };

  // Very high density, very compact
  group.add(createDensityShell(0.3, 0.9, 0xffffff));
  group.add(createDensityShell(0.6, 0.6, 0xaaffff));
  group.add(createDensityShell(1.2, 0.3, 0x5555ff));
  group.add(createDensityShell(2.0, 0.1, 0x0000ff));

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
  };

  return {
    group: group,
    description: "Electron Density of Helium (1s²). Because Helium has a +2 nuclear charge, it pulls its two 1s electrons much closer to the nucleus than Hydrogen's +1 charge does. This makes Helium's electron cloud the smallest, most tightly packed, and most spherical of any atom on the Periodic Table.",
    parts: [
      { name: "Ultra-compact Core", material: "White/Cyan", function: "Extreme electron density due to Z=2 nuclear charge." },
      { name: "Outer Cloud", material: "Dark Blue", function: "Shrinks rapidly compared to Hydrogen." }
    ],
    quizQuestions: [
      { question: "Why is Helium's electron cloud significantly smaller (more compact) than Hydrogen's?", options: ["It has fewer electrons", "Helium's nucleus has a +2 charge which pulls the 1s electrons in much tighter than Hydrogen's +1 charge", "Helium is a noble gas", "Helium is lighter"], correct: 1, explanation: "Even though Helium has twice as many electrons as Hydrogen, both electrons are in the same 1s shell. The doubling of the nuclear charge from +1 to +2 pulls that entire shell dramatically inward." }
    ]
  };
}