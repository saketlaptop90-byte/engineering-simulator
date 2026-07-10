import * as THREE from 'three';
export function createBoronSuboxide() {
  const group = new THREE.Group();
  
  // Boron Suboxide (B6O) - Superhard Icosahedral Material
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.6, roughness: 0.2, clearcoat: 1.0}); // Boron
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.2, emissive: 0x440000}); // Oxygen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x555555});
  
  const createIco = (x, y, z) => {
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
      
      vertices.forEach(v => {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), bMat);
          atom.position.copy(v);
          b12.add(atom);
      });
      
      for(let i=0; i<vertices.length; i++) {
          for(let j=i+1; j<vertices.length; j++) {
              if (Math.abs(vertices[i].distanceTo(vertices[j]) - 2*b) < 0.1) {
                  const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2*b, 8), bondMat);
                  edge.position.copy(new THREE.Vector3().addVectors(vertices[i], vertices[j]).multiplyScalar(0.5));
                  edge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(vertices[j], vertices[i]).normalize());
                  b12.add(edge);
              }
          }
      }
      b12.position.set(x,y,z);
      group.add(b12);
      return b12;
  };
  
  // To keep it simple but beautiful, we show two B12 icosahedra linked by Oxygen atoms
  const ico1 = createIco(-2.5, 0, 0);
  const ico2 = createIco(2.5, 0, 0);
  
  // In B6O, there are 2 oxygen atoms in the interstitial spaces linking them
  const o1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), oMat); o1.position.set(-0.6, 1, 0); group.add(o1);
  const o2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), oMat); o2.position.set(0.6, -1, 0); group.add(o2);
  
  const createCrossBond = (p1, p2) => {
      const dist = p1.distanceTo(p2);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      b.position.copy(p1).add(p2).multiplyScalar(0.5);
      b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
      group.add(b);
  };
  
  // Link them (approximate visual representation of the rigid cross-linking)
  createCrossBond(new THREE.Vector3(-1.5, 0.5, 0), o1.position);
  createCrossBond(new THREE.Vector3(1.5, 0.5, 0), o1.position);
  
  createCrossBond(new THREE.Vector3(-1.5, -0.5, 0), o2.position);
  createCrossBond(new THREE.Vector3(1.5, -0.5, 0), o2.position);
  
  // Add a diamond-like sparkle to the whole group
  const sparkle = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.1, transmission: 0.9, clearcoat: 1.0, side: THREE.DoubleSide})
  );
  group.add(sparkle);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 10, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.8));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
  };

  return {
    group: group,
    description: "Boron Suboxide (B6O). This is a 'Superhard' ceramic material, used as an abrasive and in cutting tools. It is created by taking the famous B12 Icosahedron cages and violently packing them together under extreme pressure. To prevent the cages from crushing, Oxygen atoms (the red spheres) are squeezed into the tiny gaps between the cages. These Oxygen atoms act as rigid structural bridges, locking the entire 3D lattice together to create a material almost as hard as diamond!",
    parts: [
      { name: "Cyan Cages", material: "B12 Icosahedra", function: "The ultra-rigid building blocks." },
      { name: "Red Spheres", material: "Interstitial Oxygen", function: "Acting as structural mortar to cement the cages together." }
    ],
    quizQuestions: [
      { question: "Why are the Oxygen atoms in Boron Suboxide so important for its hardness?", options: ["They make the material flammable", "They act as rigid structural bridges, filling the tiny gaps between the B12 cages and cross-linking them into an unbreakable 3D lattice.", "They make the material breathable", "They are magnetic"], correct: 1, explanation: "In materials science, the hardest materials have continuous 3D covalent networks. By cross-linking the boron cages with oxygen bonds, the lattice becomes almost impossible to compress or scratch!" }
    ]
  };
}