import * as THREE from 'three';
export function createHydrogenElectronDensity() {
  const group = new THREE.Group();
  
  // Concentric spheres with decreasing opacity to show density gradient
  const createDensityShell = (radius, opacity, colorHex) => {
      const mat = new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: opacity, side: THREE.DoubleSide});
      return new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
  };

  // High density near nucleus
  group.add(createDensityShell(0.5, 0.8, 0xffffff));
  group.add(createDensityShell(1.0, 0.5, 0xaaffff));
  group.add(createDensityShell(2.0, 0.2, 0x5555ff));
  group.add(createDensityShell(3.5, 0.05, 0x0000ff));

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
  };

  return {
    group: group,
    description: "Electron Density. A visual heat map of Hydrogen's 1s orbital. The electron density is highest directly at the nucleus and decays exponentially as distance increases.",
    parts: [
      { name: "High Density Core", material: "White/Cyan", function: "Most probable location of the electron." },
      { name: "Low Density Fringe", material: "Dark Blue", function: "Very low, but technically non-zero, probability extending to infinity." }
    ],
    quizQuestions: [
      { question: "Where is the electron density highest in a Hydrogen 1s orbital?", options: ["At the Bohr radius (52.9 pm)", "Directly at the nucleus (radius = 0)", "At the very edge of the atom", "In a ring around the nucleus"], correct: 1, explanation: "For any s-orbital (including 1s), the electron probability density (electrons per unit volume) is strictly highest right at the nucleus, and decays exponentially outward." }
    ]
  };
}