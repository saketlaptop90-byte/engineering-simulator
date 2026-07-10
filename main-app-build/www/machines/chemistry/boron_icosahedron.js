import * as THREE from 'three';
export function createBoronIcosahedron() {
  const group = new THREE.Group();
  
  // Advanced Boron B12 Icosahedron
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = 1.5;
  const b = a / phi;
  
  const vertices = [
      new THREE.Vector3(0, b, -a), new THREE.Vector3(b, a, 0), new THREE.Vector3(-b, a, 0),
      new THREE.Vector3(0, b, a), new THREE.Vector3(0, -b, a), new THREE.Vector3(-a, 0, b),
      new THREE.Vector3(0, -b, -a), new THREE.Vector3(a, 0, -b), new THREE.Vector3(a, 0, b),
      new THREE.Vector3(-a, 0, -b), new THREE.Vector3(b, -a, 0), new THREE.Vector3(-b, -a, 0)
  ];

  // High-end physical material for Boron atoms
  const atomMat = new THREE.MeshPhysicalMaterial({
      color: 0x00aaff,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x002244,
      emissiveIntensity: 0.5
  });

  const b12 = new THREE.Group();
  const atoms = [];
  
  // Add atoms
  vertices.forEach(v => {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), atomMat);
      atom.position.copy(v);
      b12.add(atom);
      atoms.push(atom);
  });

  // High-end glassy bonds
  const bondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      metalness: 0.5,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
      transparent: true
  });

  const edges = [];
  for(let i=0; i<vertices.length; i++) {
      for(let j=i+1; j<vertices.length; j++) {
          const dist = vertices[i].distanceTo(vertices[j]);
          // In an icosahedron, adjacent vertices are 2*b apart
          if (Math.abs(dist - 2*b) < 0.1) {
              const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 16), bondMat);
              const mid = new THREE.Vector3().addVectors(vertices[i], vertices[j]).multiplyScalar(0.5);
              edge.position.copy(mid);
              edge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(vertices[j], vertices[i]).normalize());
              b12.add(edge);
              edges.push(edge);
          }
      }
  }
  
  group.add(b12);

  // Inner quantum glow
  const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending})
  );
  b12.add(coreGlow);

  // Particle system floating around
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(300);
  for(let i=0; i<300; i++) {
      pPos[i] = (Math.random()-0.5)*6;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({color: 0x00ffff, size: 0.05, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending});
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  // Advanced lighting inside the group
  const light = new THREE.PointLight(0x00ffff, 2, 10);
  b12.add(light);

  group.userData.animate = function(delta, time, speed) {
      b12.rotation.y = time * speed * 0.3;
      b12.rotation.x = time * speed * 0.15;
      b12.rotation.z = Math.sin(time*speed*0.1)*0.2;
      
      coreGlow.scale.setScalar(1 + Math.sin(time*speed*4)*0.1);
      light.intensity = 2 + Math.sin(time*speed*4)*1;
      
      particles.rotation.y = -time * speed * 0.1;
      particles.rotation.x = time * speed * 0.05;
      
      // Jiggle atoms
      atoms.forEach((atom, i) => {
          const offset = i * 0.5;
          const orig = vertices[i];
          atom.position.x = orig.x + Math.sin(time*speed*3 + offset)*0.05;
          atom.position.y = orig.y + Math.cos(time*speed*4 + offset)*0.05;
          atom.position.z = orig.z + Math.sin(time*speed*5 + offset)*0.05;
      });
  };

  return {
    group: group,
    description: "The B12 Icosahedron (Boron's Masterpiece). Unlike metals that form simple cubes, or carbon which forms flat hexagons, Boron's 3 valence electrons force it to form one of the most mathematically complex fundamental structures in chemistry: the 12-atom Icosahedron. This geometric marvel is incredibly strong and hard, composed of 20 equilateral triangles. Almost all solid forms of Boron are just massive networks of these B12 icosahedra linked together!",
    parts: [
      { name: "Cyan Spheres (12)", material: "Boron Atoms", function: "Arranged perfectly to minimize electron repulsion." },
      { name: "Glassy Tubes", material: "Intra-icosahedral Bonds", function: "Strong covalent network holding the cage together." },
      { name: "Glowing Core", material: "Delocalized Electrons", function: "The electrons are shared throughout the entire cage, making it exceptionally stable." }
    ],
    quizQuestions: [
      { question: "Why does Boron form complex 12-atom cages instead of simple cubic structures like Iron or Aluminum?", options: ["Because it is radioactive", "Because its 3 valence electrons aren't enough to form a standard 3D metal lattice, forcing it into 'electron-deficient' multi-center bonding to achieve stability.", "Because 12 is a magic number", "Because it is a gas"], correct: 1, explanation: "Boron is 'electron-deficient'. It has 4 available orbitals (2s, 2px, 2py, 2pz) but only 3 valence electrons. To satisfy the octet rule, it has to get incredibly creative with geometry, sharing electrons across multiple atoms simultaneously in a cage." }
    ]
  };
}