import * as THREE from 'three';
export function createBerylliumEmissionSpectrum() {
  const group = new THREE.Group();
  
  // A dark background plate
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({color: 0x111111}));
  bg.position.z = -0.1;
  group.add(bg);

  // Beryllium's specific emission lines
  const createLine = (x, color, width=0.05) => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(width, 2), new THREE.MeshBasicMaterial({color: color}));
      line.position.set(x, 0, 0);
      group.add(line);
      return line;
  };
  
  // Beryllium has distinct lines in the blue and green/UV
  const l1 = createLine(-2.5, 0x0000ff); // ~457 nm (Blue)
  const l2 = createLine(1.0, 0x00ffaa); // ~527 nm (Greenish)
  const l3 = createLine(2.5, 0xff0000, 0.02); // Faint red
  
  // A glowing atom dropping an electron to emit a photon
  const atom = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); atom.add(nuc);
  const orbit1 = new THREE.Mesh(new THREE.RingGeometry(1, 1.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(orbit1);
  const orbit2 = new THREE.Mesh(new THREE.RingGeometry(2, 2.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(orbit2);
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); atom.add(e);
  atom.position.set(0, 3, 0);
  group.add(atom);

  // Photon
  const photon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffaa}));
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 2;
      
      if (cycle < 1) {
          // Excited state
          e.position.set(2, 0, 0);
          photon.visible = false;
      } else {
          // Drops to ground, emits photon
          e.position.set(1, 0, 0);
          photon.visible = true;
          photon.position.set(1, 3 - (cycle-1)*5, 0);
          photon.material.color.setHex((cycle*10)%2===0 ? 0x00ffaa : 0x00ffff); // Flashing
      }
      
      // Pulse spectral lines when photon 'hits'
      if (cycle > 1.5) {
          l2.material.opacity = 1;
      } else {
          l2.material.opacity = 0.5;
      }
  };

  return {
    group: group,
    description: "Emission Spectrum. Every element has a unique 'barcode' of light it emits when heated. When you heat Beryllium, its electrons jump to a higher energy level (excited state). When they fall back down, they release that exact specific amount of energy as a photon of light. Because Beryllium's energy steps are unique, it only emits very specific colors (wavelengths), primarily sharp blue and green lines.",
    parts: [
      { name: "Colored Lines", material: "Spectral Signature", function: "The unique barcode of Beryllium." },
      { name: "Dropping Electron", material: "Energy Release", function: "Falling to a lower orbit." },
      { name: "Glowing Pellet", material: "Photon", function: "The released energy manifesting as a particle of light." }
    ],
    quizQuestions: [
      { question: "How do astronomers know there is Beryllium in a star millions of lightyears away?", options: ["They send a probe", "They look at the light from the star through a prism and look for Beryllium's exact unique 'barcode' of colored spectral lines", "They guess based on the star's weight", "They listen for it with a microphone"], correct: 1, explanation: "Spectroscopy is how we know what the universe is made of. The exact colors of light an atom emits are governed by the exact gaps between its quantum energy levels." }
    ]
  };
}