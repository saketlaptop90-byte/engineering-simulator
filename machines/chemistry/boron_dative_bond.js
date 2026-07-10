import * as THREE from 'three';
export function createBoronDativeBond() {
  const group = new THREE.Group();
  
  // BF3 - NH3 Adduct (The Dative / Coordinate Bond)
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.5, roughness: 0.2}); // Nitrogen
  const fMat = new THREE.MeshPhysicalMaterial({color: 0xffff00, metalness: 0.2, roughness: 0.5}); // Fluorine
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const createSphere = (mat, radius) => new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
  
  // Left: Boron Trifluoride (BF3) - Lewis Acid (Electron Acceptor)
  const bf3 = new THREE.Group();
  const bAtom = createSphere(bMat, 0.4);
  bf3.add(bAtom);
  for(let i=0; i<3; i++) {
      const angle = i * Math.PI * 2 / 3;
      const fPos = new THREE.Vector3(Math.cos(angle)*1.5, Math.sin(angle)*1.5, 0); // Flat in XY plane originally
      const fAtom = createSphere(fMat, 0.35);
      fAtom.position.copy(fPos);
      bf3.add(fAtom);
      
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), bondMat);
      bond.position.copy(fPos).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), fPos.clone().normalize());
      bf3.add(bond);
  }
  bf3.position.set(-2.5, 0, 0);
  bf3.rotation.y = Math.PI/2; // face right
  group.add(bf3);
  
  // Empty p-orbital on Boron (The glowing trap)
  const emptyOrbital = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.6, 2, 32),
      new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending})
  );
  emptyOrbital.rotation.x = Math.PI/2;
  emptyOrbital.position.z = 1; // pointing right
  bf3.add(emptyOrbital);

  // Right: Ammonia (NH3) - Lewis Base (Electron Donor)
  const nh3 = new THREE.Group();
  const nAtom = createSphere(nMat, 0.4);
  nh3.add(nAtom);
  for(let i=0; i<3; i++) {
      const angle = i * Math.PI * 2 / 3;
      const hPos = new THREE.Vector3(Math.cos(angle)*1.0, Math.sin(angle)*1.0, 1.0); // Pyramidal
      const hAtom = createSphere(hMat, 0.25);
      hAtom.position.copy(hPos);
      nh3.add(hAtom);
      
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, hPos.length(), 16), bondMat);
      bond.position.copy(hPos).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hPos.clone().normalize());
      nh3.add(bond);
  }
  nh3.position.set(2.5, 0, 0);
  nh3.rotation.y = -Math.PI/2; // face left
  group.add(nh3);

  // The Lone Pair on Nitrogen (The donors)
  const lonePair = new THREE.Group();
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e1.position.set(-0.2, 0, 0.8);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e2.position.set(0.2, 0, 0.8);
  lonePair.add(e1, e2);
  
  // A glowing trail connecting them (The Dative Bond forming)
  const dativeBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.1, 3, 16),
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending})
  );
  dativeBeam.rotation.z = Math.PI/2;
  dativeBeam.position.x = -1.5;
  group.add(dativeBeam);
  
  nh3.add(lonePair);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      const cycle = (time * speed) % 4;
      
      if (cycle < 2) {
          // Approach
          const t = cycle / 2; // 0 to 1
          bf3.position.x = -2.5 + t*1.5;
          nh3.position.x = 2.5 - t*1.5;
          
          // Geometry shift: BF3 goes from planar to tetrahedral as it accepts electrons
          bf3.children.forEach((c, idx) => {
              if (idx > 0 && idx < 7 && idx%2!==0) { // the F atoms (1,3,5)
                 c.position.z = -t * 0.8; // push back like an umbrella in the wind
                 // update bonds (2,4,6)
                 const bond = bf3.children[idx+1];
                 const dist = c.position.length();
                 bond.geometry = new THREE.CylinderGeometry(0.08, 0.08, dist, 16);
                 bond.position.copy(c.position).multiplyScalar(0.5);
                 bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), c.position.clone().normalize());
              }
          });
          
          // Beam grows
          dativeBeam.scale.y = t;
          dativeBeam.position.x = nh3.position.x - 0.8 - (t*3)/2;
          dativeBeam.material.opacity = t * 0.8;
      } else {
          // Attached
          bf3.position.x = -1.0;
          nh3.position.x = 1.0;
          dativeBeam.scale.y = 1;
          dativeBeam.material.opacity = 0.8 + Math.sin(time*speed*10)*0.2; // pulse
      }
  };

  return {
    group: group,
    description: "The Dative Bond (Coordinate Covalent). Boron Trifluoride (BF3) is a 'Lewis Acid'. Because Boron only has 3 valence electrons, it forms 3 bonds and is left with an empty, starving 'p-orbital' (the magenta cone). Ammonia (NH3) is a 'Lewis Base'. It has a full pair of electrons (the cyan dots) that it isn't using for bonding. When they meet, Nitrogen shoves both of its extra electrons into Boron's empty pocket! Normally in a bond, each atom shares 1 electron. Here, Nitrogen provides BOTH electrons. This is called a Dative (or Coordinate) bond!",
    parts: [
      { name: "Magenta Cone", material: "Empty p-orbital", function: "Boron desperately wants 2 more electrons to complete its octet." },
      { name: "Cyan Dots", material: "Nitrogen's Lone Pair", function: "Two electrons sitting around doing nothing." },
      { name: "Glowing Cyan Beam", material: "Dative Bond", function: "Nitrogen donating BOTH electrons to form a complete bond with Boron." }
    ],
    quizQuestions: [
      { question: "What makes a 'Dative Bond' different from a regular covalent bond?", options: ["It is magnetic", "In a normal bond each atom shares 1 electron. In a dative bond, one atom donates BOTH of the electrons to make the bond!", "It only happens in water", "It repels electrons"], correct: 1, explanation: "Nitrogen acts as a 'sugar daddy' here, providing all the electrons necessary to form the bond, satisfying Boron's empty orbital." }
    ]
  };
}