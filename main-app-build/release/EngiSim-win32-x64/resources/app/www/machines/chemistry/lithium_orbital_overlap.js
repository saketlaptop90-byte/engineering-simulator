import * as THREE from 'three';
export function createLithiumOrbitalOverlap() {
  const group = new THREE.Group();
  
  // Orbital Overlap (Sigma Bond) (Remastered)
  
  // Atom A (Left)
  const atomA = new THREE.Group();
  const nucA = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const orbA = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.4, wireframe: true})
  );
  const orbAFill = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.1, transmission: 0.9})
  );
  atomA.add(nucA, orbA, orbAFill);
  atomA.position.x = -6;
  group.add(atomA);
  
  // Atom B (Right)
  const atomB = new THREE.Group();
  const nucB = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const orbB = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.4, wireframe: true})
  );
  const orbBFill = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.1, transmission: 0.9})
  );
  atomB.add(nucB, orbB, orbBFill);
  atomB.position.x = 6;
  group.add(atomB);
  
  // The Overlap Region (Sigma Bond)
  const overlap = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.0, emissive: 0xffffff, emissiveIntensity: 0.5})
  );
  overlap.scale.x = 0.5; // flatten it into a lens shape
  group.add(overlap);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 2) {
          // Atoms approach each other
          const t = cycle / 2; // 0 to 1
          const dist = 6 - (t * 4); // x from 6 to 2
          atomA.position.x = -dist;
          atomB.position.x = dist;
          
          // Overlap materializes
          if (dist < 4) {
              const overlapAmount = (4 - dist) / 2; // 0 to 1
              overlap.material.opacity = overlapAmount * 0.8;
              overlap.scale.set(0.5 + overlapAmount, 1 + overlapAmount*0.5, 1 + overlapAmount*0.5);
              // Squash the original spheres slightly to show deformation
              orbA.scale.x = 1 - (overlapAmount * 0.2);
              orbB.scale.x = 1 - (overlapAmount * 0.2);
          } else {
              overlap.material.opacity = 0;
              orbA.scale.x = 1;
              orbB.scale.x = 1;
          }
      } else {
          // Break apart
          const t = (cycle - 2) / 2;
          const dist = 2 + (t * 4);
          atomA.position.x = -dist;
          atomB.position.x = dist;
          
          if (dist < 4) {
              const overlapAmount = (4 - dist) / 2;
              overlap.material.opacity = overlapAmount * 0.8;
              overlap.scale.set(0.5 + overlapAmount, 1 + overlapAmount*0.5, 1 + overlapAmount*0.5);
              orbA.scale.x = 1 - (overlapAmount * 0.2);
              orbB.scale.x = 1 - (overlapAmount * 0.2);
          } else {
              overlap.material.opacity = 0;
              orbA.scale.x = 1;
              orbB.scale.x = 1;
          }
      }
  };

  return {
    group: group,
    description: "Orbital Overlap (Remastered). How do two atoms physically bond together? According to Valence Bond Theory, a chemical bond is formed when the probability clouds (orbitals) of two atoms physically smash into each other and overlap! In this model, two Lithium atoms approach each other. As their spherical 2s orbitals touch, they mathematically merge in the center to create a super-dense region of probability (the glowing white lens). This is called a 'Sigma Bond' (σ-bond). Because the electrons now spend most of their time in this overlapping region, their negative charge acts like a glue, pulling both positive nuclei together!",
    parts: [
      { name: "Cyan/Magenta Spheres", material: "Atomic Orbitals", function: "The original 2s probability clouds." },
      { name: "Glowing White Center", material: "Sigma Bond Overlap", function: "The shared region of electron probability that glues the atoms together." }
    ],
    quizQuestions: [
      { question: "What physically constitutes a chemical bond in Valence Bond Theory?", options: ["A solid string connecting the atoms", "The physical overlapping and merging of the atoms' electron probability clouds.", "Magnetism", "Gravity"], correct: 1, explanation: "By sharing the same space, the electrons form a dense cloud of negative glue between the positive nuclei!" }
    ]
  };
}