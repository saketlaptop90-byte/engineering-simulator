import * as THREE from 'three';
export function createBoronHundsRule() {
  const group = new THREE.Group();
  
  // Demonstrating the empty beds in the 2p orbital
  const boxGrp = new THREE.Group();
  
  for(let i=0; i<3; i++) {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), new THREE.MeshBasicMaterial({color: 0x333333, wireframe: true}));
      bed.position.set((i-1)*2, 0, 0);
      boxGrp.add(bed);
  }
  group.add(boxGrp);

  // The 5th electron in the first bed
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e.position.set(-2, 0.5, 0);
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 0.8, 0x00ffff, 0.3, 0.3);
  e.add(arrow);
  group.add(e);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2;
      group.rotation.x = 0.5; // Look down at beds
      
      // Electron hovers in its bed
      e.position.y = 0.5 + Math.sin(time*speed*5)*0.1;
  };

  return {
    group: group,
    description: "Hund's Rule. Hund's Rule is often called the 'Empty Bus Seat' rule. The 2p energy level has 3 equal beds (orbitals). Boron only has 1 electron to put here. It sits in the first bed, Spin Up. What happens when the next element (Carbon) adds a 2nd electron? According to Hund's Rule, electrons hate being next to each other. So the next electron will take the SECOND empty bed, rather than sharing the first bed with Boron's electron!",
    parts: [
      { name: "Wire Boxes", material: "Degenerate Orbitals", function: "3 spaces with the exact same energy level (px, py, pz)." },
      { name: "Cyan Sphere", material: "Unpaired Electron", function: "Sitting alone in its orbital." }
    ],
    quizQuestions: [
      { question: "According to Hund's rule, why wouldn't the next electron just share the first box?", options: ["Because it's illegal", "Because electrons are negatively charged and repel each other. It takes less energy to take an empty box than to share a box and fight the repulsion.", "Because the first box is too small", "Because electrons don't like the color cyan"], correct: 1, explanation: "Just like strangers on a bus, electrons will fill up all the empty seats first before they are forced to sit next to someone else!" }
    ]
  };
}