import * as THREE from 'three';
export function createBoronPhosphide() {
  const group = new THREE.Group();
  
  // Boron Phosphide (BP) - Diamond-like zincblende structure
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.6, roughness: 0.1, clearcoat: 1.0}); // Boron
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff8800, metalness: 0.6, roughness: 0.1, clearcoat: 1.0}); // Phosphorus (Orange)
  const bondMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 1.0, roughness: 0.1, transmission: 0.5, opacity: 1, transparent: true}); // Glassy bonds
  
  // Create a 2x2x2 zincblende unit cell
  // Face Centered Cubic (FCC) of one atom, with the other occupying half the tetrahedral holes
  
  const atoms = [];
  const size = 3;
  
  // Place Phosphorus (Orange) at FCC positions
  const fcc = [
      [0,0,0], [size,0,0], [0,size,0], [size,size,0],
      [0,0,size], [size,0,size], [0,size,size], [size,size,size],
      [size/2,size/2,0], [size/2,size/2,size],
      [size/2,0,size/2], [size/2,size,size/2],
      [0,size/2,size/2], [size,size/2,size/2]
  ];
  
  fcc.forEach(pos => {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat);
      atom.position.set(pos[0]-size/2, pos[1]-size/2, pos[2]-size/2);
      group.add(atom);
      atoms.push({mesh: atom, isP: true});
  });
  
  // Place Boron (Cyan) in alternating tetrahedral holes
  const holes = [
      [size/4, size/4, size/4],
      [size*3/4, size*3/4, size/4],
      [size*3/4, size/4, size*3/4],
      [size/4, size*3/4, size*3/4]
  ];
  
  holes.forEach(pos => {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), bMat);
      atom.position.set(pos[0]-size/2, pos[1]-size/2, pos[2]-size/2);
      group.add(atom);
      atoms.push({mesh: atom, isP: false});
  });
  
  // Create diamond-like rigid bonds
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].mesh.position.distanceTo(atoms[j].mesh.position);
          if (dist > 1.0 && dist < 1.4) { // Specific bond length for the holes to FCC
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 16), bondMat);
              b.position.copy(atoms[i].mesh.position).add(atoms[j].mesh.position).multiplyScalar(0.5);
              b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].mesh.position.clone().sub(atoms[i].mesh.position).normalize());
              group.add(b);
          }
      }
  }

  // Intense shiny lighting to show it's a hard refractory crystal
  const dir = new THREE.DirectionalLight(0xffffff, 3);
  dir.position.set(5,10,5);
  const point = new THREE.PointLight(0xffffff, 2, 20);
  point.position.set(-5, -5, 5);
  
  group.add(dir, point, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.3;
      group.rotation.z = Math.cos(time*speed*0.1)*0.2;
  };

  return {
    group: group,
    description: "Boron Phosphide (BP). An incredibly hard, highly refractory semiconductor material! It crystallizes in the exact same structure as Diamond (the Zincblende lattice). Instead of pure carbon, it alternates between Boron (cyan) and Phosphorus (orange). Because of this perfectly rigid, repeating 3D tetrahedral network, Boron Phosphide is almost as hard as diamond and has exceptionally high thermal conductivity, making it perfect for high-power lasers and advanced electronics.",
    parts: [
      { name: "Cyan Spheres", material: "Boron Atoms", function: "Alternating in the diamond lattice." },
      { name: "Orange Spheres", material: "Phosphorus Atoms", function: "Alternating in the diamond lattice." },
      { name: "Rigid Glassy Bonds", material: "Covalent Network", function: "The ultra-strong structural scaffolding that makes it diamond-hard." }
    ],
    quizQuestions: [
      { question: "Why is Boron Phosphide (BP) structurally compared to Diamond?", options: ["Because it is transparent", "Because it crystallizes in the exact same rigid 3D tetrahedral network (Zincblende structure) as diamond, making it incredibly hard.", "Because it costs the same", "Because Phosphorus is made of carbon"], correct: 1, explanation: "Diamond is pure Carbon. Boron has 3 valence electrons and Phosphorus has 5. Averaged out, they have 4 (just like Carbon!), allowing them to form the exact same hyper-rigid crystal structures!" }
    ]
  };
}