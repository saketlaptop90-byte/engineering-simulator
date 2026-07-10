import * as THREE from 'three';
export function createLithiumElectronegativity() {
  const group = new THREE.Group();
  
  // A tug of war for an electron
  // Li (Left, weak) vs F (Right, strong)
  
  const li = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.5}));
  li.position.set(-3, 0, 0); group.add(li);
  const liL = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); liL.position.set(-3, 2, 0); group.add(liL); // Li: 0.98

  const f = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  f.position.set(3, 0, 0); group.add(f);
  const fL = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})); fL.position.set(3, 2, 0); group.add(fL); // F: 3.98

  // The rope (Bond)
  const rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,0,0), new THREE.Vector3(3,0,0)]), new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 3}));
  group.add(rope);

  // The Electron (Pulled to the right)
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(e);

  group.userData.animate = function(delta, time, speed) {
      // Electron slowly getting pulled all the way to F
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Struggle
          e.position.set(Math.sin(time*speed*10)*0.5, 0, 0);
          li.position.x = -3 + Math.sin(time*speed*10)*0.1;
          f.position.x = 3 + Math.sin(time*speed*10)*0.1;
      } else {
          // F wins
          const t = cycle - 1;
          e.position.set(t*3, 0, 0);
      }
  };

  return {
    group: group,
    description: "Electronegativity (0.98). Electronegativity is an atom's ability to 'pull' on shared electrons in a bond. The scale goes up to 4.0 (Fluorine). Lithium's score is a measly 0.98. Because its nucleus is shielded, it has an incredibly weak grip on its outer electrons. In almost any tug-of-war with another element, Lithium loses its electron completely.",
    parts: [
      { name: "Magenta Sphere", material: "Lithium (0.98)", function: "Weak pull. Wants to lose electrons anyway." },
      { name: "Green Sphere", material: "Fluorine (3.98)", function: "Strongest pull in the universe." },
      { name: "Yellow Dot", material: "The Shared Electron", function: "Easily stolen from Lithium." }
    ],
    quizQuestions: [
      { question: "What does it mean if an element has a very low Electronegativity score (like 0.98)?", options: ["It means it strongly pulls electrons toward itself", "It means it hates protons", "It means it is a weak puller, and will easily surrender its electrons to other atoms", "It means it doesn't exist"], correct: 2, explanation: "Metals generally have low electronegativity. They want to give electrons away to reach a stable core, so they don't fight hard to keep them." }
    ]
  };
}