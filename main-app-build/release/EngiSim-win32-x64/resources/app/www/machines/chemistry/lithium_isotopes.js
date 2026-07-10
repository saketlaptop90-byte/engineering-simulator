import * as THREE from 'three';
export function createLithiumIsotopes() {
  const group = new THREE.Group();
  
  // Isotopes (Li-6 vs Li-7) Side by Side (Remastered)
  
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.3, roughness: 0.1, clearcoat: 1.0}); // Protons
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.3, roughness: 0.1, clearcoat: 1.0}); // Neutrons
  
  const createNucleus = (protons, neutrons) => {
      const g = new THREE.Group();
      let pCount = 0;
      let nCount = 0;
      const total = protons + neutrons;
      
      for(let i=0; i<total; i++) {
          const isProton = (pCount < protons) && (Math.random() > 0.5 || nCount >= neutrons);
          if (isProton) pCount++; else nCount++;
          
          const mat = isProton ? pMat : nMat;
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), mat);
          
          // Pack them into a rough sphere
          const radius = 0.6;
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          sphere.position.set(
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              radius * Math.cos(phi)
          );
          
          g.add(sphere);
      }
      return g;
  };
  
  // Lithium-6 (3P, 3N)
  const li6 = createNucleus(3, 3);
  li6.position.x = -3;
  group.add(li6);
  
  // Lithium-7 (3P, 4N)
  const li7 = createNucleus(3, 4);
  li7.position.x = 3;
  group.add(li7);
  
  // Labels (using basic geometry)
  const createLabel = (colorHex, posX) => {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), new THREE.MeshBasicMaterial({color: colorHex}));
      plate.position.set(posX, -2, 0);
      g.add(plate);
      return g;
  };
  group.add(createLabel(0xffff00, -3)); // Li-6 Label
  group.add(createLabel(0x00ffff, 3)); // Li-7 Label

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.2)*0.2;
      
      li6.rotation.y = time * speed * 0.5;
      li6.rotation.x = time * speed * 0.3;
      
      li7.rotation.y = time * speed * 0.5;
      li7.rotation.x = time * speed * 0.3;
  };

  return {
    group: group,
    description: "Lithium Isotopes (Remastered). Here we compare the two stable isotopes of Lithium side-by-side! On the left is Lithium-6 (3 red protons, 3 blue neutrons). On the right is Lithium-7 (3 red protons, 4 blue neutrons). Notice that they both have exactly 3 protons—that is what makes them both Lithium! The only difference is the number of neutrons. Chemically, they act exactly the same, but physically, Lithium-7 is heavier. In nature, 92.5% of all Lithium is Li-7, making Li-6 very rare!",
    parts: [
      { name: "Left Cluster (Li-6)", material: "3 Protons, 3 Neutrons", function: "Lighter isotope, prized for nuclear fusion." },
      { name: "Right Cluster (Li-7)", material: "3 Protons, 4 Neutrons", function: "Heavier isotope, makes up 92% of natural Lithium." }
    ],
    quizQuestions: [
      { question: "What makes two atoms 'isotopes' of each other?", options: ["They have different numbers of protons", "They have the same number of protons (same element), but different numbers of neutrons (different weights).", "They are different colors", "They have no electrons"], correct: 1, explanation: "The number of protons defines the element. The number of neutrons just changes how heavy the nucleus is!" }
    ]
  };
}