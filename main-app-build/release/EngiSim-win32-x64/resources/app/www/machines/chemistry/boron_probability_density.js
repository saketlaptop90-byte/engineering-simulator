import * as THREE from 'three';
export function createBoronProbabilityDensity() {
  const group = new THREE.Group();
  
  // Probability Density Nodes (Upgraded)
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, emissive: 0x440000});
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), bMat);
  group.add(core);

  // The 2p orbital (dumbbell)
  const pGeo = new THREE.SphereGeometry(2, 64, 64);
  const pMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ff00,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.2,
      ior: 1.1,
      side: THREE.DoubleSide
  });
  
  // Top lobe
  const lobe1 = new THREE.Mesh(pGeo, pMat);
  lobe1.scale.set(0.8, 1.2, 0.8);
  lobe1.position.y = 2.2;
  
  // Bottom lobe
  const lobe2 = new THREE.Mesh(pGeo, pMat);
  lobe2.scale.set(0.8, 1.2, 0.8);
  lobe2.position.y = -2.2;
  
  // The 'Node' (a completely flat, black, empty disk cutting through the center)
  const nodePlane = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 5, 64),
      new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.8})
  );
  nodePlane.rotation.x = Math.PI/2;
  
  // Let's add glowing wireframes to show the mathematical boundaries
  const wfMat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.2});
  const wf1 = new THREE.Mesh(pGeo, wfMat); wf1.scale.copy(lobe1.scale); wf1.position.copy(lobe1.position);
  const wf2 = new THREE.Mesh(pGeo, wfMat); wf2.scale.copy(lobe2.scale); wf2.position.copy(lobe2.position);
  
  group.add(lobe1, lobe2, wf1, wf2, nodePlane);
  
  // Particle showing the electron CANNOT exist in the node
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(electron);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,5,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.15;
      group.rotation.z = Math.sin(time*speed*0.1)*0.2;
      
      // The electron teleports around inside the lobes, but NEVER touches the black plane!
      const cycle = Math.floor(time * speed * 4.0) % 20;
      // random position inside lobes
      if (Math.random() > 0.1) {
          const sign = Math.random() > 0.5 ? 1 : -1;
          const r = Math.random() * 1.5;
          const u = Math.random() * Math.PI * 2;
          // y must be safely inside the lobe
          const y = sign * (2.2 + (Math.random()-0.5)*1.5);
          electron.position.set(Math.cos(u)*r, y, Math.sin(u)*r);
          electron.visible = true;
      } else {
          electron.visible = false; // "teleporting"
      }
  };

  return {
    group: group,
    description: "Probability Density Nodes - Upgraded. If electrons are waves, they must have 'nodes'—points where the wave amplitude is exactly zero. Look at the black disc slicing through the center of the green 2p orbital. The probability of finding the electron anywhere on that flat plane is EXACTLY ZERO. Yet, the electron is frequently found in the top lobe, and frequently found in the bottom lobe! How does it cross a plane where it cannot exist? It doesn't travel; it 'Quantum Tunnels'!",
    parts: [
      { name: "Green Glass Lobes", material: "Probability Field", function: "Where the electron is likely to be found." },
      { name: "Black Disc", material: "Angular Node", function: "A mathematical boundary where existence is forbidden." },
      { name: "Flashing White Dot", material: "The Electron", function: "Teleporting between the lobes without ever crossing the black disc." }
    ],
    quizQuestions: [
      { question: "How does the electron get from the top green lobe to the bottom green lobe if it is physically forbidden from crossing the black plane in the middle?", options: ["It flies around the outside", "It pushes the plane out of the way", "It doesn't 'travel' normally. Because it acts as a wave, it can disappear from the top lobe and instantly appear in the bottom lobe (Quantum Tunneling).", "It turns off its charge"], correct: 2, explanation: "This is one of the most mind-bending facts in physics. Electrons don't move in continuous paths like cars. They exist as probability waves, allowing them to instantly cross forbidden zones!" }
    ]
  };
}