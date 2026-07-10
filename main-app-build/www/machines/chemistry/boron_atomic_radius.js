import * as THREE from 'three';
export function createBoronAtomicRadius() {
  const group = new THREE.Group();
  
  // Radius of Boron = 87 picometers
  // Compared to Beryllium = 112 pm
  
  const bAtom = new THREE.Group();
  const bNuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})); bAtom.add(bNuc);
  const bCloud = new THREE.Mesh(new THREE.SphereGeometry(1.74, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3})); bAtom.add(bCloud);
  bAtom.position.set(-2, 0, 0);
  group.add(bAtom);
  
  const bText = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  bText.position.set(-2, -2.5, 0); group.add(bText); // "Boron: 87 pm"

  const beAtom = new THREE.Group();
  const beNuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})); beAtom.add(beNuc);
  const beCloud = new THREE.Mesh(new THREE.SphereGeometry(2.24, 32, 32), new THREE.MeshBasicMaterial({color: 0x88ccff, transparent: true, opacity: 0.3})); beAtom.add(beCloud);
  beAtom.position.set(2, 0, 0);
  group.add(beAtom);
  
  const beText = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0x88ccff}));
  beText.position.set(2, -2.5, 0); group.add(beText); // "Beryllium: 112 pm"

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2;
      
      bCloud.scale.setScalar(1 + Math.sin(time*speed*5)*0.02);
      beCloud.scale.setScalar(1 + Math.cos(time*speed*4)*0.02);
  };

  return {
    group: group,
    description: "Atomic Radius (Size). How big is a Boron atom? Its radius is 87 picometers. Notice how Boron (left) is significantly SMALLER than the element that came before it, Beryllium (right, 112 pm). Why do atoms get smaller as you add more particles? Because Boron has 5 protons pulling on the same 2nd electron shell, while Beryllium only has 4. The extra proton in Boron acts like a stronger magnet, pulling the entire electron cloud tighter towards the center!",
    parts: [
      { name: "Cyan Sphere", material: "Boron (87 pm)", function: "Pulled very tight by its 5 protons." },
      { name: "Blue Sphere", material: "Beryllium (112 pm)", function: "Looser, because it only has 4 protons pulling the same shell." }
    ],
    quizQuestions: [
      { question: "Why does Boron have a smaller radius than Beryllium, even though Boron has more protons and electrons?", options: ["Because it is colder", "Because the extra proton in the nucleus pulls the electron cloud in tighter (greater Effective Nuclear Charge)", "Because electrons eat each other", "Because Boron is a metal"], correct: 1, explanation: "As you move from left to right across a row on the periodic table, atoms actually shrink! The nucleus gets stronger (more protons), pulling the same shell of electrons closer." }
    ]
  };
}