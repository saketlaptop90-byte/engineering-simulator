import * as THREE from 'three';
export function createBoronTrifluoride() {
  const group = new THREE.Group();
  
  // BF3 - Trigonal Planar with an EMPTY p-orbital
  
  const bAtom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}));
  group.add(bAtom);
  
  const fMat = new THREE.MeshPhysicalMaterial({color: 0x00ff00, metalness: 0.2, roughness: 0.4});
  
  const fAtoms = [];
  for(let i=0; i<3; i++) {
      const angle = i * Math.PI * 2 / 3;
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), fMat);
      f.position.set(Math.cos(angle)*2.5, 0, Math.sin(angle)*2.5);
      fAtoms.push(f);
      group.add(f);
      
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2, 16), new THREE.MeshBasicMaterial({color: 0x888888}));
      bond.position.set(Math.cos(angle)*1.25, 0, Math.sin(angle)*1.25);
      bond.rotation.y = -angle;
      bond.rotation.z = Math.PI/2;
      group.add(bond);
      
      // Fluorine lone pairs (faint green clouds)
      const lp = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending}));
      lp.position.copy(f.position).multiplyScalar(1.2);
      group.add(lp);
  }

  // Boron's EMPTY p-orbital (perpendicular to the plane)
  const pOrbital = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.1, side: THREE.DoubleSide});
  
  const lobeTop = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 1.5, 32, 32), pMat);
  lobeTop.position.y = 1.2;
  const lobeBot = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 1.5, 32, 32), pMat);
  lobeBot.position.y = -1.2;
  
  pOrbital.add(lobeTop, lobeBot);
  group.add(pOrbital);

  // Pi backbonding particles (Electrons flowing from F into the empty B orbital)
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(90); // 30 per F atom
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMatPoints = new THREE.PointsMaterial({color: 0x00ff00, size: 0.08, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending});
  const particles = new THREE.Points(pGeo, pMatPoints);
  group.add(particles);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.5 + Math.sin(time*speed*0.2)*0.2;
      group.rotation.y = time * speed * 0.3;
      
      // Pulse the empty p-orbital (it is hungry for electrons)
      pOrbital.scale.setScalar(1 + Math.sin(time*speed*3)*0.05);
      
      // Animate Pi Backbonding (Green electrons flowing from Fluorine into the Magenta p-orbital)
      const positions = particles.geometry.attributes.position.array;
      for(let i=0; i<3; i++) {
          const fPos = fAtoms[i].position;
          for(let j=0; j<10; j++) {
              const idx = (i*10 + j)*3;
              // Progress 0 to 1
              const prog = ((time * speed * 2) + (j/10)) % 1;
              
              // Flow from F to Top/Bot lobes
              const targetY = j % 2 === 0 ? 1.5 : -1.5;
              const target = new THREE.Vector3(0, targetY, 0);
              
              const current = new THREE.Vector3().lerpVectors(fPos, target, prog);
              // Add arc
              current.y += Math.sin(prog * Math.PI) * (targetY > 0 ? 0.5 : -0.5);
              
              positions[idx] = current.x;
              positions[idx+1] = current.y;
              positions[idx+2] = current.z;
          }
      }
      particles.geometry.attributes.position.needsUpdate = true;
  };

  return {
    group: group,
    description: "Boron Trifluoride (BF3) & Pi Backbonding. Boron bonds with 3 Fluorine atoms, forming a perfectly flat triangle (Trigonal Planar). But wait... Boron only has 6 electrons in its outer shell now (3 of its own + 3 shared from Fluorine). It violates the Octet Rule! It is 'hungry' for 2 more electrons. This leaves a massive, empty 'p-orbital' sticking straight up and down (the magenta glass lobes). To help stabilize Boron, the Fluorine atoms actually leak some of their own electron density into this empty orbital, a fascinating quantum effect called 'Pi Backbonding' (the flowing green particles).",
    parts: [
      { name: "Cyan Sphere", material: "Boron Atom", function: "Electron deficient (only 6 valence electrons)." },
      { name: "Magenta Glass Lobes", material: "Empty p-orbital", function: "A vacuum waiting to accept an electron pair." },
      { name: "Flowing Green Dots", material: "Pi Backbonding", function: "Fluorine 'donating' a tiny bit of its electron cloud to pacify Boron's empty orbital." }
    ],
    quizQuestions: [
      { question: "Why does Boron Trifluoride (BF3) act as a strong 'Lewis Acid' (an electron pair acceptor)?", options: ["Because it tastes sour", "Because it has a massive, completely empty p-orbital that is desperate to accept a pair of electrons to fulfill the octet rule", "Because it has too many electrons", "Because Fluorine is acidic"], correct: 1, explanation: "A Lewis Acid is defined as anything that can ACCEPT an electron pair. BF3's empty magenta p-orbital makes it one of the most famous and useful Lewis Acids in organic chemistry!" }
    ]
  };
}