import * as THREE from 'three';
export function createBoronElectrons() {
  const group = new THREE.Group();
  
  // The 5 Electrons (Remastered)
  
  // Beautiful dark center (nucleus implied)
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x000000}));
  group.add(center);

  // We will build orbital rings that are semi-transparent and metallic
  const createShell = (radius, color) => {
      const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.05, 16, 100),
          new THREE.MeshPhysicalMaterial({color: color, metalness: 1.0, roughness: 0.1, clearcoat: 1.0, transparent: true, opacity: 0.3})
      );
      group.add(ring);
      return ring;
  };
  
  const ring1 = createShell(1.5, 0x00ffff); // 1s
  const ring2 = createShell(3.0, 0xff00ff); // 2s
  const ring3 = createShell(3.0, 0x00ff00); // 2p
  ring3.rotation.x = Math.PI/2;
  
  // Highly detailed electrons
  const eMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2});
  const electrons = [];
  
  const createE = (radius, speed, offset, ring) => {
      const eGrp = new THREE.Group();
      
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), eMat);
      eGrp.add(e);
      
      // Lens flare / Glow
      const glow = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({
              map: new THREE.CanvasTexture(generateGlow()), 
              transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
          })
      );
      eGrp.add(glow);
      
      group.add(eGrp);
      electrons.push({grp: eGrp, radius, speed, offset, ring, glow});
  };
  
  // Generate a procedural glow texture
  function generateGlow() {
      const canvas = document.createElement('canvas');
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64,64,0, 64,64,64);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      grad.addColorStop(0.5, 'rgba(0,100,255,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,128,128);
      return canvas;
  }
  
  createE(1.5, 3.0, 0, ring1); // 1s
  createE(1.5, 3.0, Math.PI, ring1); // 1s
  
  createE(3.0, 1.5, 0, ring2); // 2s
  createE(3.0, 1.5, Math.PI, ring2); // 2s
  
  createE(3.0, 1.2, 0, ring3); // 2p (alone)

  group.userData.animate = function(delta, time, speed, camera) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = time * speed * 0.1;
      
      electrons.forEach(e => {
          const t = time * speed * e.speed + e.offset;
          
          // Move along the designated ring
          const pos = new THREE.Vector3(Math.cos(t)*e.radius, Math.sin(t)*e.radius, 0);
          pos.applyEuler(e.ring.rotation);
          
          e.grp.position.copy(pos);
          
          // Make glow face camera (billboarding)
          if(camera) {
              e.glow.quaternion.copy(camera.quaternion);
              // negate group rotation so it stays facing camera perfectly
              e.glow.quaternion.multiply(group.quaternion.clone().invert());
          }
      });
  };

  return {
    group: group,
    description: "The 5 Electrons (Remastered). An ultra-high-quality visualization of Boron's electron architecture. The orbits are rendered as highly reflective metallic tracks. The electrons themselves are intensely glowing points of light (using procedural lens flares). Notice the beautiful symmetry: 2 electrons in the tight 1s inner track (cyan), 2 electrons in the wider 2s track (magenta), and 1 lonely electron occupying the perpendicular 2p track (green). This single, lonely electron is the primary reason Boron is so highly reactive!",
    parts: [
      { name: "Cyan Track", material: "1s Orbital", function: "The lowest energy core electrons." },
      { name: "Magenta Track", material: "2s Orbital", function: "The first two valence electrons." },
      { name: "Green Track", material: "2p Orbital", function: "The single highest-energy valence electron." },
      { name: "Glowing Orbs", material: "Electrons", function: "Zipping along their quantized pathways." }
    ],
    quizQuestions: [
      { question: "Why is the single electron in the green (2p) track primarily responsible for Boron's reactivity?", options: ["Because it is green", "Because it is the highest energy and furthest from the nucleus, making it the easiest to share or lose in chemical bonds", "Because it moves the slowest", "Because it is radioactive"], correct: 1, explanation: "Reactivity is dictated by the outermost, highest-energy electrons. Since the 2p electron is the highest, it is the 'frontline soldier' in chemical reactions!" }
    ]
  };
}