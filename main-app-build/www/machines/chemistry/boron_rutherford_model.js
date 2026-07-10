import * as THREE from 'three';
export function createBoronRutherford() {
  const group = new THREE.Group();
  
  // Rutherford Model (Upgraded - Chaotic Physics Orbitals)
  
  // The dense central nucleus (Blindingly bright)
  const coreGrp = new THREE.Group();
  const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffaaaa, emissive: 0xff0000, emissiveIntensity: 2})
  );
  coreGrp.add(core);
  
  const light = new THREE.PointLight(0xff0000, 5, 20);
  coreGrp.add(light);
  group.add(coreGrp);

  // 5 Electrons in chaotic, intersecting orbits
  const electrons = [];
  const eMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2});
  
  for(let i=0; i<5; i++) {
      const eGrp = new THREE.Group();
      
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), eMat);
      eGrp.add(e);
      
      // Intense glow
      const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 32, 32),
          new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
      );
      eGrp.add(glow);
      
      // Infinite fading trail
      const trailGeo = new THREE.BufferGeometry();
      const trailLen = 100;
      const tPos = new Float32Array(trailLen * 3);
      trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
      const trailMat = new THREE.LineBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending});
      const trail = new THREE.Line(trailGeo, trailMat);
      group.add(trail);
      
      // Random orbital parameters
      const radiusX = Math.random() * 2 + 2;
      const radiusZ = Math.random() * 2 + 2;
      const speedParam = Math.random() * 2 + 3;
      const offset = Math.random() * Math.PI * 2;
      
      // Random tilt axis
      const tiltAxis = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
      
      group.add(eGrp);
      electrons.push({grp: eGrp, rx: radiusX, rz: radiusZ, speed: speedParam, offset, tiltAxis, trail, tPos, history: []});
  }

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
      
      coreGrp.scale.setScalar(1 + Math.sin(time*speed*10)*0.1);
      
      electrons.forEach(e => {
          const t = time * speed * e.speed + e.offset;
          
          // Elliptical orbit
          const pos = new THREE.Vector3(Math.cos(t)*e.rx, 0, Math.sin(t)*e.rz);
          
          // Apply tilt
          pos.applyAxisAngle(e.tiltAxis, Math.PI/4); // 45 degree tilt roughly
          
          // Precession (the orbit itself slowly rotates over time)
          pos.applyAxisAngle(new THREE.Vector3(0,1,0), time*speed*0.5);
          
          e.grp.position.copy(pos);
          
          // Update trail
          e.history.unshift(pos.clone());
          if (e.history.length > 100) e.history.pop();
          
          for(let i=0; i<100; i++) {
              const pt = e.history[i] || pos;
              e.tPos[i*3] = pt.x;
              e.tPos[i*3+1] = pt.y;
              e.tPos[i*3+2] = pt.z;
          }
          e.trail.geometry.attributes.position.needsUpdate = true;
          // Fade trail opacity based on time
          e.trail.material.opacity = 0.8 + Math.sin(time*speed*15)*0.2;
      });
  };

  return {
    group: group,
    description: "Rutherford Model (1911) - Upgraded. Ernest Rutherford fired radiation at gold foil and discovered that atoms aren't solid blobs. They have a tiny, blindingly dense core (the nucleus) surrounded by massive amounts of empty space! He imagined the electrons flying around this core in chaotic, intersecting elliptical orbits, much like a swarm of bees. This upgraded simulation calculates real-time precessing elliptical orbits with fading contrails. However, this model is fundamentally flawed: under classical physics, electrons moving this erratically would bleed off energy and crash into the nucleus in a fraction of a second!",
    parts: [
      { name: "Blinding Red Core", material: "The Nucleus", function: "The ultra-dense center of mass Rutherford discovered." },
      { name: "Cyan Contrails", material: "Chaotic Electron Swarm", function: "Flying erratically in the vast empty space of the atom." }
    ],
    quizQuestions: [
      { question: "Why did classical physicists realize Rutherford's model was impossible?", options: ["Because electrons are square", "Because it violated the speed of light", "Because accelerating charged particles emit radiation. The electrons would instantly lose all their energy and death-spiral into the nucleus, destroying the atom.", "Because atoms don't have nuclei"], correct: 2, explanation: "Rutherford discovered the nucleus, but his electron model was a physical impossibility! It took Niels Bohr introducing 'Quantum' mechanics (strict energy levels) to save the atom from collapsing." }
    ]
  };
}