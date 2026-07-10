import * as THREE from 'three';
export function createLithiumOrbitalHybridization() {
  const group = new THREE.Group();
  
  // Orbital Hybridization (sp) (Remastered)
  
  // We'll morph an s-orbital and a p-orbital into two sp-hybrid orbitals
  
  const hMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6, wireframe: true, transmission: 0.8});
  
  // Center nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  // Orbital A (starts as s-sphere)
  const orbA = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), hMat);
  group.add(orbA);
  
  // Orbital B (starts as p-dumbbell)
  const orbB = new THREE.Group();
  const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), hMat); lobe1.position.x = 1.2; lobe1.scale.x = 1.5;
  const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), hMat); lobe2.position.x = -1.2; lobe2.scale.x = 1.5;
  orbB.add(lobe1, lobe2);
  group.add(orbB);
  
  // Hybrid sp orbitals (hidden at first)
  const spGroup = new THREE.Group();
  const spMat1 = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.8, wireframe: true});
  const spMat2 = new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.8, wireframe: true});
  
  const createSP = (mat, rot) => {
      const g = new THREE.Group();
      // An sp hybrid has one massive lobe and one tiny tail lobe
      const mainLobe = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), mat);
      mainLobe.position.x = 1.5; mainLobe.scale.x = 1.5;
      const tailLobe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat);
      tailLobe.position.x = -0.5;
      g.add(mainLobe, tailLobe);
      g.rotation.z = rot;
      return g;
  };
  
  const sp1 = createSP(spMat1, 0); // Points right
  const sp2 = createSP(spMat2, Math.PI); // Points left
  spGroup.add(sp1, sp2);
  spGroup.visible = false;
  group.add(spGroup);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      const cycle = (time * speed * 0.3) % 4;
      
      if (cycle < 1) {
          // Show separated s and p
          orbA.visible = true;
          orbB.visible = true;
          spGroup.visible = false;
          
          orbA.scale.setScalar(1);
          orbA.material.opacity = 0.6;
          orbB.scale.setScalar(1);
          orbB.children[0].material.opacity = 0.6;
          
      } else if (cycle < 2) {
          // Morphing! They mathematically combine
          const t = cycle - 1; // 0 to 1
          
          // The s and p orbitals fade out and shrink
          orbA.material.opacity = 0.6 * (1 - t);
          orbA.scale.setScalar(1 - t);
          orbB.children[0].material.opacity = 0.6 * (1 - t);
          orbB.children[1].material.opacity = 0.6 * (1 - t);
          orbB.scale.setScalar(1 - t);
          
          // The hybrids fade in
          spGroup.visible = true;
          sp1.children[0].material.opacity = 0.8 * t;
          sp1.children[1].material.opacity = 0.8 * t;
          sp2.children[0].material.opacity = 0.8 * t;
          sp2.children[1].material.opacity = 0.8 * t;
          spGroup.scale.setScalar(t);
          
      } else if (cycle < 3) {
          // Fully hybridized
          orbA.visible = false;
          orbB.visible = false;
          spGroup.visible = true;
          spGroup.scale.setScalar(1);
          
      } else {
          // Revert back
          const t = cycle - 3; // 0 to 1
          orbA.visible = true;
          orbB.visible = true;
          
          orbA.material.opacity = 0.6 * t;
          orbA.scale.setScalar(t);
          orbB.children[0].material.opacity = 0.6 * t;
          orbB.children[1].material.opacity = 0.6 * t;
          orbB.scale.setScalar(t);
          
          sp1.children[0].material.opacity = 0.8 * (1 - t);
          sp1.children[1].material.opacity = 0.8 * (1 - t);
          sp2.children[0].material.opacity = 0.8 * (1 - t);
          sp2.children[1].material.opacity = 0.8 * (1 - t);
          spGroup.scale.setScalar(1 - t);
      }
  };

  return {
    group: group,
    description: "Orbital Hybridization (Remastered). When atoms form complex molecules, their standard 's' (sphere) and 'p' (dumbbell) orbitals often aren't the right shape to form strong bonds. To fix this, the atom mathematically averages its wave functions together to create brand new shapes! This is called 'Hybridization'. In this animation, one spherical 's' orbital mixes with one dumbbell 'p' orbital. The result? Two brand new 'sp' hybrid orbitals (colored Green and Magenta)! Because the wave functions cancel out on one side and add up on the other, the hybrid orbitals look like lopsided bowling pins, pointing exactly 180 degrees away from each other to form a perfect linear bond!",
    parts: [
      { name: "Cyan Sphere & Dumbbell", material: "Standard s & p Orbitals", function: "The original atomic orbitals." },
      { name: "Green/Magenta Lopsided Shapes", material: "sp Hybrid Orbitals", function: "The mathematically averaged probability clouds used for bonding." }
    ],
    quizQuestions: [
      { question: "Why do atomic orbitals 'hybridize'?", options: ["To change colors", "To mathematically combine their wave functions into new shapes that are better optimized for bonding with other atoms.", "To shrink the atom", "To explode"], correct: 1, explanation: "By hybridizing, the atom can point its probability clouds exactly where it needs them to form strong, directional bonds!" }
    ]
  };
}