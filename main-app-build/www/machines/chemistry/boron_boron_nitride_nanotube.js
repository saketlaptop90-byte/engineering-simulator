import * as THREE from 'three';
export function createBNNanotube() {
  const group = new THREE.Group();
  
  // Boron Nitride Nanotube (BNNT)
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2, clearcoat: 1.0}); // Boron
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.5, roughness: 0.2, clearcoat: 1.0}); // Nitrogen
  const bondMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 0.8, roughness: 0.2});
  
  const radius = 3;
  const length = 12; // number of rings
  const segments = 12; // atoms per ring
  
  const atoms = [];
  
  // Build cylindrical mesh
  for(let y=0; y<length; y++) {
      const yPos = (y - length/2) * 1.0; // vertical spacing
      
      for(let s=0; s<segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          // shift alternating rings to create hex pattern
          const offsetAngle = (y % 2 === 0) ? 0 : (Math.PI / segments);
          const finalAngle = angle + offsetAngle;
          
          const xPos = Math.cos(finalAngle) * radius;
          const zPos = Math.sin(finalAngle) * radius;
          
          const isBoron = (s % 2 === 0) ^ (y % 2 === 0); // checkerboard alternating
          
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), isBoron ? bMat : nMat);
          atom.position.set(xPos, yPos, zPos);
          group.add(atom);
          
          atoms.push({pos: new THREE.Vector3(xPos, yPos, zPos), ring: y, seg: s});
      }
  }
  
  // Create bonds based on distance
  for(let i=0; i<atoms.length; i++) {
      for(let j=i+1; j<atoms.length; j++) {
          const dist = atoms[i].pos.distanceTo(atoms[j].pos);
          if (dist > 0.8 && dist < 1.4) { // Only bond nearest neighbors
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, dist, 8), bondMat);
              b.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
              b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
              group.add(b);
          }
      }
  }
  
  // High-tech glowing core
  const coreGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(radius-0.5, radius-0.5, length, 32),
      new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, side: THREE.DoubleSide})
  );
  group.add(coreGlow);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,0,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.3;
      group.rotation.z = Math.sin(time*speed*0.15)*0.1;
      
      coreGlow.material.opacity = 0.1 + Math.sin(time*speed*5)*0.05;
  };

  return {
    group: group,
    description: "Boron Nitride Nanotube (BNNT). You've probably heard of Carbon Nanotubes, but Boron and Nitrogen can form them too! Once again, alternating Boron and Nitrogen atoms perfectly mimic Carbon. BNNTs are cylindrical tubes of a flat hexagonal lattice. However, unlike Carbon Nanotubes (which conduct electricity), BNNTs are excellent electrical INSULATORS. Even better, they can survive extreme temperatures (up to 900°C) without burning! This makes them the ultimate high-tech composite material for aerospace shielding.",
    parts: [
      { name: "Cyan Spheres", material: "Boron", function: "Alternating in the hex lattice." },
      { name: "Dark Blue Spheres", material: "Nitrogen", function: "Alternating in the hex lattice." },
      { name: "Hexagonal Tube", material: "Nanotube Structure", function: "Incredibly strong, lightweight, heat-resistant, and electrically insulating." }
    ],
    quizQuestions: [
      { question: "What is a major advantage of Boron Nitride Nanotubes over Carbon Nanotubes?", options: ["They are cheaper", "They are excellent electrical insulators and can survive much higher temperatures without oxidizing (burning) in air.", "They are magnetic", "They conduct electricity perfectly"], correct: 1, explanation: "Carbon nanotubes burn up in the air at high temperatures and often conduct electricity. BNNTs are electrical insulators and survive extreme heat, making them perfect for protecting delicate electronics in space!" }
    ]
  };
}