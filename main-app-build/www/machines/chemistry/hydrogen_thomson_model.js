import * as THREE from 'three';
export function createHydrogenThomsonModel() {
  const group = new THREE.Group();
  
  // Positively charged "pudding"
  const pudding = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffaaaa, transparent: true, opacity: 0.5, transmission: 0.8, roughness: 0.2}));
  group.add(pudding);

  // Single electron "plum" embedded
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  electron.position.set(1.5, 0.5, -1);
  group.add(electron);

  // Field lines to show diffuse positive charge
  const fieldGroup = new THREE.Group();
  for(let i=0; i<50; i++) {
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
      electron.position.y = 0.5 + Math.sin(time*speed*5)*0.1; // Slight jiggling
  };

  return {
    group: group,
    description: "Thomson 'Plum Pudding' Model (1904). J.J. Thomson proposed that atoms were uniform spheres of positively charged matter in which electrons were embedded like plums in a pudding. This was disproved by Rutherford.",
    parts: [
      { name: "Diffuse Positive Charge", material: "Pudding", function: "Hypothetical continuous positive field." },
      { name: "Embedded Electron", material: "Plum", function: "The negatively charged corpuscle discovered by Thomson." }
    ],
    quizQuestions: [
      { question: "Why was Thomson's Plum Pudding model of the atom eventually discarded?", options: ["It didn't include electrons", "It proposed a diffuse positive charge, but Rutherford's gold foil experiment proved the positive charge was concentrated in a tiny, dense nucleus", "It was too complex", "Electrons were proven to be positively charged"], correct: 1, explanation: "Rutherford's experiment fired alpha particles at gold foil. A few bounced straight back, proving that the positive charge wasn't a diffuse 'pudding', but a dense, tiny, hard nucleus at the center." }
    ]
  };
}