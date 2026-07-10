import * as THREE from 'three';
export function createBerylliumAbsorptionSpectrum() {
  const group = new THREE.Group();
  
  // A full rainbow background plate
  const bgGeo = new THREE.PlaneGeometry(8, 2);
  
  // Create a rainbow texture manually
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 2;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.15, "orange");
  gradient.addColorStop(0.3, "yellow");
  gradient.addColorStop(0.5, "green");
  gradient.addColorStop(0.65, "cyan");
  gradient.addColorStop(0.8, "blue");
  gradient.addColorStop(1, "violet");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 2);
  
  const tex = new THREE.CanvasTexture(canvas);
  const bg = new THREE.Mesh(bgGeo, new THREE.MeshBasicMaterial({map: tex}));
  bg.position.z = -0.1;
  group.add(bg);

  // Beryllium's specific absorption lines (BLACK lines cutting out the light)
  const createLine = (x, width=0.05) => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(width, 2), new THREE.MeshBasicMaterial({color: 0x000000})); // Black
      line.position.set(x, 0, 0);
      group.add(line);
      return line;
  };
  
  // Exact same positions as emission
  const l1 = createLine(1.6); // Blue
  const l2 = createLine(0); // Green
  const l3 = createLine(-2.5); // Red

  // Photon hitting atom
  const atom = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); atom.add(nuc);
  const orbit1 = new THREE.Mesh(new THREE.RingGeometry(1, 1.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(orbit1);
  const orbit2 = new THREE.Mesh(new THREE.RingGeometry(2, 2.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(orbit2);
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); atom.add(e);
  atom.position.set(0, -3, 0);
  group.add(atom);

  // Incoming photon
  const photon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffaa}));
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 2;
      
      if (cycle < 1) {
          // Ground state, photon incoming
          e.position.set(1, 0, 0);
          photon.visible = true;
          photon.position.set(-3 + cycle*3, -3, 0);
      } else {
          // Absorbed, electron jumps up
          photon.visible = false;
          e.position.set(2, 0, 0); // Jumped to orbit 2
      }
  };

  return {
    group: group,
    description: "Absorption Spectrum. The exact opposite of emission! If you shine a full white light (a rainbow) through a cloud of cold Beryllium gas, the gas will steal very specific colors out of the light. The electrons absorb the photons that have the EXACT amount of energy needed to jump up a level. This leaves pitch-black gaps in the rainbow exactly where the emission lines would normally be.",
    parts: [
      { name: "Rainbow", material: "White Light", function: "All wavelengths of light passing through the gas." },
      { name: "Black Gaps", material: "Absorbed Light", function: "The Beryllium stole these specific photons." },
      { name: "Jumping Electron", material: "Excitation", function: "Consuming the photon's energy to jump to a higher orbit." }
    ],
    quizQuestions: [
      { question: "How do the black lines in an absorption spectrum compare to the colored lines in an emission spectrum for the same element?", options: ["They are completely random", "They are in the exact same positions, because the energy to jump up is exactly the same as the energy released when falling down", "The black lines are twice as thick", "The black lines only appear at night"], correct: 1, explanation: "It's the exact same quantum staircase. Climbing up 1 step requires the exact same amount of energy as falling down 1 step releases. The barcodes match perfectly." }
    ]
  };
}