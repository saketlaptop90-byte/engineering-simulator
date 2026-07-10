import * as THREE from 'three';
export function createBorosilicateGlass() {
  const group = new THREE.Group();
  
  // Borosilicate Glass (Pyrex) - Amorphous network with thermal shock resistance
  
  const siMat = new THREE.MeshPhysicalMaterial({color: 0x8888ff, metalness: 0.1, roughness: 0.1, transmission: 0.8, transparent: true}); // Silicon (light blue)
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.1, roughness: 0.5}); // Oxygen (red)
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2, emissive: 0x0044aa}); // Boron (cyan, slightly glowing to highlight it)
  const bondMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.5}); // Glassy bonds
  
  // Generate a chaotic, amorphous network
  const atoms = [];
  
  const addAtom = (mat, isB, isSi) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(isSi ? 0.35 : (isB ? 0.3 : 0.25), 16, 16), mat);
      // Random position in a sphere
      const u = Math.random(); const v = Math.random();
      const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.random() * 3.5;
      mesh.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
      
      // Store original position for thermal shaking
      atoms.push({mesh, origPos: mesh.position.clone(), isB, isSi});
      group.add(mesh);
  };
  
  // Add Silicon (Tetrahedral nodes)
  for(let i=0; i<15; i++) addAtom(siMat, false, true);
  // Add Boron (Trigonal nodes - the shock absorbers!)
  for(let i=0; i<8; i++) addAtom(bMat, true, false);
  // Add Oxygen (Bridging atoms)
  for(let i=0; i<40; i++) addAtom(oMat, false, false);
  
  // Procedurally connect them based on proximity to simulate an amorphous network
  for(let i=0; i<atoms.length; i++) {
      let bonds = 0;
      const maxBonds = atoms[i].isB ? 3 : (atoms[i].isSi ? 4 : 2); // B=3, Si=4, O=2
      
      for(let j=0; j<atoms.length; j++) {
          if (i===j) continue;
          if (bonds >= maxBonds) break;
          
          // Oxygen mostly bridges Si and B, so prioritize bonding O to Si/B
          if ((atoms[i].isSi || atoms[i].isB) && (atoms[j].isSi || atoms[j].isB)) continue; // Try not to bond Si directly to Si
          
          const dist = atoms[i].origPos.distanceTo(atoms[j].origPos);
          if (dist < 1.8) {
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
              b.position.copy(atoms[i].origPos).add(atoms[j].origPos).multiplyScalar(0.5);
              b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].origPos.clone().sub(atoms[i].origPos).normalize());
              group.add(b);
              bonds++;
          }
      }
  }

  // Thermal Shock visualizer (Red pulsing light)
  const heatLight = new THREE.PointLight(0xff0000, 0, 10);
  group.add(heatLight);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Simulate Thermal Shock cycle
      const cycle = (time * speed * 0.5) % 4;
      
      let heat = 0;
      if (cycle > 1 && cycle < 2) heat = (cycle - 1); // heating up
      else if (cycle >= 2 && cycle < 3) heat = 1; // max heat
      else if (cycle >= 3 && cycle < 4) heat = 1 - (cycle - 3); // cooling down
      
      heatLight.intensity = heat * 10;
      
      // Jitter the atoms to simulate thermal kinetic energy
      atoms.forEach(a => {
          // Normal glass shatters because expanding Si-O bonds break.
          // Boron acts like a flexible spring (trigonal geometry absorbs stress)
          const jitterAmt = heat * (a.isB ? 0.02 : 0.08); // Boron jitters less, absorbing the shock
          a.mesh.position.set(
              a.origPos.x + (Math.random()-0.5)*jitterAmt,
              a.origPos.y + (Math.random()-0.5)*jitterAmt,
              a.origPos.z + (Math.random()-0.5)*jitterAmt
          );
      });
  };

  return {
    group: group,
    description: "Borosilicate Glass (Pyrex). Normal glass (pure Silicon Dioxide) is very rigid. If you pour boiling water into a cold glass cup, it instantly shatters! This is called 'Thermal Shock'. To prevent this in scientific laboratories and kitchens (like Pyrex baking dishes), chemists add Boron to the glass. Normal Silicon atoms form rigid 4-bond tetrahedral shapes. Boron forms flat 3-bond trigonal shapes. These flat 3-bond Boron atoms act like flexible 'shock absorbers' inside the chaotic glass network, allowing the glass to expand and contract from extreme heat without breaking!",
    parts: [
      { name: "Light Blue Spheres", material: "Silicon (Si)", function: "Rigid 4-bond tetrahedral nodes." },
      { name: "Cyan Spheres", material: "Boron (B)", function: "Flexible 3-bond trigonal nodes (the shock absorbers)." },
      { name: "Red Spheres", material: "Oxygen (O)", function: "Bridging the network together." }
    ],
    quizQuestions: [
      { question: "Why does adding Boron to glass (creating Borosilicate Glass) prevent it from shattering when heated?", options: ["Because Boron is cold", "Because Boron's flat 3-bond geometry acts like a flexible shock absorber inside the rigid 4-bond silicon network, allowing the glass to expand without snapping.", "Because it makes the glass softer than water", "Because it makes the glass completely immune to heat transfer"], correct: 1, explanation: "By interrupting the rigid 3D silicon network with flat, 2D Boron joints, the glass gains exactly enough microscopic flexibility to survive sudden temperature changes!" }
    ]
  };
}