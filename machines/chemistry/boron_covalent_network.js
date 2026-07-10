import * as THREE from 'three';
export function createBoronCovalentNetwork() {
  const group = new THREE.Group();
  
  // Alpha-Rhombohedral Boron Lattice (Multiple B12 Icosahedra linked)
  
  const createIcosahedron = () => {
      const b12 = new THREE.Group();
      const phi = (1 + Math.sqrt(5)) / 2;
      const a = 0.8;
      const b = a / phi;
      const vertices = [
          new THREE.Vector3(0, b, -a), new THREE.Vector3(b, a, 0), new THREE.Vector3(-b, a, 0),
          new THREE.Vector3(0, b, a), new THREE.Vector3(0, -b, a), new THREE.Vector3(-a, 0, b),
          new THREE.Vector3(0, -b, -a), new THREE.Vector3(a, 0, -b), new THREE.Vector3(a, 0, b),
          new THREE.Vector3(-a, 0, -b), new THREE.Vector3(b, -a, 0), new THREE.Vector3(-b, -a, 0)
      ];
      
      const atomMat = new THREE.MeshPhysicalMaterial({color: 0x0088ff, metalness: 0.8, roughness: 0.2, clearcoat: 1.0});
      const bondMat = new THREE.MeshBasicMaterial({color: 0x444444});
      
      vertices.forEach(v => {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), atomMat);
          atom.position.copy(v);
          b12.add(atom);
      });
      
      for(let i=0; i<vertices.length; i++) {
          for(let j=i+1; j<vertices.length; j++) {
              const dist = vertices[i].distanceTo(vertices[j]);
              if (Math.abs(dist - 2*b) < 0.1) {
                  const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, dist, 8), bondMat);
                  edge.position.copy(new THREE.Vector3().addVectors(vertices[i], vertices[j]).multiplyScalar(0.5));
                  edge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(vertices[j], vertices[i]).normalize());
                  b12.add(edge);
              }
          }
      }
      return b12;
  };

  const lattice = new THREE.Group();
  
  // Center
  const i1 = createIcosahedron();
  lattice.add(i1);
  
  // Surrounding linked Icosahedra
  const positions = [
      new THREE.Vector3(3, 1.5, 0),
      new THREE.Vector3(-3, -1.5, 0),
      new THREE.Vector3(0, 3, 2),
      new THREE.Vector3(0, -3, -2)
  ];
  
  const extBondMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, emissive: 0x440044, metalness: 0.8, roughness: 0.2});
  
  positions.forEach(pos => {
      const iCluster = createIcosahedron();
      iCluster.position.copy(pos);
      lattice.add(iCluster);
      
      // Draw inter-icosahedral bond
      const dist = pos.length();
      const extBond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 16), extBondMat);
      extBond.position.copy(pos).multiplyScalar(0.5);
      extBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pos.clone().normalize());
      lattice.add(extBond);
  });
  
  group.add(lattice);

  // Depth of field / fog effect via point lights
  const light1 = new THREE.PointLight(0x00ffff, 1, 10); light1.position.set(5, 5, 5); group.add(light1);
  const light2 = new THREE.PointLight(0xff00ff, 1, 10); light2.position.set(-5, -5, -5); group.add(light2);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
      
      // Gentle breathing of the lattice
      const scale = 1 + Math.sin(time*speed*2)*0.02;
      lattice.scale.setScalar(scale);
  };

  return {
    group: group,
    description: "Macroscopic Covalent Network (Alpha-Rhombohedral Boron). How does Boron form a solid chunk of metal/crystal? It links its B12 Icosahedra together! The grey bonds inside the cages hold the 12 atoms together, but the thick magenta bonds physically connect the cages to each other. This vast, infinite 3D network of covalent bonds is what gives Boron its extreme hardness (9.3 on the Mohs scale, just below diamond) and its insanely high melting point.",
    parts: [
      { name: "Blue Cages", material: "B12 Icosahedra", function: "The fundamental building block of solid Boron." },
      { name: "Grey Links", material: "Intra-cluster Bonds", function: "Holding the 12 atoms together." },
      { name: "Magenta Links", material: "Inter-cluster Bonds", function: "Locking the individual cages into an unbreakable macroscopic crystal lattice." }
    ],
    quizQuestions: [
      { question: "Why is solid Boron almost as hard as a Diamond?", options: ["Because it is cold", "Because it is held together entirely by a continuous 3D network of incredibly strong covalent bonds, rather than weak metallic or intermolecular forces", "Because the atoms are heavy", "Because it has no electrons"], correct: 1, explanation: "Just like Carbon in a diamond, Boron forms a 'Covalent Network Solid'. Every single atom is firmly bonded to its neighbors in a massive, unbreakable 3D grid." }
    ]
  };
}