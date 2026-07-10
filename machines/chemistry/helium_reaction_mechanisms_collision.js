import * as THREE from 'three';
export function createHeliumReactionMechanismsCollision() {
  const group = new THREE.Group();
  
  // High energy collision
  const atom1 = new THREE.Group();
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6})));
  
  const atom2 = new THREE.Group();
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6})));
  
  group.add(atom1, atom2);

  // Shockwave ring
  const shock = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.2, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  shock.rotation.y = Math.PI/2;
  group.add(shock);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed * 2) % 3;
      
      if(cycle < 1) {
          // Approaching fast
          atom1.position.set(-3 + cycle*2, 0, 0);
          atom2.position.set(3 - cycle*2, 0, 0);
          shock.material.opacity = 0;
      } else if (cycle < 1.2) {
          // Collision!
          atom1.position.set(-1, 0, 0);
          atom2.position.set(1, 0, 0);
          // Compress clouds slightly
          atom1.scale.set(0.8, 1.2, 1.2);
          atom2.scale.set(0.8, 1.2, 1.2);
          
          shock.material.opacity = 1;
          shock.geometry = new THREE.RingGeometry(0.5 + (cycle-1)*10, 0.6 + (cycle-1)*10, 32);
      } else {
          // Bouncing away cleanly, NO REACTION
          atom1.scale.set(1,1,1);
          atom2.scale.set(1,1,1);
          const t = cycle - 1.2;
          atom1.position.set(-1 - t*3, 0, 0);
          atom2.position.set(1 + t*3, 0, 0);
          shock.material.opacity = Math.max(0, 1 - t*2);
          shock.geometry = new THREE.RingGeometry(2.5 + t*5, 2.6 + t*5, 32);
      }
  };

  return {
    group: group,
    description: "Reaction Mechanisms (Elastic Collision). In most elements, a high-energy collision can overcome activation energy, forcing electrons to rearrange and create a new chemical bond. When two Helium atoms smash into each other at high speed, they perfectly bounce off each other (an elastic collision) with absolutely zero chemistry taking place.",
    parts: [
      { name: "Cyan Spheres", material: "Helium Atoms", function: "Full 1s shells act like impenetrable armor." },
      { name: "White Shockwave", material: "Kinetic Energy", function: "The energy is cleanly transferred as motion, not chemical change." }
    ],
    quizQuestions: [
      { question: "What happens when two Helium atoms collide with very high kinetic energy?", options: ["They fuse into Beryllium", "They form a covalent H-H bond", "They bounce off each other perfectly (elastic collision) with no chemical reaction", "They shatter into protons and electrons"], correct: 2, explanation: "Because their valence shells are perfectly full and stable, they will not share or trade electrons upon impact. They simply bounce, which is why Helium gas behaves so closely to an 'Ideal Gas' in physics." }
    ]
  };
}