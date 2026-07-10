import * as THREE from 'three';
export function createLithiumWaterReaction() {
  const group = new THREE.Group();
  
  // Lithium Water Reaction (Remastered)
  
  // A pool of water
  const waterGeo = new THREE.CylinderGeometry(8, 8, 2, 32);
  const waterMat = new THREE.MeshPhysicalMaterial({color: 0x0088ff, transparent: true, opacity: 0.5, transmission: 0.9, roughness: 0.1, ior: 1.33});
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -1;
  group.add(water);
  
  // A chunk of Lithium metal floating on top (density = 0.53 g/cm3)
  const liChunk = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.8, 1),
      new THREE.MeshPhysicalMaterial({color: 0xcccccc, metalness: 0.8, roughness: 0.5})
  );
  liChunk.position.set(0, 0, 0);
  group.add(liChunk);
  
  // Fizzing Hydrogen Gas bubbles
  const bubbles = new THREE.Group();
  const bMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.6});
  const bArray = [];
  for(let i=0; i<30; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), bMat);
      b.userData = { offset: Math.random() * Math.PI * 2, speed: 2 + Math.random()*2, radius: Math.random()*0.5 + 0.8 };
      bubbles.add(b);
      bArray.push(b);
  }
  group.add(bubbles);
  
  // Pink trail (Phenolphthalein indicator showing LiOH creation)
  const pinkTrail = new THREE.Group();
  const pMat = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending});
  const pArray = [];
  for(let i=0; i<40; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), pMat);
      pinkTrail.add(p);
      pArray.push(p);
  }
  group.add(pinkTrail);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Lithium piece darts around on the surface of the water
      const lx = Math.sin(time * speed * 2) * 2 * Math.cos(time * speed * 1.5);
      const lz = Math.cos(time * speed * 2.3) * 2;
      liChunk.position.set(lx, 0.2 + Math.sin(time*speed*10)*0.05, lz); // bobs slightly
      liChunk.rotation.x = time * speed * 5;
      liChunk.rotation.z = time * speed * 3;
      
      // Bubbles shoot out from the lithium
      bubbles.position.copy(liChunk.position);
      bArray.forEach((b, i) => {
          const t = ((time * speed * b.userData.speed) + b.userData.offset) % 1.0;
          // shoot out radially and up
          const angle = i * (Math.PI*2 / bArray.length);
          b.position.set(Math.cos(angle)*t*2, t*2, Math.sin(angle)*t*2);
          b.scale.setScalar(1 - t);
      });
      
      // Leave a pink trail of LiOH behind
      pArray.forEach((p, i) => {
          const delayTime = time * speed - (i * 0.05);
          const px = Math.sin(delayTime * 2) * 2 * Math.cos(delayTime * 1.5);
          const pz = Math.cos(delayTime * 2.3) * 2;
          p.position.set(px, 0, pz);
          // fade out older parts of the trail
          p.scale.setScalar(1 + (i*0.02));
      });
  };

  return {
    group: group,
    description: "Lithium Water Reaction (Remastered). Because Lithium is so light (half the density of water), it floats on the surface! And because its single valence electron is so weakly held, it instantly reacts with H2O. The reaction strips Hydrogen away from the water to create highly flammable Hydrogen Gas (H2), which causes the violent fizzing! The remaining atoms form Lithium Hydroxide (LiOH), a strong base. The pink trail you see is Phenolphthalein indicator, which turns bright magenta to show us exactly where the basic LiOH is being formed in the water!",
    parts: [
      { name: "Silver Rock", material: "Solid Lithium Metal", function: "Floating on the water and reacting violently." },
      { name: "White Bubbles", material: "Hydrogen Gas (H2)", function: "Created when Lithium rips H2O molecules apart." },
      { name: "Magenta Trail", material: "Lithium Hydroxide (LiOH)", function: "A strong base left behind in the water." }
    ],
    quizQuestions: [
      { question: "When you drop Lithium in water, it fizzes violently. What gas is being produced?", options: ["Oxygen", "Hydrogen Gas (H2)", "Carbon Dioxide", "Helium"], correct: 1, explanation: "2 Li + 2 H2O -> 2 LiOH + H2. The reaction releases Hydrogen gas, which is highly flammable!" }
    ]
  };
}