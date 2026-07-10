import * as THREE from 'three';
export function createHeliumAtomicRadius() {
  const group = new THREE.Group();
  
  // Hydrogen (Grey, for comparison)
  const hSphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0x888888, transparent: true, opacity: 0.2, wireframe: true}));
  hSphere.position.set(-2, 0, 0);
  group.add(hSphere);
  hSphere.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));

  // Helium (Cyan, much smaller)
  const heSphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.4}));
  heSphere.position.set(2, 0, 0);
  group.add(heSphere);
  heSphere.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));

  // Labels
  const hLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,0), new THREE.Vector3(-2,1.2,0)]), new THREE.LineBasicMaterial({color: 0xffffff}));
  const heLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2,0,0), new THREE.Vector3(2,0.8,0)]), new THREE.LineBasicMaterial({color: 0xffffff}));
  group.add(hLine, heLine);

  group.userData.animate = function(delta, time, speed) {
      hSphere.rotation.y = time * speed * 0.2;
      heSphere.rotation.y = -time * speed * 0.2;
  };

  return {
    group: group,
    description: "Atomic Radius. Helium has the smallest atomic radius of any element on the periodic table (Calculated radius ~31 pm). Despite having twice the mass and twice the electrons of Hydrogen, the doubled nuclear charge (+2) pulls the entire cloud inward far tighter than Hydrogen's +1 charge.",
    parts: [
      { name: "Hydrogen Radius", material: "Grey Sphere", function: "Larger, because +1 charge exerts a weaker pull." },
      { name: "Helium Radius", material: "Cyan Sphere", function: "Smallest in the universe. Pulled extremely tight by +2 charge." }
    ],
    quizQuestions: [
      { question: "Which element has the absolute smallest atomic radius on the entire periodic table?", options: ["Hydrogen", "Helium", "Fluorine", "Francium"], correct: 1, explanation: "Helium is the smallest. Even though Hydrogen has fewer electrons, Helium's nucleus has twice the attractive force (+2), which shrinks its single electron shell to the smallest size possible." }
    ]
  };
}