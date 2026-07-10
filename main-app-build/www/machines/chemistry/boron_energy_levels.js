import * as THREE from 'three';
export function createBoronEnergyLevels() {
  const group = new THREE.Group();
  
  // Energy Levels (Upgraded to Neon Staircase with Photon Emission)
  
  const stairs = new THREE.Group();
  group.add(stairs);
  
  // The 'Nucleus' at the bottom
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, emissive: 0x440000}));
  core.position.y = -4;
  stairs.add(core);
  
  // The stairs (Energy Levels)
  const createLevel = (y, radius, color, label) => {
      const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.1, 16, 64),
          new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
      );
      ring.rotation.x = Math.PI/2;
      ring.position.y = y;
      
      const plane = new THREE.Mesh(
          new THREE.RingGeometry(radius-0.2, radius+0.2, 32),
          new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, side: THREE.DoubleSide})
      );
      plane.rotation.x = Math.PI/2;
      plane.position.y = y;
      
      stairs.add(ring, plane);
      return y;
  };
  
  // n=1 (Ground State)
  const y1 = createLevel(-2, 2, 0x00ffff, "n=1");
  // n=2 (Valence)
  const y2 = createLevel(1, 3, 0xff00ff, "n=2");
  // n=3 (Excited)
  const y3 = createLevel(4, 4, 0x00ff00, "n=3");

  // The Electron that jumps
  const electron = new THREE.Group();
  const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const eGlow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending}));
  electron.add(eMesh, eGlow);
  group.add(electron);
  
  // The photon particle system
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(30 * 3); // 10 photons (each is a triangle)
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending});
  // Use points for photon burst
  const photons = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(50*3), 3)),
      new THREE.PointsMaterial({color: 0x00ff00, size: 0.2, transparent: true, blending: THREE.AdditiveBlending})
  );
  group.add(photons);
  
  let jumpState = 0; // 0 = resting, 1 = absorbing, 2 = excited, 3 = falling (emitting)

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed) % 6; // 6 second loop
      
      let eY = y2; // default resting at n=2 (Valence for Boron)
      let radius = 3;
      
      if (cycle < 1) {
          // Resting at n=2
          eY = y2;
          radius = 3;
          photons.material.opacity = 0;
      } else if (cycle < 1.5) {
          // Absorbing energy, jumping to n=3!
          const t = (cycle - 1) / 0.5; // 0 to 1
          eY = THREE.MathUtils.lerp(y2, y3, t);
          radius = THREE.MathUtils.lerp(3, 4, t);
          eGlow.material.color.setHex(0x00ff00); // changes color
      } else if (cycle < 3.5) {
          // Resting at excited state n=3
          eY = y3;
          radius = 4;
      } else if (cycle < 4.0) {
          // Falling back down to n=2!
          const t = (cycle - 3.5) / 0.5; // 0 to 1
          eY = THREE.MathUtils.lerp(y3, y2, t);
          radius = THREE.MathUtils.lerp(4, 3, t);
          
          if (t > 0.5) {
              // EMIT PHOTON
              photons.material.opacity = 1 - ((t-0.5)*2); // flash and fade
              const posAttr = photons.geometry.attributes.position.array;
              for(let i=0; i<50; i++) {
                  posAttr[i*3] = electron.position.x + (Math.random()-0.5)*5;
                  posAttr[i*3+1] = electron.position.y + (Math.random()-0.5)*5;
                  posAttr[i*3+2] = electron.position.z + (Math.random()-0.5)*5;
              }
              photons.geometry.attributes.position.needsUpdate = true;
          }
      } else {
          // Back at n=2
          eY = y2;
          radius = 3;
          eGlow.material.color.setHex(0xff00ff);
      }
      
      // Orbit around the center
      const angle = time * speed * 2;
      electron.position.set(Math.cos(angle)*radius, eY, Math.sin(angle)*radius);
  };

  return {
    group: group,
    description: "Quantum Energy Levels (Upgraded). Unlike a ramp, where you can stand at any height, atoms have 'Energy Levels' that act like a staircase. An electron can exist on step 1 or step 2, but it is physically impossible for it to exist in the empty space between the steps! This upgraded simulation shows a valence electron (at n=2) absorbing energy and 'Quantum Leaping' to the excited n=3 level. When it falls back down, it must release that exact amount of energy. It does this by firing off a photon (particle of light)!",
    parts: [
      { name: "Magenta Ring", material: "n=2 (Ground State)", function: "The normal resting level for Boron's valence electrons." },
      { name: "Green Ring", material: "n=3 (Excited State)", function: "A higher energy level." },
      { name: "Green Sparkles", material: "Photon Emission", function: "The exact energy difference between the steps, released as light." }
    ],
    quizQuestions: [
      { question: "What happens when an electron falls down the quantum staircase from a high level to a lower level?", options: ["It turns into a proton", "It vanishes forever", "It must release the exact energy difference between the steps, which it does by shooting out a photon (light)!", "It creates a black hole"], correct: 2, explanation: "This is exactly how neon lights, lasers, and fireworks work! You pump energy in to push electrons up the stairs, and they release light as they fall back down." }
    ]
  };
}