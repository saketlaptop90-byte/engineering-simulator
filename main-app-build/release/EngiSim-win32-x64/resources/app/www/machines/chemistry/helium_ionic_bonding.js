import * as THREE from 'three';
export function createHeliumIonicBonding() {
  const group = new THREE.Group();
  
  // Fluorine (Most electronegative element) trying to steal an electron
  const fGroup = new THREE.Group();
  fGroup.position.set(-2, 0, 0);
  const fCloud = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  fGroup.add(fCloud, new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  group.add(fGroup);

  // Helium
  const heGroup = new THREE.Group();
  heGroup.position.set(2, 0, 0);
  const heCloud = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.8}));
  heGroup.add(heCloud, new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  const heElec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  heGroup.add(heElec);
  group.add(heGroup);

  // Tug of war force line
  const rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.5, 0, 0), new THREE.Vector3(1.5, 0, 0)]), new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 3}));
  group.add(rope);

  group.userData.animate = function(delta, time, speed) {
      heElec.position.set(-0.8, 0, 0); // Pulled slightly but holding on
      
      const pull = Math.sin(time*speed*5)*0.1;
      rope.position.x = pull;
      fGroup.position.x = -2 + pull;
  };

  return {
    group: group,
    description: "Ionic Bonding & Ionization Energy. Ionic bonds require one atom to steal an electron from another. Fluorine is the ultimate electron thief. But even Fluorine cannot steal an electron from Helium! Helium has the highest Ionization Energy (2372 kJ/mol) in the universe.",
    parts: [
      { name: "Fluorine (Green)", material: "Highest Electronegativity", function: "Pulling violently on Helium's electrons." },
      { name: "Helium (Cyan)", material: "Highest Ionization Energy", function: "Its +2 nucleus holds the 1s electrons so tightly that nothing can steal them." },
      { name: "Red Rope", material: "Tug-of-War", function: "Helium always wins, preventing ionic bond formation." }
    ],
    quizQuestions: [
      { question: "Why is it practically impossible for Helium to form an Ionic bond, even with Fluorine?", options: ["Helium is invisible", "Helium has the highest ionization energy of any element, meaning it takes too much energy to steal its electrons", "Helium has no electrons to steal", "Fluorine doesn't want electrons"], correct: 1, explanation: "An ionic bond requires one atom to lose an electron. Helium's electrons are so close to its +2 nucleus that the energy required to rip one away (Ionization Energy) is the highest in the entire universe." }
    ]
  };
}