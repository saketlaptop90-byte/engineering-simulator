import * as THREE from 'three';
export function createLithiumAufbauPrinciple() {
  const group = new THREE.Group();
  
  // The Aufbau Principle (Remastered)
  
  // Create a 3D Energy staircase
  const stairs = new THREE.Group();
  
  // 1s step (Lowest energy)
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5}));
  step1.position.set(0, -3, 0);
  stairs.add(step1);
  
  // 2s step (Higher energy)
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.5}));
  step2.position.set(0, 0, 0);
  stairs.add(step2);
  
  // 2p step (Even higher energy)
  const step3 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.2}));
  step3.position.set(0, 3, 0);
  stairs.add(step3);
  group.add(stairs);
  
  // Electrons falling down the stairs to fill the lowest state first
  const createE = (color) => {
      const e = new THREE.Group();
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: color, emissive: 0x222222}));
      e.add(s);
      return e;
  };
  
  const e1 = createE(0xffffff);
  const e2 = createE(0xaaaaaa);
  const e3 = createE(0x555555);
  group.add(e1, e2, e3);
  
  // Energy arrow pointing up
  const arrow = new THREE.Group();
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  head.position.y = 4;
  arrow.add(stick, head);
  arrow.position.set(-4, 0, 0);
  group.add(arrow);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      const cycle = (time * speed * 0.5) % 8;
      
      // Reset positions to top
      e1.position.set(-1, 6, 0);
      e2.position.set(1, 6, 0);
      e3.position.set(0, 6, 0);
      
      if (cycle > 1) {
          // e1 falls to 1s
          e1.position.y = Math.max(-2.5, 6 - (cycle - 1)*10);
      }
      if (cycle > 2) {
          // e2 falls to 1s
          e2.position.y = Math.max(-2.5, 6 - (cycle - 2)*10);
      }
      if (cycle > 3) {
          // e3 falls to 2s
          e3.position.y = Math.max(0.5, 6 - (cycle - 3)*10);
      }
      
      // Pulse the steps as they are hit
      if (e1.position.y === -2.5) step1.material.opacity = 0.8; else step1.material.opacity = 0.3;
      if (e3.position.y === 0.5) step2.material.opacity = 0.8; else step2.material.opacity = 0.3;
  };

  return {
    group: group,
    description: "The Aufbau Principle (Remastered). 'Aufbau' is a German word that translates to 'building up' or 'construction'. In quantum mechanics, it dictates exactly how an atom is constructed! The universe is inherently lazy; systems always seek the lowest possible energy state. When electrons are added to an atom, they do not just pick a random orbital. They must 'fall down the stairs', filling the absolute lowest energy orbitals first (1s) before they are allowed to occupy higher energy orbitals (2s, 2p). In this model, watch the three Lithium electrons drop into the energy wells in strict sequential order!",
    parts: [
      { name: "Cyan Step", material: "1s Energy Level", function: "The lowest energy state. Fills first." },
      { name: "Magenta Step", material: "2s Energy Level", function: "The next highest state. Fills only after 1s is full." },
      { name: "White Arrow", material: "Energy Scale", function: "Shows that energy increases as you move up." }
    ],
    quizQuestions: [
      { question: "What does the Aufbau Principle state?", options: ["Electrons orbit in circles", "Electrons will always fill the lowest available energy orbital before moving to higher ones.", "Electrons fill the highest energy orbitals first", "Atoms are built from protons"], correct: 1, explanation: "Just like water flows to the lowest point in a valley, electrons flow to the lowest energy state available!" }
    ]
  };
}