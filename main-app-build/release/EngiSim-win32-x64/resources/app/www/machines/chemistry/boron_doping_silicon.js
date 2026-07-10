import * as THREE from 'three';
export function createPTypeDoping() {
  const group = new THREE.Group();
  
  // P-Type Semiconductor Doping (Boron in Silicon)
  
  const siMat = new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 0.8, roughness: 0.2, transmission: 0.5, transparent: true}); // Silicon
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2, emissive: 0x0044aa}); // Boron
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
  
  const size = 3;
  const atoms = [];
  const grid = new THREE.Group();
  
  // 3x3x3 Silicon grid
  for(let x=-1; x<=1; x++) {
      for(let y=-1; y<=1; y++) {
          for(let z=-1; z<=1; z++) {
              let mat = siMat;
              let isBoron = false;
              
              // Inject one Boron atom perfectly in the center
              if (x===0 && y===0 && z===0) {
                  mat = bMat;
                  isBoron = true;
              }
              
              const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), mat);
              const pos = new THREE.Vector3(x*size, y*size, z*size);
              atom.position.copy(pos);
              grid.add(atom);
              atoms.push({pos, isBoron, mesh: atom, index: atoms.length});
          }
      }
  }
  
  // Create the bonds
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].pos.distanceTo(atoms[j].pos);
          if (dist === size) {
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
              b.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
              b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
              grid.add(b);
          }
      }
  }
  group.add(grid);
  
  // The "Hole" (Positive charge created by Boron missing an electron)
  const hole = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending})
  );
  group.add(hole);
  
  // An Electron (Cyan dot) jumping in to fill the hole
  const electron = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({color: 0x00ffff})
  );
  group.add(electron);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));
  
  // Find adjacent atoms to the center (Boron)
  const centerIdx = 13; // Middle of 3x3x3 (0 to 26)
  const adj = [4, 10, 12, 14, 16, 22]; // up, down, left, right, front, back

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.1 + 0.2;
      
      const cycle = (time * speed * 0.8) % 4;
      
      // Phase 1: Hole is on Boron. Electron from a neighboring Silicon sees the hole.
      // Phase 2: Electron jumps to Boron to fill the hole.
      // Phase 3: The hole is now on the Silicon atom!
      
      const targetSi = adj[Math.floor((time * speed * 0.8)/4) % adj.length]; // pick a neighbor
      const siPos = atoms[targetSi].pos;
      const bPos = atoms[centerIdx].pos;
      
      if (cycle < 1) {
          // Hole on Boron
          hole.position.copy(bPos);
          hole.scale.setScalar(1 + Math.sin(cycle*Math.PI*4)*0.1);
          electron.position.copy(siPos);
      } else if (cycle < 2) {
          // Electron jumps from Si to Boron
          const t = cycle - 1; // 0 to 1
          electron.position.copy(siPos).lerp(bPos, t);
          hole.material.opacity = 0.8 * (1 - t); // hole disappears as it gets filled
      } else if (cycle < 3) {
          // Hole appears on Silicon! (Because it lost its electron)
          electron.position.copy(bPos);
          hole.position.copy(siPos);
          hole.material.opacity = 0.8;
          hole.scale.setScalar(1 + Math.sin(cycle*Math.PI*4)*0.1);
      } else {
          // Hole moves further away (simulating electricity flowing)
          const t = cycle - 3;
          electron.position.copy(bPos);
          hole.position.copy(siPos).add(new THREE.Vector3(0, t*2, 0)); // drifts away
          hole.material.opacity = 0.8 * (1 - t);
      }
  };

  return {
    group: group,
    description: "P-Type Semiconductor Doping. This is how modern computers are made! Silicon (the grey atoms) has 4 valence electrons, forming a perfect, locked 3D grid. It does not conduct electricity. To make a microchip, engineers inject a tiny amount of Boron (the cyan atom). Boron only has 3 electrons! When it slots into the grid, it is missing a bond. This creates an empty, positively charged 'Hole' (the magenta glow). A neighboring electron (cyan dot) will instantly hop over to fill the hole, but in doing so, it leaves a NEW hole behind! This cascading effect allows electricity to flow through the solid crystal!",
    parts: [
      { name: "Grey Grid", material: "Silicon Crystal", function: "The locked, non-conductive framework." },
      { name: "Cyan Atom", material: "Boron Dopant", function: "Injected to purposefully break the perfect grid by missing one electron." },
      { name: "Magenta Glow", material: "The 'Hole'", function: "A positive void that pulls electrons towards it, allowing current to flow." }
    ],
    quizQuestions: [
      { question: "Why is injecting Boron into Silicon called creating a 'P-Type' (Positive-Type) semiconductor?", options: ["Because it makes people happy", "Because Boron is missing an electron compared to Silicon, creating an empty, positively-charged 'hole' that pulls other electrons toward it to conduct electricity.", "Because it adds a proton", "Because Boron is a metal"], correct: 1, explanation: "P-Type means 'Positive'. N-Type means 'Negative' (like Phosphorus, which has an extra electron). By combining P-Type and N-Type silicon, engineers created the Transistor!" }
    ]
  };
}