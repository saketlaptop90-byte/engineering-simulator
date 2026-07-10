import * as THREE from 'three';
export function createSodiumPerborate() {
  const group = new THREE.Group();
  
  // Sodium Perborate Dimer [B2O4(OH)4]2- (Laundry Bleach)
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.5}); // Oxygen
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const naMat = new THREE.MeshPhysicalMaterial({color: 0xffff00, metalness: 0.8, roughness: 0.3}); // Sodium
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const createSphere = (mat, radius, x,y,z) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
      s.position.set(x,y,z);
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
  
  // The central 6-membered ring (2 Borons, 4 Oxygens forming two O-O peroxo bridges)
  const b1 = createSphere(bMat, 0.4, -1.5, 0, 0);
  const b2 = createSphere(bMat, 0.4, 1.5, 0, 0);
  
  // Top peroxo bridge
  const o1 = createSphere(oMat, 0.35, -0.5, 1, 0.5);
  const o2 = createSphere(oMat, 0.35, 0.5, 1, -0.5);
  createBond(b1, o1); createBond(o1, o2); createBond(o2, b2);
  
  // Bottom peroxo bridge
  const o3 = createSphere(oMat, 0.35, -0.5, -1, -0.5);
  const o4 = createSphere(oMat, 0.35, 0.5, -1, 0.5);
  createBond(b1, o3); createBond(o3, o4); createBond(o4, b2);
  
  // OH groups on Boron 1
  const oh1_o = createSphere(oMat, 0.35, -2.5, 1, 0); const oh1_h = createSphere(hMat, 0.2, -3, 1.5, 0); createBond(b1, oh1_o); createBond(oh1_o, oh1_h);
  const oh2_o = createSphere(oMat, 0.35, -2.5, -1, 0); const oh2_h = createSphere(hMat, 0.2, -3, -1.5, 0); createBond(b1, oh2_o); createBond(oh2_o, oh2_h);
  
  // OH groups on Boron 2
  const oh3_o = createSphere(oMat, 0.35, 2.5, 1, 0); const oh3_h = createSphere(hMat, 0.2, 3, 1.5, 0); createBond(b2, oh3_o); createBond(oh3_o, oh3_h);
  const oh4_o = createSphere(oMat, 0.35, 2.5, -1, 0); const oh4_h = createSphere(hMat, 0.2, 3, -1.5, 0); createBond(b2, oh4_o); createBond(oh4_o, oh4_h);
  
  // Sodium spectator ions
  const na1 = createSphere(naMat, 0.6, 0, 3, 0);
  const na2 = createSphere(naMat, 0.6, 0, -3, 0);
  
  // Bleach action visualization (O-O bonds breaking and releasing active oxygen)
  const glow = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending})
  );
  group.add(glow);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Simulate bleaching action (releasing active oxygen)
      glow.scale.setScalar(1 + Math.sin(time*speed*3)*0.1);
      glow.material.opacity = 0.1 + Math.sin(time*speed*3)*0.1;
      
      na1.position.y = 3 + Math.sin(time*speed*2)*0.5;
      na2.position.y = -3 - Math.cos(time*speed*2)*0.5;
  };

  return {
    group: group,
    description: "Sodium Perborate Dimer. If you use 'OxiClean' or color-safe bleach in your laundry, you are using Sodium Perborate! This molecule is famous for its unique 'Peroxo Bridges'. Look at the center of the molecule: there are two Oxygen atoms bonded directly to each other (O-O) bridging the two Boron atoms. This Oxygen-Oxygen bond is highly unstable! In hot washing machine water, the Boron releases these oxygens as 'Active Oxygen', which safely attacks and destroys clothing stains without damaging the fabric dyes.",
    parts: [
      { name: "Cyan Spheres", material: "Boron Atoms", function: "The structural anchors holding the molecule together." },
      { name: "Red O-O Chains", material: "Peroxo Bridges", function: "The highly reactive 'Active Oxygen' that bleaches clothes." },
      { name: "Yellow Spheres", material: "Sodium Ions", function: "Counter ions keeping the powder stable." }
    ],
    quizQuestions: [
      { question: "How does Sodium Perborate act as a 'color-safe' bleach in laundry detergent?", options: ["It paints the clothes white", "The Boron holds onto highly reactive 'Peroxo' (O-O) bridges. In water, it releases this 'Active Oxygen', which destroys stain molecules but is gentle enough not to destroy fabric dyes.", "It uses chlorine to burn the stains", "It makes the water colder"], correct: 1, explanation: "Unlike harsh Chlorine bleach, Boron-based bleaches slowly release oxygen radicals. This targeted oxidation destroys the double bonds in stain molecules without harming your clothes!" }
    ]
  };
}