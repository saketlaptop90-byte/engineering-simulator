import * as THREE from 'three';
export function createBerylliumJamesWebb() {
  const group = new THREE.Group();
  
  // The iconic gold-plated hexagon mirror
  
  const mirrorGroup = new THREE.Group();
  
  // Hexagon shape
  const hexGeo = new THREE.CylinderGeometry(2, 2, 0.2, 6);
  // Rotated to stand up
  hexGeo.rotateX(Math.PI/2);
  hexGeo.rotateZ(Math.PI/6); // Point up
  
  // Beryllium base (Grey)
  const base = new THREE.Mesh(hexGeo, new THREE.MeshStandardMaterial({color: 0x88ccff, metalness: 0.8, roughness: 0.5}));
  base.position.z = -0.1;
  mirrorGroup.add(base);

  // Gold plating (Yellow/Gold)
  const gold = new THREE.Mesh(hexGeo, new THREE.MeshStandardMaterial({color: 0xffcc00, metalness: 1.0, roughness: 0.1}));
  gold.scale.set(0.95, 0.95, 0.1);
  gold.position.z = 0.05;
  mirrorGroup.add(gold);
  
  group.add(mirrorGroup);

  // Infrared light rays reflecting off it
  const rays = new THREE.Group();
  for(let i=0; i<3; i++) {
      const ray = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 2, 4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 2, 4)]), new THREE.LineBasicMaterial({color: 0xff0000}));
      ray.position.set((i-1)*0.5, (i-1)*0.5, 0);
      rays.add(ray);
  }
  group.add(rays);

  group.userData.animate = function(delta, time, speed) {
      mirrorGroup.rotation.y = Math.sin(time*speed*0.5)*0.3;
      mirrorGroup.rotation.x = Math.sin(time*speed*0.3)*0.2;
      
      // Pulse rays
      rays.children.forEach(ray => {
          ray.material.opacity = 0.5 + Math.sin(time*speed*5 + ray.position.x)*0.5;
          ray.material.transparent = true;
      });
  };

  return {
    group: group,
    description: "The James Webb Space Telescope. Beryllium is the absolute perfect material for the JWST mirrors! Why? 1) It is stiffer than steel, so the mirrors won't bend. 2) It is lighter than aluminum, saving millions of dollars in rocket fuel. 3) Crucially, at the extreme cryogenic temperatures of deep space (-233 °C), Beryllium stops shrinking and expanding! Its dimensions lock into place perfectly, allowing the telescope to take flawless, focused pictures of the early universe.",
    parts: [
      { name: "Grey Hexagon Base", material: "Solid Beryllium", function: "Lightweight, ultra-stiff, cryogenically stable structure." },
      { name: "Gold Plating", material: "Microscopic Gold Layer", function: "Coated on top of the Beryllium because Gold is the best reflector of Infrared light." },
      { name: "Red Lasers", material: "Infrared Light", function: "Ancient light from the beginning of the universe bouncing perfectly off the unwarped Beryllium mirror." }
    ],
    quizQuestions: [
      { question: "Why didn't NASA just build the James Webb mirrors out of glass or steel?", options: ["Because they ran out", "Because Beryllium is incredibly lightweight, stiffer than steel, and doesn't warp or bend at the freezing temperatures of deep space", "Because Beryllium is cheaper", "Because glass is too shiny"], correct: 1, explanation: "If you used steel, the rocket would be too heavy to launch. If you used glass or aluminum, the mirror would warp and deform in the freezing cold of space, causing the telescope to take blurry photos (which actually happened to Hubble!). Beryllium is the ultimate engineering material for space." }
    ]
  };
}