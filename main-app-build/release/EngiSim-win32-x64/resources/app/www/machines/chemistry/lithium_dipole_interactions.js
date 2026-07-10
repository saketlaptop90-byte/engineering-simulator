import * as THREE from 'three';
export function createLithiumDipoleInteractions() {
  const group = new THREE.Group();
  
  // A Li+ ion being surrounded by Water molecules (Ion-Dipole interaction)
  const li = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.8}));
  const nucLi = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); li.add(nucLi);
  group.add(li);
  const plus = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xffffff})); plus.position.set(0, 0, 1); group.add(plus);

  // Water molecules orienting their Oxygen (negative end) toward the Li+
  const waters = new THREE.Group();
  for(let i=0; i<6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const w = new THREE.Group();
      w.position.set(Math.cos(angle)*2.5, Math.sin(angle)*2.5, 0);
      w.rotation.z = angle + Math.PI; // Point Oxygen at center
      
      const ox = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})); h1.position.set(0.4, 0.4, 0);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})); h2.position.set(0.4, -0.4, 0);
      
      w.add(ox, h1, h2);
      
      // Dashed line for interaction
      const line = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.05, 0.05)), new THREE.LineDashedMaterial({color: 0xffff00, dashSize: 0.1, gapSize: 0.1}));
      line.position.set(-0.75, 0, 0);
      line.computeLineDistances();
      w.add(line);
      
      waters.add(w);
  }
  group.add(waters);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.z = time * speed * 0.1;
      
      // Waters pulsing inward and outward
      const scale = 1 + Math.sin(time * speed * 3) * 0.1;
      waters.scale.set(scale, scale, scale);
  };

  return {
    group: group,
    description: "Ion-Dipole Interactions. When you dissolve Lithium salts (like LiCl) in water, the Li+ ions are aggressively attacked by the water molecules. Water is a 'dipole'—its Oxygen end is slightly negative, and its Hydrogen ends are slightly positive. The negative Oxygen ends instantly surround the positive Li+ ion, caging it in a 'hydration shell'.",
    parts: [
      { name: "Cyan Sphere", material: "Li+ Ion", function: "Positively charged center." },
      { name: "Red/White Clusters", material: "Water Molecules", function: "Polar molecules (dipoles) orienting their negative Oxygen toward the Li+." },
      { name: "Yellow Dashed Lines", material: "Ion-Dipole Force", function: "The electrostatic attraction pulling the water tightly around the ion." }
    ],
    quizQuestions: [
      { question: "Why do water molecules orient their Oxygen atoms toward the Lithium ion?", options: ["Because Oxygen is positively charged", "Because Oxygen is highly electronegative and holds a partial negative charge, which is attracted to the positive Li+ ion", "Because Hydrogen is afraid of Lithium", "Because they want to form a covalent bond"], correct: 1, explanation: "Opposites attract. The Li+ ion has a full positive charge. Water's Oxygen atom hoards electrons, giving it a partial negative charge. Therefore, the Oxygen end points inward, and the positive Hydrogen ends point outward." }
    ]
  };
}