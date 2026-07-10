import * as THREE from 'three';
export function createLithiumWaterReactivity() {
  const group = new THREE.Group();
  
  // A chunk of Lithium metal
  const li = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8}));
  li.position.set(0, -1, 0);
  group.add(li);

  // Water surface
  const water = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshPhysicalMaterial({color: 0x0000ff, transparent: true, opacity: 0.5}));
  water.rotation.x = -Math.PI/2;
  water.position.set(0, -1.5, 0);
  group.add(water);

  // Bubbles (Hydrogen gas)
  const bubbles = new THREE.Group();
  for(let i=0; i<15; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
      b.userData = { x: (Math.random()-0.5)*2, y: -1, z: (Math.random()-0.5)*2, speed: Math.random()*2+1 };
      bubbles.add(b);
  }
  group.add(bubbles);

  // Red glow (Heat)
  const heat = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0}));
  heat.position.set(0, -1, 0);
  group.add(heat);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      // Bobbing
      li.position.y = -1 + Math.sin(time*speed*5)*0.1;
      heat.position.y = li.position.y;
      
      // Bubbles rising
      bubbles.children.forEach(b => {
          b.position.y += b.userData.speed * speed * 0.05;
          b.position.x = b.userData.x + Math.sin(time*speed*10 + b.userData.y)*0.1;
          b.position.z = b.userData.z;
          if (b.position.y > 3) b.position.y = -1; // reset
      });
      
      // Heat pulsing
      heat.material.opacity = 0.3 + Math.sin(time*speed*8)*0.2;
  };

  return {
    group: group,
    description: "Reactivity with Water. Never throw Lithium into a lake! Alkali metals react violently with water. The reaction is: 2Li + 2H₂O → 2LiOH + H₂. The Lithium rips the water molecules apart to give away its electron, creating Lithium Hydroxide and highly flammable Hydrogen gas. The reaction generates so much heat that it can ignite the hydrogen gas, causing an explosion.",
    parts: [
      { name: "Silver Cube", material: "Lithium Metal", function: "Floating on the surface (it's less dense than water!)" },
      { name: "White Bubbles", material: "Hydrogen Gas", function: "A highly flammable byproduct of the reaction." },
      { name: "Red Glow", material: "Exothermic Heat", function: "The reaction releases massive amounts of energy." }
    ],
    quizQuestions: [
      { question: "When Lithium reacts with water, what gas is produced that causes the dangerous fizzing and potential explosions?", options: ["Oxygen gas", "Carbon Dioxide", "Hydrogen gas", "Nitrogen gas"], correct: 2, explanation: "Lithium forces water (H₂O) to break apart. The Lithium steals the OH- to make LiOH, and the leftover Hydrogen atoms pair up into H₂ gas and bubble away. If it gets too hot, that H₂ gas will catch fire." }
    ]
  };
}