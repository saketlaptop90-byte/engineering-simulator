import * as THREE from 'three';
export function createBoronShielding() {
  const group = new THREE.Group();
  
  // Neutron Shielding (Boron Carbide wall stopping radiation)
  
  // The Shield Wall (Boron Carbide)
  const wall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 6, 6),
      new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.9, roughness: 0.2, clearcoat: 0.5})
  );
  group.add(wall);
  
  // Grid pattern on wall to make it look technical
  const grid = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 6.05, 6.05),
      new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.2})
  );
  group.add(grid);

  // Incoming Neutrons (Green bullets)
  const neutrons = new THREE.Group();
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x00ff00, emissive: 0x004400});
  for(let i=0; i<20; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), nMat);
      // store random offset and speed
      n.userData = {
          y: (Math.random()-0.5)*5,
          z: (Math.random()-0.5)*5,
          offset: Math.random() * 5,
          speed: Math.random() * 5 + 5
      };
      neutrons.add(n);
  }
  group.add(neutrons);
  
  // Impact flashes (Lithium/Alpha particle debris)
  const flashes = new THREE.Group();
  const fMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending});
  for(let i=0; i<20; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), fMat);
      flashes.add(f);
  }
  group.add(flashes);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(-5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.z = 0.2;
      
      neutrons.children.forEach((n, idx) => {
          const t = (time * speed * n.userData.speed + n.userData.offset) % 10;
          
          // Neutrons fly from right to left (x = 10 to x = 0)
          const posX = 10 - t * 4;
          n.position.set(posX, n.userData.y, n.userData.z);
          
          const flash = flashes.children[idx];
          
          // Impact at x = 0.5 (surface of the wall)
          if (posX <= 0.5 && posX > -1) {
              n.visible = false; // Neutron is ABSORBED by Boron
              
              // Flash and generate debris (Alpha particles)
              flash.position.set(0.5, n.userData.y, n.userData.z);
              flash.material.opacity = 1 - Math.abs(posX); // fade out quickly
              
          } else if (posX <= -1) {
              // Resetting for next loop
              n.visible = false;
              flash.material.opacity = 0;
          } else {
              n.visible = true; // flying
              flash.material.opacity = 0;
          }
      });
  };

  return {
    group: group,
    description: "Nuclear Neutron Shielding (Boron Carbide). Inside a nuclear reactor, splitting uranium atoms release a deadly barrage of high-speed neutrons. You need something to absorb them before they escape. Enter Boron! Because Boron-10 has a massive 'neutron capture cross section', it acts like a giant catcher's mitt for neutrons. Nuclear control rods and shielding walls are made of Boron Carbide. When a neutron hits the wall, the Boron safely absorbs it, instantly destroying the neutron and halting the nuclear chain reaction!",
    parts: [
      { name: "Black Wall", material: "Boron Carbide (B4C)", function: "The ultra-hard, heat-resistant neutron catcher." },
      { name: "Green Bullets", material: "Nuclear Radiation (Neutrons)", function: "Deadly particles flying out of the reactor." },
      { name: "White Flashes", material: "Neutron Capture", function: "The Boron absorbing the neutron so it cannot pass through the wall." }
    ],
    quizQuestions: [
      { question: "Why are nuclear reactor control rods and shielding walls made of Boron?", options: ["Because Boron is very heavy", "Because Boron acts like a giant 'catcher's mitt' and safely absorbs flying neutrons, stopping the nuclear chain reaction.", "Because Boron cools down the water", "Because Boron is radioactive"], correct: 1, explanation: "Without Boron or Cadmium to absorb the flying neutrons, a nuclear reactor would spiral out of control and melt down. Boron is the ultimate brakes for a nuclear reactor!" }
    ]
  };
}