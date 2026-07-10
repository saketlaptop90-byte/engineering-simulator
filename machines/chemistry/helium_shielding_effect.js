import * as THREE from 'three';
export function createHeliumShieldingEffect() {
  const group = new THREE.Group();
  
  // Left: Hydrogen (0 shielding)
  const hGroup = new THREE.Group();
  hGroup.position.set(-2, 0, 0);
  hGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  const hLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1.5,0,0)]), new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 3}));
  hGroup.add(hLine);
  const hElec = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  hElec.position.set(1.5, 0, 0);
  hGroup.add(hElec);
  group.add(hGroup);

  // Right: Helium (Slight self-shielding)
  const heGroup = new THREE.Group();
  heGroup.position.set(2, 0, 0);
  heGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  const heLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1.0,0,0)]), new THREE.LineBasicMaterial({color: 0x88ff88, linewidth: 2}));
  heGroup.add(heLine);
  
  const heElec1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  heElec1.position.set(1.0, 0, 0);
  const heElec2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  heElec2.position.set(-0.5, 0.5, 0); // Partially blocking the path
  
  // Shielding interference wave
  const wave = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.5, 16), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5}));
  wave.position.set(0.5, 0, 0); wave.rotation.y = Math.PI/2;
  
  heGroup.add(heElec1, heElec2, wave);
  group.add(heGroup);

  group.userData.animate = function(delta, time, speed) {
      hGroup.rotation.y = time * speed;
      heGroup.rotation.y = time * speed;
      heElec2.position.y = Math.sin(time*speed*5)*0.5;
  };

  return {
    group: group,
    description: "Shielding Effect in Helium. Shielding occurs when inner electrons block the nucleus from outer electrons. Helium has no inner electrons. However, electrons in the SAME shell still repel each other, causing a very minor shielding effect (S ≈ 0.3) known as 'imperfect shielding'.",
    parts: [
      { name: "Hydrogen (Left)", material: "Thick Green Line", function: "Experiences 100% of the nuclear pull (S = 0)." },
      { name: "Helium (Right)", material: "Interfering Waves", function: "The second electron gets in the way of the first, slightly dampening the pull from +2 down to +1.7." }
    ],
    quizQuestions: [
      { question: "How effective is the shielding between two electrons in the exact same orbital (like in Helium)?", options: ["100% effective", "It is imperfect and very weak, because they are at roughly the same average distance from the nucleus", "It creates a magnetic shield", "They don't shield at all"], correct: 1, explanation: "Electrons in the same orbital don't stay between each other and the nucleus very often. Because they are on the same 'floor' of the atom, their shielding effect on each other is weak (about 30% effective compared to a core electron)." }
    ]
  };
}