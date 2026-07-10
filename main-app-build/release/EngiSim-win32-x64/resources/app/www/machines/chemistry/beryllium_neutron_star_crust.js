import * as THREE from 'three';
export function createBerylliumNeutronStar() {
  const group = new THREE.Group();
  
  // Extreme gravity environment
  
  // A hyper-dense layer of crushed atoms (Nuclear Pasta)
  const crust = new THREE.Group();
  
  // Flattened Beryllium atoms (crushed by gravity)
  for(let x=-2; x<=2; x+=1) {
      for(let z=-2; z<=2; z+=1) {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({color: 0x88ccff, metalness: 0.9}));
          atom.scale.set(1, 0.2, 1); // CRUSHED flat
          atom.position.set(x, 0, z);
          crust.add(atom);
      }
  }
  group.add(crust);

  // Immense gravity arrows
  for(let i=-2; i<=2; i+=2) {
      const a = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(i, 3, 0), 2.5, 0xff00ff, 0.5, 0.5);
      group.add(a);
  }

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      // Violent trembling under the extreme pressure
      crust.position.y = (Math.random()-0.5)*0.05;
      crust.position.x = (Math.random()-0.5)*0.05;
  };

  return {
    group: group,
    description: "Neutron Star Crust. If you placed a block of Beryllium on the surface of a Neutron Star, the gravity is 100 billion times stronger than Earth. The space between the nucleus and the electrons is completely crushed out of existence. The Beryllium atoms are flattened into a 2D sheet of ultra-dense matter sometimes called 'Nuclear Pasta'. The electrons are eventually forced completely into the nucleus, merging with the protons to turn the entire atom into pure neutrons.",
    parts: [
      { name: "Pancake Spheres", material: "Crushed Beryllium", function: "The electron clouds have collapsed." },
      { name: "Magenta Arrows", material: "Extreme Gravity", function: "100 Billion Gs of downward force." }
    ],
    quizQuestions: [
      { question: "What happens to the empty space inside a Beryllium atom when it is crushed by a Neutron star?", options: ["It gets bigger", "It fills with air", "The gravity is so strong that the electrons are forced into the nucleus, destroying the empty space and collapsing the atom", "Nothing happens"], correct: 2, explanation: "Atoms are 99.9999% empty space. Neutron stars have enough gravity to overcome the Pauli Exclusion Principle, crushing the electrons down into the protons to form a solid ball of neutrons with zero empty space." }
    ]
  };
}