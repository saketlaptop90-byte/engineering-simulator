import * as THREE from 'three';
export function createBoronAufbau() {
  const group = new THREE.Group();
  
  // Filling the atom from bottom to top
  
  const levels = new THREE.Group();
  
  // Floor 1 (1s)
  const f1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 2), new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.3}));
  f1.position.y = -2; levels.add(f1);
  
  // Floor 2 (2s)
  const f2 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 2), new THREE.MeshBasicMaterial({color: 0x00aa00, transparent: true, opacity: 0.3}));
  f2.position.y = 0; levels.add(f2);
  
  // Floor 3 (2p)
  const f3 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 2), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.3}));
  f3.position.y = 2; levels.add(f3);
  
  group.add(levels);

  const eGrp = new THREE.Group();
  for(let i=0; i<5; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      eGrp.add(e);
  }
  group.add(eGrp);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      const cycle = (time * speed * 0.5) % 5; // 5 steps
      
      // Hide all first
      eGrp.children.forEach(e => e.visible = false);
      
      // Drop them in one by one based on cycle
      if (cycle > 0) { eGrp.children[0].visible = true; eGrp.children[0].position.set(-1, -1.7, 0); } // 1s
      if (cycle > 1) { eGrp.children[1].visible = true; eGrp.children[1].position.set(1, -1.7, 0); }  // 1s
      if (cycle > 2) { eGrp.children[2].visible = true; eGrp.children[2].position.set(-1, 0.3, 0); }  // 2s
      if (cycle > 3) { eGrp.children[3].visible = true; eGrp.children[3].position.set(1, 0.3, 0); }   // 2s
      if (cycle > 4) { eGrp.children[4].visible = true; eGrp.children[4].position.set(0, 2.3, 0); }   // 2p
      
      // Animate the dropping
      if (cycle > 0 && cycle <= 1) eGrp.children[0].position.y = 4 - (cycle * 5.7);
      if (cycle > 1 && cycle <= 2) eGrp.children[1].position.y = 4 - ((cycle-1) * 5.7);
      if (cycle > 2 && cycle <= 3) eGrp.children[2].position.y = 4 - ((cycle-2) * 3.7);
      if (cycle > 3 && cycle <= 4) eGrp.children[3].position.y = 4 - ((cycle-3) * 3.7);
      if (cycle > 4 && cycle <= 5) eGrp.children[4].position.y = 4 - ((cycle-4) * 1.7);
  };

  return {
    group: group,
    description: "The Aufbau Principle. 'Aufbau' is German for 'building up'. This principle states that electrons are lazy: they will always fill the lowest possible energy floors before moving to higher ones. Watch Boron's 5 electrons drop in. The first 2 go to the lowest basement (1s). The next 2 go to the ground floor (2s). The 5th electron has no choice but to take the stairs to the higher 2p floor. It cannot go to 2p until 2s is completely full!",
    parts: [
      { name: "Blue Floor", material: "1s Energy Level", function: "The lowest energy state, closest to the nucleus." },
      { name: "Green Floor", material: "2s Energy Level", function: "The next lowest state." },
      { name: "Red Floor", material: "2p Energy Level", function: "The highest energy state currently occupied in Boron." }
    ],
    quizQuestions: [
      { question: "If you threw a 6th electron in, where would it go according to the Aufbau Principle?", options: ["Down to the 1s floor", "It would go into the 2p floor, because 1s and 2s are completely full, and 2p is the lowest available energy state", "Up to the 3s floor", "It would fly away"], correct: 1, explanation: "Electrons always fill the lowest available empty seat. Because the 2p floor has 2 empty seats left, the next electron (which would make Carbon) goes there." }
    ]
  };
}