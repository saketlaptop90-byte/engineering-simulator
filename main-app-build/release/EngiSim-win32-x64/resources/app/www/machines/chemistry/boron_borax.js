import * as THREE from 'three';
export function createBoronBorax() {
  const group = new THREE.Group();
  
  // Borax Anion [B4O5(OH)4]2-
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2, clearcoat: 1.0}); // Boron
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.5}); // Oxygen
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const createSphere = (x, y, z, mat, radius = 0.4) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
      s.position.set(x, y, z);
      group.add(s);
      return s;
  };
  
  const createBond = (s1, s2) => {
      const dist = s1.position.distanceTo(s2.position);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 16), bondMat);
      b.position.copy(s1.position).add(s2.position).multiplyScalar(0.5);
      b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), s2.position.clone().sub(s1.position).normalize());
      group.add(b);
  };
  
  // The central ring structure (2 tetrahedral B, 2 trigonal planar B)
  const oCenter = createSphere(0, 0, 0, oMat, 0.4);
  
  // Tetrahedral Borons (B1, B2)
  const b1 = createSphere(-1.5, 0, 1.5, bMat);
  const b2 = createSphere(1.5, 0, 1.5, bMat);
  
  // Trigonal Planar Borons (B3, B4)
  const b3 = createSphere(-2.5, 0, -1.5, bMat);
  const b4 = createSphere(2.5, 0, -1.5, bMat);
  
  // Bridging Oxygens
  const o1 = createSphere(-2.0, 0, 0, oMat);
  const o2 = createSphere(2.0, 0, 0, oMat);
  const o3 = createSphere(0, 0, 2.5, oMat); // Front bridge
  const o4 = createSphere(0, 0, -2.5, oMat); // Back bridge
  
  // Connect bridges
  createBond(b1, oCenter); createBond(b2, oCenter);
  createBond(b1, o1); createBond(b3, o1);
  createBond(b2, o2); createBond(b4, o2);
  createBond(b1, o3); createBond(b2, o3);
  createBond(b3, o4); createBond(b4, o4);
  
  // OH Groups (4 of them, one on each Boron)
  const oh1_o = createSphere(-2, 1.5, 2, oMat); const oh1_h = createSphere(-2.5, 2, 2.5, hMat, 0.2); createBond(b1, oh1_o); createBond(oh1_o, oh1_h);
  const oh2_o = createSphere(2, 1.5, 2, oMat);  const oh2_h = createSphere(2.5, 2, 2.5, hMat, 0.2); createBond(b2, oh2_o); createBond(oh2_o, oh2_h);
  const oh3_o = createSphere(-4, 0, -2, oMat);  const oh3_h = createSphere(-5, 0, -2.5, hMat, 0.2); createBond(b3, oh3_o); createBond(oh3_o, oh3_h);
  const oh4_o = createSphere(4, 0, -2, oMat);   const oh4_h = createSphere(5, 0, -2.5, hMat, 0.2); createBond(b4, oh4_o); createBond(oh4_o, oh4_h);

  // Sparkles (it's a crystal/detergent)
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(50 * 3);
  for(let i=0; i<50; i++) {
      pPos[i*3] = (Math.random()-0.5)*10;
      pPos[i*3+1] = (Math.random()-0.5)*10;
      pPos[i*3+2] = (Math.random()-0.5)*10;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const sparkles = new THREE.Points(pGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending}));
  group.add(sparkles);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(5,10,5);
  group.add(dirLight);
  group.add(new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      sparkles.rotation.y = -time * speed * 0.1;
      // twinkle
      sparkles.material.opacity = 0.5 + Math.sin(time*speed*10)*0.5;
  };

  return {
    group: group,
    description: "Borax [B4O5(OH)4]²⁻. Borax (Sodium tetraborate) is one of the most famous and useful boron compounds, widely used in laundry detergents, cosmetics, and enamel glazes. The structure shown here is the core Borax anion. Notice how it contains 4 Boron atoms (cyan), but they aren't identical! Two of the Boron atoms are bonded to 4 things (Tetrahedral geometry), while the other two are only bonded to 3 things (Trigonal Planar geometry). This mixed geometry is a hallmark of boron chemistry.",
    parts: [
      { name: "Cyan Spheres", material: "Boron Atoms", function: "Displaying two different geometric shapes in the same molecule." },
      { name: "Red Spheres", material: "Oxygen Atoms", function: "Bridging the Borons together." },
      { name: "White Dots", material: "Hydrogen Atoms", function: "Forming the outer Hydroxide (OH) groups." }
    ],
    quizQuestions: [
      { question: "What is unique about the geometry of the 4 Boron atoms in the Borax anion?", options: ["They are all perfectly square", "They are all trigonal planar", "Two of them are tetrahedral (bonded to 4 atoms) and two are trigonal planar (bonded to 3 atoms)", "They are all in a straight line"], correct: 2, explanation: "Boron is incredibly versatile. In this single molecule, it utilizes both of its primary bonding geometries to create the stable ring structure." }
    ]
  };
}