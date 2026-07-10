import * as THREE from 'three';
export function createHydrogenRadioactiveDecay() {
  const group = new THREE.Group();
  
  // Tritium Nucleus (1P, 2N)
  const nucleus = new THREE.Group();
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshBasicMaterial({color: 0xcccccc}));
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshBasicMaterial({color: 0xcccccc})); // Will decay
  p1.position.set(0.3, 0.3, 0); n1.position.set(-0.3, -0.3, 0); n2.position.set(-0.3, 0.3, 0.3);
  nucleus.add(p1, n1, n2);
  group.add(nucleus);

  // Ejected particles
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  const antineutrino = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true}));
  group.add(electron, antineutrino);

  // Flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      
      if (cycle < 2) {
          // Pre-decay (Tritium)
          n2.material.color.setHex(0xcccccc);
          electron.visible = false; antineutrino.visible = false;
          flash.material.opacity = 0;
          nucleus.rotation.y = time * speed;
      } else if (cycle < 2.2) {
          // Flash
          flash.material.opacity = 1 - ((cycle-2)/0.2);
          n2.material.color.setHex(0xff0000); // Neutron becomes proton (He-3)
      } else {
          // Ejection (Beta decay)
          electron.visible = true; antineutrino.visible = true;
          const t = cycle - 2.2;
          electron.position.set(t*5, Math.sin(t*10)*0.5, 0);
          antineutrino.position.set(t*4, -Math.sin(t*8)*0.5, t*2);
      }
  };

  return {
    group: group,
    description: "Radioactive Decay (Beta Minus). Tritium (Hydrogen-3) is unstable because it has too many neutrons (2) for its 1 proton. Through the Weak Nuclear Force, one neutron transforms into a proton, emitting a high-energy electron (Beta particle) and an electron antineutrino.",
    parts: [
      { name: "Tritium (H-3)", material: "Isotope", function: "The unstable radioactive parent nucleus." },
      { name: "Helium-3 (He-3)", material: "Daughter Isotope", function: "The stable product formed when a neutron becomes a proton." },
      { name: "Beta Particle (e-)", material: "Radiation", function: "High-speed electron ejected to conserve charge." }
    ],
    quizQuestions: [
      { question: "When Tritium undergoes Beta decay, what element does it transmute into?", options: ["Deuterium", "Helium-3", "Carbon-14", "Lithium"], correct: 1, explanation: "In Beta minus decay, a neutron turns into a proton. Since Tritium originally had 1 proton, it now has 2 protons. An atom with 2 protons is, by definition, Helium (specifically Helium-3)." }
    ]
  };
}