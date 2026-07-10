import * as THREE from 'three';
export function createHeliumThomsonModel() {
  const group = new THREE.Group();
  
  // Positively charged "pudding" (Charge +2 for Helium)
  const pudding = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffaaaa, transparent: true, opacity: 0.5, transmission: 0.8, roughness: 0.2}));
  group.add(pudding);

  // Two embedded electrons "plums"
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  e1.position.set(1.5, 0.5, -1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  e2.position.set(-1.5, -0.5, 1);
  group.add(e1, e2);

  // Field lines to show diffuse +2 positive charge
  const fieldGroup = new THREE.Group();
  for(let i=0; i<80; i++) {
      const p = new THREE.Vector3((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5);
      if(p.length() < 2.8) {
          const plus = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
          const plus2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
          plus.position.copy(p); plus2.position.copy(p);
          fieldGroup.add(plus, plus2);
      }
  }
  group.add(fieldGroup);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      e1.position.y = 0.5 + Math.sin(time*speed*5)*0.1;
      e2.position.y = -0.5 + Math.cos(time*speed*5)*0.1;
  };

  return {
    group: group,
    description: "Thomson 'Plum Pudding' Model for Helium (Historical). According to J.J. Thomson's early atomic model, a Helium atom consisted of a diffuse sphere of +2 positive charge (the pudding) with exactly two negatively charged electrons (the plums) embedded within it to balance the charge.",
    parts: [
      { name: "Diffuse Positive Charge (+2)", material: "Pudding", function: "Hypothetical continuous positive field representing Helium's mass." },
      { name: "Two Embedded Electrons", material: "Plums", function: "Repelling each other while being attracted to the pudding's center." }
    ],
    quizQuestions: [
      { question: "In Thomson's Plum Pudding model, how did he explain the neutral charge of a Helium atom?", options: ["By adding two neutrons", "By embedding exactly two negatively charged electrons inside a +2 positively charged 'pudding'", "By removing all charge", "By placing a +2 charge in a dense central nucleus"], correct: 1, explanation: "Thomson knew atoms were neutral and contained electrons. He assumed the rest of the atom must be a diffuse sphere of positive charge (the 'pudding') that exactly canceled out the total negative charge of the embedded electrons." }
    ]
  };
}