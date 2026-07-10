import * as THREE from 'three';
export function createBerylliumAntimatter() {
  const group = new THREE.Group();
  
  // Anti-Beryllium!
  // Nucleus: 4 Antiprotons (-), 5 Antineutrons
  // Shell: 4 Positrons (+)
  
  const nucleus = new THREE.Group();
  
  // 4 Antiprotons (Blue, because they are negative!)
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); p1.position.set(0.2, 0.2, 0.2);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); p2.position.set(-0.2, -0.2, 0.2);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); p3.position.set(0.2, -0.2, -0.2);
  const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); p4.position.set(-0.2, 0.2, -0.2);
  nucleus.add(p1,p2,p3,p4);
  
  // 5 Antineutrons (Red)
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); n1.position.set(0, 0.4, 0);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); n2.position.set(0.4, 0, 0);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); n3.position.set(0, -0.4, 0);
  const n4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); n4.position.set(-0.4, 0, 0);
  const n5 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); n5.position.set(0, 0, 0.4);
  nucleus.add(n1,n2,n3,n4,n5);
  
  group.add(nucleus);

  // 4 Positrons (Positive anti-electrons)
  const eGrp = new THREE.Group();
  for(let i=0; i<4; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); // Positive
      e.userData = { offset: i * Math.PI/2 };
      eGrp.add(e);
  }
  group.add(eGrp);

  // Giant text "ANTI-BERYLLIUM"
  const text = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  text.position.set(0, 3, 0);
  group.add(text);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = time * speed * 0.1;
      
      eGrp.children.forEach((e, i) => {
          const t = time * speed * 2 + e.userData.offset;
          e.position.set(Math.cos(t)*2, Math.sin(t*2)*1, Math.sin(t)*2);
      });
  };

  return {
    group: group,
    description: "Anti-Beryllium (Antimatter). Every particle in the universe has an evil twin with the exact opposite electrical charge. If you made an atom out of antimatter, the protons would be negative (Antiprotons) and the electrons would be positive (Positrons). This atom of Anti-Beryllium would look, feel, and act exactly like normal Beryllium. But if it ever touched a single atom of normal matter, they would both instantly annihilate into a blinding flash of pure gamma radiation.",
    parts: [
      { name: "Blue Nucleus", material: "Antiprotons (-4)", function: "The nucleus is negatively charged." },
      { name: "Red Orbiters", material: "Positrons (+4)", function: "The 'anti-electrons' are positively charged." }
    ],
    quizQuestions: [
      { question: "What happens if a chunk of Anti-Beryllium touches a chunk of normal Beryllium?", options: ["They bond to form a super-metal", "They completely annihilate each other, converting 100% of their mass into pure explosive energy", "They bounce off each other", "Nothing"], correct: 1, explanation: "Matter + Antimatter = Total Annihilation. It is the most efficient and destructive energy release possible in physics (E=mc²)." }
    ]
  };
}