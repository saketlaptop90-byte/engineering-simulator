import * as THREE from 'three';
export function createBoronElectronegativity() {
  const group = new THREE.Group();
  
  // Boron (2.04) pulling against Fluorine (3.98)
  
  // Boron Atom
  const bAtom = new THREE.Group();
  bAtom.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0x88ccff})));
  const bText = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0x88ccff})); bText.position.y = -1; bAtom.add(bText); // "Boron: 2.04"
  bAtom.position.set(-2, 0, 0);
  group.add(bAtom);

  // Fluorine Atom (Much stronger)
  const fAtom = new THREE.Group();
  fAtom.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff})));
  const fText = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xff00ff})); fText.position.y = -1; fAtom.add(fText); // "Fluorine: 3.98"
  fAtom.position.set(2, 0, 0);
  group.add(fAtom);

  // Shared Electron Pair (Pulled towards Fluorine)
  const eGrp = new THREE.Group();
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff})); e1.position.y = 0.2; eGrp.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff})); e2.position.y = -0.2; eGrp.add(e2);
  group.add(eGrp);

  // Bond line
  const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), new THREE.MeshBasicMaterial({color: 0x555555}));
  bond.rotation.z = Math.PI/2;
  group.add(bond);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.3)*0.2;
      group.rotation.x = Math.sin(time*speed*0.2)*0.1;
      
      // Fluorine dominates the tug-of-war
      // Electron pair is pulled to the right
      eGrp.position.x = 1.0 + Math.sin(time*speed*5)*0.1;
      eGrp.rotation.x = time * speed * 2;
  };

  return {
    group: group,
    description: "Electronegativity. Electronegativity is an atom's 'greed' for electrons in a chemical bond. On the Pauling scale, Boron has an electronegativity of 2.04. This is right in the middle! It's greedier than metals like Lithium (0.98), but nowhere near as greedy as non-metals like Fluorine (3.98). In a bond between Boron and Fluorine, the Fluorine atom is so much stronger that it yanks the shared electrons far closer to itself, creating a 'Polar' bond.",
    parts: [
      { name: "Cyan Sphere", material: "Boron (2.04)", function: "Moderate pulling strength." },
      { name: "Magenta Sphere", material: "Fluorine (3.98)", function: "The most electronegative (greediest) element on the periodic table." },
      { name: "White Dots", material: "Shared Electrons", function: "Hogged by the Fluorine atom." }
    ],
    quizQuestions: [
      { question: "Because Fluorine hogs the negative electrons, what electrical charge does the Boron atom end up with in this bond?", options: ["It becomes fully negative", "It gets a 'Partial Positive' charge because its electrons are being pulled away", "It remains perfectly neutral", "It explodes"], correct: 1, explanation: "This is called a Dipole! Because the negative electrons are pulled towards Fluorine, the Boron side is left slightly exposed and positive." }
    ]
  };
}