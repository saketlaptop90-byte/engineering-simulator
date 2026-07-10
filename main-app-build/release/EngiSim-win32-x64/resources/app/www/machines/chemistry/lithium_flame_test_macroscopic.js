import * as THREE from 'three';
export function createLithiumFlameTestMacroscopic() {
  const group = new THREE.Group();
  
  // Macroscopic Flame Test (Remastered)
  
  // Bunsen Burner Nozzle
  const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 32),
      new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 0.9, roughness: 0.2})
  );
  burner.position.y = -4;
  group.add(burner);
  
  // The Flame (Normally blue, but turned Crimson Red by Lithium)
  const flameGeo = new THREE.BufferGeometry();
  const flameCount = 500;
  const flamePos = new Float32Array(flameCount * 3);
  for(let i=0; i<flameCount; i++) {
      flamePos[i*3] = (Math.random()-0.5);
      flamePos[i*3+1] = Math.random() * 5;
      flamePos[i*3+2] = (Math.random()-0.5);
  }
  flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
  
  const flameMat = new THREE.PointsMaterial({
      color: 0xff0022, // Crimson Red!
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });
  const flame = new THREE.Points(flameGeo, flameMat);
  flame.position.y = -2;
  group.add(flame);
  
  // Wire loop holding Lithium Chloride
  const wire = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.05, 8, 32, Math.PI * 1.5),
      new THREE.MeshBasicMaterial({color: 0xcccccc})
  );
  wire.position.set(-1, -1, 0);
  wire.rotation.z = Math.PI/2;
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 6), new THREE.MeshBasicMaterial({color: 0xcccccc}));
  stick.rotation.z = Math.PI/2;
  stick.position.set(-4.4, -1, 0);
  group.add(wire, stick);
  
  // Heat glow
  const glow = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff0022, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending})
  );
  glow.position.y = 0;
  group.add(glow);

  const light = new THREE.PointLight(0xff0022, 5, 20);
  light.position.set(0, 0, 0);
  group.add(light);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Animate flame particles
      const pos = flameGeo.attributes.position.array;
      for(let i=0; i<flameCount; i++) {
          pos[i*3+1] += delta * speed * 5; // move up
          if (pos[i*3+1] > 5) { // reset to bottom
              pos[i*3+1] = 0;
              pos[i*3] = (Math.random()-0.5) * 1.5;
              pos[i*3+2] = (Math.random()-0.5) * 1.5;
          }
          // taper at top
          const width = 1.0 - (pos[i*3+1] / 5);
          pos[i*3] *= width > 0 ? 0.95 : 0;
          pos[i*3+2] *= width > 0 ? 0.95 : 0;
      }
      flameGeo.attributes.position.needsUpdate = true;
      
      glow.scale.setScalar(1 + Math.sin(time*speed*10)*0.05);
  };

  return {
    group: group,
    description: "Macroscopic Flame Test (Remastered). If you dissolve a Lithium salt (like Lithium Chloride) in water, dip a metal wire into it, and hold it over a Bunsen burner, the blue flame instantly turns a brilliant, deep Crimson Red! The intense heat of the fire excites the valence electron in the Lithium atoms. When the electron falls back to its ground state, it releases that extra energy as a 670.8 nm red photon. Because millions of atoms are doing this simultaneously, the entire fire glows red! This is exactly how red fireworks are made.",
    parts: [
      { name: "Crimson Flame", material: "Red Photons", function: "Emitted as excited Lithium electrons fall back to their ground state." },
      { name: "Metal Loop", material: "Nichrome Wire", function: "Used to hold the Lithium salt in the hottest part of the flame." }
    ],
    quizQuestions: [
      { question: "If you want to make a red firework, which element's salts should you use?", options: ["Copper", "Lithium", "Sodium", "Iron"], correct: 1, explanation: "Lithium compounds are the primary ingredient used in pyrotechnics to create deep red colors!" }
    ]
  };
}