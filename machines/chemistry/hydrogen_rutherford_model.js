import * as THREE from 'three';
export function createHydrogenRutherfordModel() {
  const group = new THREE.Group();
  
  // Tiny, dense nucleus
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xaa0000}));
  group.add(nucleus);

  // Large empty space
  const voidSpace = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.05, wireframe: true}));
  group.add(voidSpace);

  // Electron in arbitrary orbit
  const orbitGroup = new THREE.Group();
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  electron.position.set(3, 0, 0);
  orbitGroup.add(electron);
  
  // Orbit trail
  const trail = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 3, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x4444ff, transparent: true, opacity: 0.4}));
  trail.rotation.x = Math.PI/2;
  orbitGroup.add(trail);

  orbitGroup.rotation.x = Math.PI/4;
  orbitGroup.rotation.y = Math.PI/6;
  group.add(orbitGroup);

  group.userData.animate = function(delta, time, speed) {
      orbitGroup.rotation.z = time * speed * 4; // Fast orbit
  };

  return {
    group: group,
    description: "Rutherford Planetary Model (1911). Conceived after the famous Gold Foil experiment. Rutherford theorized a tiny, incredibly dense, positively charged nucleus surrounded by vast empty space with electrons orbiting like planets.",
    parts: [
      { name: "Dense Nucleus", material: "Proton", function: "Contains virtually all the atom's mass." },
      { name: "Vast Empty Space", material: "Vacuum", function: "Most of the atom's volume." },
      { name: "Orbiting Electron", material: "Electron", function: "Orbits the nucleus due to electrostatic attraction." }
    ],
    quizQuestions: [
      { question: "What major flaw in classical physics caused the Rutherford model to be unstable?", options: ["It didn't account for neutrons", "Classical electromagnetism predicted that an accelerating (orbiting) electron should constantly radiate energy and spiral into the nucleus in a fraction of a second", "Gravity was too weak", "The nucleus was too large"], correct: 1, explanation: "An electron moving in a circle is constantly accelerating. Classical physics says an accelerating charge emits radiation (loses energy). Thus, Rutherford's electron should spiral into the nucleus almost instantly, meaning matter shouldn't exist. This flaw led to Bohr's quantum model." }
    ]
  };
}