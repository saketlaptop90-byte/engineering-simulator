import * as THREE from 'three';
export function createBoronBohr() {
  const group = new THREE.Group();
  
  // Bohr Model (Upgraded to Neon/Planetary precision)
  
  const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff0000, emissive: 0x440000, clearcoat: 1.0, roughness: 0.1})
  );
  group.add(core);

  // Neon glowing tracks
  const createTrack = (radius) => {
      const track = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.02, 16, 100),
          new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
      );
      track.rotation.x = Math.PI/2;
      group.add(track);
  };
  createTrack(2);
  createTrack(4);

  // Electrons with intense glow and long procedural trails
  const electrons = [];
  const createElectron = (radius, speed, angleOffset, color) => {
      const eGrp = new THREE.Group();
      
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
      eGrp.add(e);
      
      // Intense glow
      const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 32, 32),
          new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending})
      );
      eGrp.add(glow);
      
      // Trail
      const trailGeo = new THREE.BufferGeometry();
      const trailLen = 60;
      const tPos = new Float32Array(trailLen * 3);
      trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
      const trailMat = new THREE.LineBasicMaterial({color: color, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending});
      const trail = new THREE.Line(trailGeo, trailMat);
      group.add(trail);
      
      group.add(eGrp);
      electrons.push({grp: eGrp, radius, speed, offset: angleOffset, trail, tPos, history: []});
  };
  
  createElectron(2, 4.0, 0, 0x00ffff);
  createElectron(2, 4.0, Math.PI, 0x00ffff);
  
  createElectron(4, 2.0, 0, 0xff00ff);
  createElectron(4, 2.0, Math.PI*2/3, 0xff00ff);
  createElectron(4, 2.0, Math.PI*4/3, 0xff00ff);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.4;
      
      electrons.forEach(e => {
          const t = time * speed * e.speed + e.offset;
          const pos = new THREE.Vector3(Math.cos(t)*e.radius, 0, Math.sin(t)*e.radius);
          e.grp.position.copy(pos);
          
          // Update trail
          e.history.unshift(pos.clone());
          if (e.history.length > 60) e.history.pop();
          
          for(let i=0; i<60; i++) {
              const pt = e.history[i] || pos;
              e.tPos[i*3] = pt.x;
              e.tPos[i*3+1] = pt.y;
              e.tPos[i*3+2] = pt.z;
          }
          e.trail.geometry.attributes.position.needsUpdate = true;
          // Fade trail opacity based on time
          e.trail.material.opacity = 0.5 + Math.sin(time*speed*10)*0.2;
      });
  };

  return {
    group: group,
    description: "Bohr Planetary Model (1913) - Upgraded. Niels Bohr proposed that electrons fly around the nucleus in perfect, strict circles, much like planets orbiting the sun. While we know today that this is physically incorrect (electrons actually form fuzzy probability clouds), the Bohr model remains incredibly useful for understanding energy levels. This upgraded simulation features neon energy tracks and high-precision orbital contrails. Notice that Boron has exactly 2 electrons in its first ring (n=1) and 3 electrons in its second ring (n=2).",
    parts: [
      { name: "Neon Cyan Track", material: "n=1 Orbit", function: "The lowest energy state." },
      { name: "Neon Magenta Track", material: "n=2 Orbit", function: "The higher energy state." }
    ],
    quizQuestions: [
      { question: "Why is the Bohr model technically incorrect, despite being taught in schools?", options: ["Because atoms are square", "Because electrons don't move", "Because Heisenberg's Uncertainty Principle proves electrons don't travel in perfectly defined circular tracks; they exist as probability clouds.", "Because Bohr didn't know about protons"], correct: 2, explanation: "You can never know the exact position and momentum of an electron at the same time. Therefore, perfect circular tracks are a physical impossibility!" }
    ]
  };
}