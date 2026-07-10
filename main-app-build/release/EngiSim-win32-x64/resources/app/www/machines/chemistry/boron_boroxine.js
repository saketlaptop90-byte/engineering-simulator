import * as THREE from 'three';
export function createBoroxine() {
  const group = new THREE.Group();
  
  // Boroxine (B3O3H3) - Flat Hexagonal Ring
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.5}); // Oxygen
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const atoms = [];
  const radius = 2.0;
  
  // Create alternating B and O ring
  for(let i=0; i<6; i++) {
      const angle = i * Math.PI / 3;
      const isBoron = (i % 2 === 0);
      
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), isBoron ? bMat : oMat);
      const pos = new THREE.Vector3(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
      atom.position.copy(pos);
      group.add(atom);
      atoms.push({pos, isBoron});
      
      // Boron gets a Hydrogen, Oxygen gets nothing
      if (isBoron) {
          const hRadius = radius + 1.2;
          const hPos = new THREE.Vector3(Math.cos(angle)*hRadius, 0, Math.sin(angle)*hRadius);
          const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), hMat);
          hAtom.position.copy(hPos);
          group.add(hAtom);
          
          const ohDist = pos.distanceTo(hPos);
          const ohBond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, ohDist, 16), bondMat);
          ohBond.position.copy(pos).add(hPos).multiplyScalar(0.5);
          ohBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hPos.clone().sub(pos).normalize());
          group.add(ohBond);
      }
  }
  
  // Connect the ring bonds
  for(let i=0; i<6; i++) {
      const p1 = atoms[i].pos;
      const p2 = atoms[(i+1)%6].pos;
      const dist = p1.distanceTo(p2);
      
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 16), bondMat);
      bond.position.copy(p1).add(p2).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
      group.add(bond);
  }
  
  // Green flame aura (Boroxines burn extremely well)
  const flame = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, wireframe: true})
  );
  group.add(flame);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,10,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.3;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.3;
      
      flame.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      flame.rotation.y = -time * speed * 0.5;
  };

  return {
    group: group,
    description: "Boroxine (B3O3H3). Another famous structural analog in Boron chemistry! Just like Borazine (Boron-Nitrogen) mimics the Carbon Benzene ring, Boroxine mimics it using alternating Boron and Oxygen atoms! Because Oxygen is highly electronegative (greedy for electrons) and Boron is electron-deficient, the Oxygen atoms constantly donate their lone pairs into Boron's empty p-orbitals, creating a surprisingly stable, perfectly flat hexagonal ring. Many Boroxine derivatives are highly flammable and burn with Boron's signature bright green flame!",
    parts: [
      { name: "Cyan Spheres", material: "Boron Atoms", function: "Electron-deficient acceptors." },
      { name: "Red Spheres", material: "Oxygen Atoms", function: "Electron-rich donors." },
      { name: "Green Wireframe", material: "Combustion Aura", function: "Burns with a bright green flame." }
    ],
    quizQuestions: [
      { question: "Why is the Boroxine ring perfectly flat, even though Boron usually prefers 3D structures?", options: ["Because gravity pulls it down", "Because Oxygen donates its extra electrons into Boron's empty p-orbitals, creating a 'delocalized' electron cloud that locks the ring into a rigid, flat geometry.", "Because the Hydrogen atoms pull it flat", "Because it is liquid"], correct: 1, explanation: "This is called 'aromaticity' (or pseudo-aromaticity). The sharing of electrons in a continuous loop forces the molecule to adopt a perfectly flat, planar shape for maximum stability!" }
    ]
  };
}