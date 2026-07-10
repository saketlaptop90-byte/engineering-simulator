import * as THREE from 'three';
export function createHeliumIonicRadius() {
  const group = new THREE.Group();
  
  // He+ Ion (Lost 1 electron)
  const hePlus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.4}));
  hePlus.position.set(-2, 0, 0);
  hePlus.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  group.add(hePlus);

  // He2+ Ion (Alpha particle - Lost both electrons)
  const alpha = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000, emissive: 0x550000}));
  alpha.position.set(2, 0, 0);
  // Give it a glowing halo to show it's a bare nucleus
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.5, wireframe: true}));
  alpha.add(halo);
  group.add(alpha);

  group.userData.animate = function(delta, time, speed) {
      hePlus.rotation.y = time * speed;
      halo.rotation.x = time * speed * 2;
      halo.rotation.y = time * speed * 2;
  };

  return {
    group: group,
    description: "Ionic Radius. When Helium is forced to lose an electron, it becomes the He+ ion. Because a +2 nucleus is now pulling on only ONE electron, the radius shrinks drastically. If it loses both electrons (He2+), it becomes a bare Alpha Particle, with an effective radius of nearly zero.",
    parts: [
      { name: "He+ Ion (Left)", material: "Green Cloud", function: "Radius shrinks because electron repulsion is gone." },
      { name: "He2+ Alpha Particle (Right)", material: "Red Nucleus", function: "A bare nucleus. Radius is basically ~0.000001 pm." }
    ],
    quizQuestions: [
      { question: "What happens to the size of the Helium atom if it is ionized to form He+?", options: ["It expands massively", "It stays exactly the same", "It shrinks significantly because the +2 nucleus is now pulling on only one electron", "It turns into a square"], correct: 2, explanation: "Removing an electron eliminates all electron-electron repulsion. The +2 nucleus can now pull that single remaining electron much closer, shrinking the radius." }
    ]
  };
}