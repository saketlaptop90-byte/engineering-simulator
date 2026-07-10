import * as THREE from 'three';
export function createBoronNaBH4() {
  const group = new THREE.Group();
  
  // Sodium Borohydride (NaBH4) - A powerful reducing agent
  
  // The tetrahedral [BH4]- anion
  const bh4 = new THREE.Group();
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.1, roughness: 0.8}); // Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  const bAtom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), bMat);
  bh4.add(bAtom);
  
  const tetraPoints = [
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(-1, -1, 1),
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(1, -1, -1)
  ];
  
  const hydrogens = [];
  
  tetraPoints.forEach(p => {
      p.normalize().multiplyScalar(1.5);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), hMat);
      h.position.copy(p);
      bh4.add(h);
      hydrogens.push(h);
      
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), bondMat);
      bond.position.copy(p).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p.clone().normalize());
      bh4.add(bond);
  });
  
  bh4.position.set(-2, 0, 0);
  group.add(bh4);
  
  // The Na+ Cation
  const naMat = new THREE.MeshPhysicalMaterial({color: 0xffff00, metalness: 0.8, roughness: 0.3});
  const naAtom = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), naMat);
  naAtom.position.set(3, 0, 0);
  group.add(naAtom);
  
  // Electron transfer effect (Hydride donor)
  // Show arrows moving away from BH4, representing it acting as a reducing agent
  const arrows = new THREE.Group();
  const arrowMat = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.6});
  
  hydrogens.forEach(h => {
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 16), arrowMat);
      // point arrow outwards from hydrogen
      const dir = h.position.clone().normalize();
      arrow.position.copy(h.position).add(dir.clone().multiplyScalar(0.5));
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
      arrows.add(arrow);
  });
  bh4.add(arrows);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Spin the BH4 anion
      bh4.rotation.x = time * speed * 0.5;
      bh4.rotation.y = time * speed * 0.3;
      
      // Pulse the reducing arrows
      arrows.children.forEach(a => {
          const cycle = (time * speed * 2) % 1;
          a.position.add(a.position.clone().normalize().multiplyScalar(cycle * 0.01));
          a.scale.setScalar(1 - cycle);
          
          if(cycle < 0.05) {
              // reset
              const h = hydrogens[arrows.children.indexOf(a)];
              const dir = h.position.clone().normalize();
              a.position.copy(h.position).add(dir.clone().multiplyScalar(0.5));
          }
      });
  };

  return {
    group: group,
    description: "Sodium Borohydride (NaBH4). One of the most famous and widely used reducing agents in organic chemistry! Notice that it is an ionic compound composed of a Sodium cation (Na+) and a Borohydride anion [BH4]-. Because Boron is normally quite happy making only 3 bonds, making 4 bonds forces it to take on a negative charge. It doesn't like this, so the molecule acts as a powerful 'Hydride Donor'. It willingly throws off its hydrogen atoms (complete with their extra electrons) to reduce other chemicals. The pulsing green arrows visualize its eagerness to give away its hydrides!",
    parts: [
      { name: "Yellow Sphere", material: "Sodium Cation (Na+)", function: "A spectator ion balancing the charge." },
      { name: "Cyan/White Cluster", material: "Borohydride Anion [BH4]-", function: "A highly reactive tetrahedral molecule carrying a negative charge." },
      { name: "Pulsing Green Arrows", material: "Hydride Donation", function: "Visualizing the chemical's massive reducing power." }
    ],
    quizQuestions: [
      { question: "Why is Sodium Borohydride (NaBH4) considered a powerful 'reducing agent'?", options: ["Because it makes you lose weight", "Because Boron is unhappy with 4 bonds and a negative charge, so it violently throws away a Hydrogen atom (with its electrons) to neutralize itself.", "Because it steals oxygen from the air", "Because it is very small"], correct: 1, explanation: "In chemistry, 'reducing' means giving electrons to something else. By throwing away a Hydride (H-), the BH4 molecule is a spectacular electron donor!" }
    ]
  };
}