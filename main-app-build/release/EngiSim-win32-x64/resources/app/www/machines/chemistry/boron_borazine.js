import * as THREE from 'three';
export function createBoronBorazine() {
  const group = new THREE.Group();
  
  // Borazine (B3N3H6) - "Inorganic Benzene"
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.5, roughness: 0.2}); // Nitrogen
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const atoms = [];
  const radius = 2.0;
  
  // Create alternating B and N ring
  for(let i=0; i<6; i++) {
      const angle = i * Math.PI / 3;
      const isBoron = (i % 2 === 0);
      
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), isBoron ? bMat : nMat);
      const pos = new THREE.Vector3(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
      atom.position.copy(pos);
      group.add(atom);
      atoms.push({pos, isBoron});
      
      // Add a Hydrogen pointing outwards
      const hRadius = radius + 1.2;
      const hPos = new THREE.Vector3(Math.cos(angle)*hRadius, 0, Math.sin(angle)*hRadius);
      const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), hMat);
      hAtom.position.copy(hPos);
      group.add(hAtom);
      
      // Bond to Hydrogen
      const ohDist = pos.distanceTo(hPos);
      const ohBond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, ohDist, 16), bondMat);
      ohBond.position.copy(pos).add(hPos).multiplyScalar(0.5);
      ohBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hPos.clone().sub(pos).normalize());
      group.add(ohBond);
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
  
  // The Pi Electron Cloud (Delocalized electrons floating above and below the ring)
  const piCloudMat = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending});
  
  const topCloud = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.4, 16, 64), piCloudMat);
  topCloud.rotation.x = Math.PI/2;
  topCloud.position.y = 0.8;
  group.add(topCloud);
  
  const botCloud = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.4, 16, 64), piCloudMat);
  botCloud.rotation.x = Math.PI/2;
  botCloud.position.y = -0.8;
  group.add(botCloud);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,10,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.3;
      group.rotation.x = 0.4 + Math.sin(time*speed*0.1)*0.2;
      
      // Pulsate the pi clouds
      topCloud.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      botCloud.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      topCloud.material.opacity = 0.3 + Math.sin(time*speed*8)*0.1;
      botCloud.material.opacity = 0.3 + Math.cos(time*speed*8)*0.1;
  };

  return {
    group: group,
    description: "Borazine (B3N3H6) - 'Inorganic Benzene'. This molecule is a structural marvel. It forms a perfect flat hexagonal ring, just like the famous Carbon-based Benzene ring. However, instead of 6 Carbon atoms, it is made of alternating Boron and Nitrogen atoms! Because Boron has 3 valence electrons and Nitrogen has 5, their average is 4 (the exact same as Carbon). This allows them to mimic Carbon perfectly, even generating the famous 'Delocalized Pi Cloud'—the glowing magenta rings of electrons floating freely above and below the molecule!",
    parts: [
      { name: "Cyan Spheres", material: "Boron Atoms", function: "Provides 3 valence electrons." },
      { name: "Dark Blue Spheres", material: "Nitrogen Atoms", function: "Provides 5 valence electrons." },
      { name: "Magenta Halos", material: "Delocalized Pi Cloud", function: "Electrons shared freely across the entire ring, increasing stability." }
    ],
    quizQuestions: [
      { question: "Why is Borazine often called 'Inorganic Benzene'?", options: ["Because it smells like gasoline", "Because alternating Boron (3 electrons) and Nitrogen (5 electrons) perfectly mimics a ring of Carbon (4 electrons)!", "Because it is green", "Because it is toxic"], correct: 1, explanation: "This is a concept called 'isoelectronics'. If you average the electrons of Boron and Nitrogen, you get Carbon! Therefore, Boron-Nitrogen compounds often form the exact same physical structures as pure Carbon compounds." }
    ]
  };
}