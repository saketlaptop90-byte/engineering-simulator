import * as THREE from 'three';
export function createBoronNitrideNanotube() {
  const group = new THREE.Group();
  
  // BNNT (Boron Nitride Nanotube) - Structural analog to Carbon Nanotubes
  
  const radius = 2.0;
  const length = 8.0;
  const segments = 12; // Circumference
  const rings = 10;    // Length
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.8, roughness: 0.2}); // Boron (Blue)
  const nMat = new THREE.MeshPhysicalMaterial({color: 0xff0044, metalness: 0.8, roughness: 0.2}); // Nitrogen (Red)
  const bondMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1});
  
  const tubeGrp = new THREE.Group();
  
  const getPos = (i, j) => {
      // Hexagonal wrapping math
      const angle = (i / segments) * Math.PI * 2;
      const y = (j - rings/2) * 0.8;
      // Stagger rows for hex pattern
      const offsetAngle = (j % 2 === 0) ? 0 : (Math.PI * 2 / segments / 2);
      
      return new THREE.Vector3(
          Math.cos(angle + offsetAngle) * radius,
          y,
          Math.sin(angle + offsetAngle) * radius
      );
  };
  
  const atoms = [];
  
  // Generate atoms
  for(let j=0; j<rings; j++) {
      for(let i=0; i<segments; i++) {
          const pos = getPos(i, j);
          // Alternate B and N
          const isBoron = (i + j) % 2 === 0;
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), isBoron ? bMat : nMat);
          atom.position.copy(pos);
          tubeGrp.add(atom);
          atoms.push({pos, mesh: atom, isBoron, r: j, c: i});
      }
  }
  
  // Draw bonds
  for(let j=0; j<rings-1; j++) {
      for(let i=0; i<segments; i++) {
          const a1 = atoms.find(a => a.r === j && a.c === i);
          
          // Connect right
          const rightC = (i + 1) % segments;
          const aRight = atoms.find(a => a.r === j && a.c === rightC);
          
          // Connect up-left or up-right depending on row
          const upC = (j % 2 === 0) ? i : (i + 1) % segments;
          const aUp = atoms.find(a => a.r === j+1 && a.c === upC);
          
          const drawBond = (p1, p2) => {
              const dist = p1.distanceTo(p2);
              const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
              bond.position.copy(p1).add(p2).multiplyScalar(0.5);
              bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
              tubeGrp.add(bond);
          };
          
          if(a1 && aRight) drawBond(a1.pos, aRight.pos);
          if(a1 && aUp) drawBond(a1.pos, aUp.pos);
      }
  }
  
  // Tilt the tube
  tubeGrp.rotation.z = Math.PI/4;
  tubeGrp.rotation.x = 0.2;
  group.add(tubeGrp);

  // A bright light passing through the center of the tube
  const photon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
  const light = new THREE.PointLight(0x00ffff, 3, 10);
  photon.add(light);
  group.add(photon);

  group.userData.animate = function(delta, time, speed) {
      tubeGrp.rotation.y = time * speed * 0.2;
      
      // Shoot photon through the tube
      const cycle = (time * speed * 0.5) % 2; // 0 to 2
      const t = cycle - 1; // -1 to 1
      
      // Calculate position along the tilted tube's local Y axis
      const lengthMax = 5;
      const localY = t * lengthMax;
      
      // Convert local Y to world position
      const worldPos = new THREE.Vector3(0, localY, 0);
      worldPos.applyEuler(tubeGrp.rotation);
      photon.position.copy(worldPos);
  };

  return {
    group: group,
    description: "Boron Nitride Nanotubes (BNNT). You have probably heard of Carbon Nanotubes, the strongest material ever discovered. But Boron and Nitrogen (which sit directly to the left and right of Carbon on the periodic table) can combine to form an identical structure! BNNTs are hexagonal lattices rolled into a seamless cylinder. While Carbon nanotubes are black and conduct electricity, BNNTs are optically transparent (glassy), electrically insulating, and can withstand significantly higher temperatures (up to 900°C in air) before burning!",
    parts: [
      { name: "Blue Spheres", material: "Boron Atoms", function: "Donating 3 valence electrons." },
      { name: "Red Spheres", material: "Nitrogen Atoms", function: "Donating 5 valence electrons (averaging 4, exactly like Carbon)." },
      { name: "Glassy Cylinder", material: "Nanotube Structure", function: "Stronger than steel, transparent to visible light, and highly heat-resistant." }
    ],
    quizQuestions: [
      { question: "Why do Boron (Element 5) and Nitrogen (Element 7) form structures that look exactly like Carbon (Element 6)?", options: ["Because they are the same color", "Because Boron has 3 valence electrons and Nitrogen has 5. If you average them together, you get 4 valence electrons per atom—which is exactly what Carbon has!", "Because gravity shapes them", "Because they are magnetic"], correct: 1, explanation: "This is called being 'Isoelectronic'. B+N mimics C+C. This allows Boron Nitride to form nanotubes and even a diamond-like structure (Cubic Boron Nitride) that is almost as hard as real diamond!" }
    ]
  };
}