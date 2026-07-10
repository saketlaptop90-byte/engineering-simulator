import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export function createLithiumOrbitalFillingSequence() {
  const group = new THREE.Group();
  
  // Orbital Filling Sequence (Diagonal Rule) (Remastered)
  
  const textGroup = new THREE.Group();
  group.add(textGroup);
  
  const loader = new FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
      
      const createOrbital = (str, x, y, color) => {
          const geo = new TextGeometry(str, { font: font, size: 0.8, depth: 0.1 });
          geo.computeBoundingBox();
          const offset = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
          const mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({color: color, metalness: 0.5, roughness: 0.2, emissive: color, emissiveIntensity: 0.2}));
          mesh.position.set(x + offset, y, 0);
          textGroup.add(mesh);
          return mesh;
      };
      
      // Lay out the classic grid
      // n=1
      createOrbital("1s", -4, 4, 0x00ffff);
      // n=2
      createOrbital("2s", -4, 2, 0xff00ff);
      createOrbital("2p", -1.5, 2, 0x555555);
      // n=3
      createOrbital("3s", -4, 0, 0x555555);
      createOrbital("3p", -1.5, 0, 0x555555);
      createOrbital("3d", 1, 0, 0x555555);
      // n=4
      createOrbital("4s", -4, -2, 0x555555);
      createOrbital("4p", -1.5, -2, 0x555555);
      createOrbital("4d", 1, -2, 0x555555);
      createOrbital("4f", 3.5, -2, 0x555555);
  });
  
  // The diagonal arrows!
  const createDiagonal = (x1, y1, x2, y2) => {
      const g = new THREE.Group();
      const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
      const angle = Math.atan2(y2-y1, x2-x1);
      
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist), new THREE.MeshBasicMaterial({color: 0xffffff}));
      stick.rotation.z = Math.PI/2;
      stick.position.x = dist/2;
      
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      head.rotation.z = -Math.PI/2;
      head.position.x = dist;
      
      g.add(stick, head);
      g.position.set(x1, y1, -0.5);
      g.rotation.z = angle;
      return g;
  };
  
  group.add(createDiagonal(-2, 4.5, -5, 3.5)); // through 1s
  group.add(createDiagonal(-2, 2.5, -5, 1.5)); // through 2s
  group.add(createDiagonal(0.5, 2.5, -5, -0.5)); // through 2p, 3s
  group.add(createDiagonal(3, 0.5, -5, -2.5)); // through 3p, 4s

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.position.y = Math.sin(time*speed)*0.2;
      group.rotation.x = Math.sin(time*speed*0.5)*0.1;
      group.rotation.y = Math.sin(time*speed*0.5)*0.1;
  };

  return {
    group: group,
    description: "Orbital Filling Sequence (Remastered). You might think orbitals fill up neatly by shell: all of n=1, then all of n=2, then all of n=3. But they don't! Because of complex quantum energy overlaps, the 4s orbital is actually lower in energy than the 3d orbital, so it fills first! Chemists use this 'Diagonal Rule' chart to remember the exact filling order. By drawing diagonal arrows from top-right to bottom-left, you get the sequence: 1s, 2s, 2p, 3s, 3p, 4s, 3d. Since Lithium only has 3 electrons, it stops very early on this chart: it fills the 1s (Cyan), puts one in the 2s (Magenta), and leaves the rest completely dark!",
    parts: [
      { name: "Cyan Text (1s)", material: "Filled Core", function: "The first step on the diagonal." },
      { name: "Magenta Text (2s)", material: "Valence Shell", function: "The second step on the diagonal, partially filled by Lithium." },
      { name: "Dark Text", material: "Empty Orbitals", function: "Higher energy states that Lithium doesn't have enough electrons to reach." }
    ],
    quizQuestions: [
      { question: "Why do chemists use the 'Diagonal Rule' instead of just filling orbitals sequentially by their shell number (n=1, n=2, n=3)?", options: ["Because it looks cool", "Because higher energy subshells overlap (e.g. 4s is actually lower energy than 3d).", "Because protons interfere", "Because atoms are diagonal"], correct: 1, explanation: "The shapes of the d and f orbitals are so complex that they actually push their energy levels higher than the simple s-orbitals of the next shell up!" }
    ]
  };
}