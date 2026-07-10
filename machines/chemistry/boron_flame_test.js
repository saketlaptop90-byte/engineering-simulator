import * as THREE from 'three';
export function createBoronFlameTest() {
  const group = new THREE.Group();
  
  // Boron Green Flame Test
  
  // Bunsen Burner Nozzle
  const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
      new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 0.9, roughness: 0.4})
  );
  burner.position.y = -3;
  group.add(burner);
  
  // Flame Particle System
  const particleCount = 1000;
  const flameGeo = new THREE.BufferGeometry();
  const flamePos = new Float32Array(particleCount * 3);
  const flameLife = new Float32Array(particleCount); // 0 to 1
  
  for(let i=0; i<particleCount; i++) {
      flamePos[i*3] = (Math.random()-0.5);
      flamePos[i*3+1] = -2 + Math.random()*5; // Y position
      flamePos[i*3+2] = (Math.random()-0.5);
      flameLife[i] = Math.random();
  }
  
  flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
  flameGeo.setAttribute('life', new THREE.BufferAttribute(flameLife, 1));
  
  // Soft glowing texture
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32,32,0, 32,32,32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,64,64);
  const tex = new THREE.CanvasTexture(canvas);
  
  const flameMat = new THREE.PointsMaterial({
      map: tex,
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x00ff00 // Neon Green Boron Flame!
  });
  
  const flame = new THREE.Points(flameGeo, flameMat);
  group.add(flame);
  
  // Boron Powder falling in
  const powder = new THREE.Group();
  const pMat = new THREE.MeshBasicMaterial({color: 0x00ffff}); // Cyan powder
  for(let i=0; i<20; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pMat);
      p.userData = { offset: Math.random()*Math.PI*2, x: (Math.random()-0.5), z: (Math.random()-0.5) };
      powder.add(p);
  }
  group.add(powder);
  
  const light = new THREE.PointLight(0x00ff00, 2, 20);
  light.position.y = 1;
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Animate powder falling
      powder.children.forEach(p => {
          const t = ((time * speed * 2) + p.userData.offset) % 4;
          p.position.set(p.userData.x, 3 - t*2, p.userData.z); // falling down
          if (p.position.y < -1) p.visible = false; // melts/burns
          else p.visible = true;
      });
      
      // Animate Flame Particles flowing upward
      const posAttr = flameGeo.attributes.position;
      const lifeAttr = flameGeo.attributes.life;
      
      for(let i=0; i<particleCount; i++) {
          let y = posAttr.getY(i);
          let l = lifeAttr.getX(i);
          
          y += delta * speed * 4.0; // move up
          l -= delta * speed * 0.5; // age
          
          if (l <= 0 || y > 3) {
              // Reset particle at bottom
              y = -2;
              l = 1.0;
              posAttr.setX(i, (Math.random()-0.5)*0.5); // narrow at base
              posAttr.setZ(i, (Math.random()-0.5)*0.5);
          } else {
              // Expand as they rise
              const dx = posAttr.getX(i);
              const dz = posAttr.getZ(i);
              posAttr.setX(i, dx + (Math.random()-0.5)*0.05);
              posAttr.setZ(i, dz + (Math.random()-0.5)*0.05);
          }
          
          posAttr.setY(i, y);
          lifeAttr.setX(i, l);
      }
      posAttr.needsUpdate = true;
      lifeAttr.needsUpdate = true;
      
      // Flicker light
      light.intensity = 2 + Math.random()*0.5;
  };

  return {
    group: group,
    description: "The Boron Flame Test. If you want to find out if an unknown chemical contains Boron, you burn it! When Boron atoms are heated in a bunsen burner, their electrons absorb the thermal energy and jump to a higher orbital. When they instantly fall back down, they release that exact specific amount of energy as a photon of light. For Boron, the energy gap corresponds perfectly to a wavelength of 518 nanometers—which our eyes perceive as brilliant, neon Green! This is the exact same chemistry used to make green fireworks.",
    parts: [
      { name: "Cyan Dust", material: "Boron Powder", function: "Falling into the extreme heat of the bunsen burner." },
      { name: "Neon Green Flame", material: "Atomic Emission", function: "Electrons falling back down to their resting state and releasing green photons." }
    ],
    quizQuestions: [
      { question: "Why does Boron burn with a bright green flame?", options: ["Because it is radioactive", "When heated, its electrons jump to a higher energy level. When they fall back down, they release that exact amount of energy as green light (518 nm).", "Because it is made of copper", "Because it is melting"], correct: 1, explanation: "This is called the Atomic Emission Spectrum! Every element has a unique 'fingerprint' of light it emits when burned. Boron's is unmistakably green!" }
    ]
  };
}