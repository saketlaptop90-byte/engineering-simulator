import * as THREE from 'three';
export function createBoronCarbide() {
  const group = new THREE.Group();
  
  // Boron Carbide (B4C) - Bulletproof vest ceramic
  
  // Creates a B12 Icosahedron
  const createIco = (color) => {
      const b12 = new THREE.Group();
      const phi = (1 + Math.sqrt(5)) / 2;
      const a = 0.6;
      const b = a / phi;
      const vertices = [
          new THREE.Vector3(0, b, -a), new THREE.Vector3(b, a, 0), new THREE.Vector3(-b, a, 0),
          new THREE.Vector3(0, b, a), new THREE.Vector3(0, -b, a), new THREE.Vector3(-a, 0, b),
          new THREE.Vector3(0, -b, -a), new THREE.Vector3(a, 0, -b), new THREE.Vector3(a, 0, b),
          new THREE.Vector3(-a, 0, -b), new THREE.Vector3(b, -a, 0), new THREE.Vector3(-b, -a, 0)
      ];
      
      const atomMat = new THREE.MeshPhysicalMaterial({color: color, metalness: 0.7, roughness: 0.3, clearcoat: 0.8});
      const bondMat = new THREE.MeshBasicMaterial({color: 0x444444});
      
      vertices.forEach(v => {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), atomMat);
          atom.position.copy(v);
          b12.add(atom);
      });
      
      for(let i=0; i<vertices.length; i++) {
          for(let j=i+1; j<vertices.length; j++) {
              if (Math.abs(vertices[i].distanceTo(vertices[j]) - 2*b) < 0.1) {
                  const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2*b, 8), bondMat);
                  edge.position.copy(new THREE.Vector3().addVectors(vertices[i], vertices[j]).multiplyScalar(0.5));
                  edge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(vertices[j], vertices[i]).normalize());
                  b12.add(edge);
              }
          }
      }
      return b12;
  };
  
  // The lattice
  const cMat = new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.9, roughness: 0.1, clearcoat: 1.0});
  
  // 1. Center C-B-C chain
  const chain = new THREE.Group();
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), cMat); c1.position.set(0, 1.5, 0); chain.add(c1);
  const bCenter = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.7, roughness: 0.3})); bCenter.position.set(0, 0, 0); chain.add(bCenter);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), cMat); c2.position.set(0, -1.5, 0); chain.add(c2);
  
  const cBond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 16), new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.8, opacity: 1, transparent: true}));
  chain.add(cBond);
  group.add(chain);

  // 2. Surrounding B12 Icosahedra
  const positions = [
      new THREE.Vector3(3, 1.5, 0),
      new THREE.Vector3(-3, 1.5, 0),
      new THREE.Vector3(0, -1.5, 3),
      new THREE.Vector3(0, -1.5, -3)
  ];
  
  const linkMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transmission: 0.5, opacity: 1, transparent: true});
  
  positions.forEach(pos => {
      const ico = createIco(0x00aaff);
      ico.position.copy(pos);
      group.add(ico);
      
      // Link to chain ends
      const target = pos.y > 0 ? c1.position : c2.position;
      const dist = pos.distanceTo(target);
      const link = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, dist, 8), linkMat);
      link.position.copy(pos).add(target).multiplyScalar(0.5);
      link.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), target.clone().sub(pos).normalize());
      group.add(link);
  });
  
  // Ambient occlusion lighting
  const amb = new THREE.AmbientLight(0xffffff, 0.5);
  const dir = new THREE.DirectionalLight(0xffffff, 2);
  dir.position.set(5, 10, 5);
  group.add(amb, dir);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.1;
  };

  return {
    group: group,
    description: "Boron Carbide (B4C). This is one of the hardest materials known to humanity. It is used heavily in tank armor, bulletproof vests, and engine sabotage powders. Its structure is fascinating: It consists of rigid B12 Icosahedra (the blue cages) linked together by a straight chain of three atoms (Carbon-Boron-Carbon, the black and blue spheres in the center). This incredibly dense, cross-linked, 3D covalent lattice makes the material almost impenetrable.",
    parts: [
      { name: "Blue Cages", material: "B12 Icosahedra", function: "The ultra-rigid structural foundation." },
      { name: "Black/Blue Chain", material: "C-B-C Link", function: "Tying the cages together with immense strength." }
    ],
    quizQuestions: [
      { question: "Why is Boron Carbide used in bulletproof vests and tank armor?", options: ["Because it is very heavy", "Because its highly cross-linked 3D covalent lattice makes it one of the hardest ceramics in the world", "Because it is magnetic and deflects bullets", "Because it is soft and absorbs impact"], correct: 1, explanation: "Materials with continuous 3D covalent networks (like Diamond, Boron Carbide, and Silicon Carbide) are exceptionally hard because breaking them requires breaking millions of actual chemical bonds, not just separating molecules." }
    ]
  };
}