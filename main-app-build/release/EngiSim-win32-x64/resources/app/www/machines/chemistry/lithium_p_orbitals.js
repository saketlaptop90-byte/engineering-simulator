import * as THREE from 'three';
export function createLithiumPOrbitals() {
  const group = new THREE.Group();
  
  // The Empty 2p Orbitals (Remastered)
  
  // Lithium only has 3 electrons (1s2, 2s1). The 2p subshell is completely empty!
  // But the mathematical 'rooms' still exist, waiting to be occupied.
  
  const pMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.15, // Very ghost-like because they are empty
      transmission: 0.9,
      roughness: 0.1,
      wireframe: true
  });
  
  const createPOrbital = (axisName, rotX, rotY, rotZ) => {
      const g = new THREE.Group();
      const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), pMat);
      lobe1.position.y = 1.2; lobe1.scale.set(1, 1.8, 1);
      
      const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), pMat);
      lobe2.position.y = -1.2; lobe2.scale.set(1, 1.8, 1);
      
      g.add(lobe1, lobe2);
      g.rotation.set(rotX, rotY, rotZ);
      
      // Axis line
      const lineMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
      const points = [new THREE.Vector3(0, -4, 0), new THREE.Vector3(0, 4, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const axis = new THREE.Line(geo, lineMat);
      g.add(axis);
      
      return g;
  };
  
  const pY = createPOrbital("y", 0, 0, 0);
  const pX = createPOrbital("x", 0, 0, Math.PI/2);
  const pZ = createPOrbital("z", Math.PI/2, 0, 0);
  
  group.add(pY, pX, pZ);
  
  // The nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = time * speed * 0.1;
      
      // Ghostly pulsing to show they are unoccupied potential spaces
      const pulse = 1 + Math.sin(time*speed*3)*0.05;
      pY.scale.setScalar(pulse);
      pX.scale.setScalar(pulse);
      pZ.scale.setScalar(pulse);
  };

  return {
    group: group,
    description: "The Empty 2p Orbitals (Remastered). Wait, if Lithium only has 3 electrons (1s2, 2s1), why are we looking at p-orbitals? Because the mathematical 'rooms' still exist even if no one is living in them! The n=2 shell contains three p-orbitals (px, py, pz), which look like pinched dumbbells aligning perfectly with the X, Y, and Z axes. They are currently empty (which is why they are rendered as ghostly wireframes). However, if you blast a Lithium atom with a laser, you can 'excite' the valence electron, causing it to instantly jump out of the 2s sphere and teleport into one of these empty 2p dumbbells!",
    parts: [
      { name: "Green Ghostly Dumbbells", material: "Empty 2p Orbitals", function: "Unoccupied probability states, aligned along X, Y, and Z axes." },
      { name: "White Lines", material: "Cartesian Axes", function: "Shows the spatial orientation of the p-orbitals." }
    ],
    quizQuestions: [
      { question: "Even though Lithium's 2p orbitals are empty, what can happen if the atom absorbs enough energy?", options: ["The atom explodes", "The valence electron can be 'excited' and jump into one of the empty 2p orbitals.", "The nucleus vanishes", "The orbitals disappear"], correct: 1, explanation: "Electrons are allowed to jump into higher, empty orbitals as long as they absorb the exact right amount of energy to make the jump!" }
    ]
  };
}