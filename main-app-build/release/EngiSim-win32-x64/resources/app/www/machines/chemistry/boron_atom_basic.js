import * as THREE from 'three';
export function createBoronAtomBasic() {
  const group = new THREE.Group();
  
  // Ultra High Quality Boron Atom
  
  // 1. The Nucleus (Cluster of 11 nucleons)
  const nucleus = new THREE.Group();
  const protonMat = new THREE.MeshPhysicalMaterial({
      color: 0xff0033, metalness: 0.8, roughness: 0.2, clearcoat: 1.0, emissive: 0x330000
  });
  const neutronMat = new THREE.MeshPhysicalMaterial({
      color: 0xaaaaaa, metalness: 0.9, roughness: 0.4, clearcoat: 0.5
  });
  
  const nucleons = [];
  for(let i=0; i<11; i++) {
      const isProton = i < 5;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), isProton ? protonMat : neutronMat);
      
      // Random packed position
      const pos = new THREE.Vector3(
          (Math.random()-0.5)*0.8,
          (Math.random()-0.5)*0.8,
          (Math.random()-0.5)*0.8
      );
      if(pos.length() > 0.6) pos.normalize().multiplyScalar(0.6);
      
      mesh.position.copy(pos);
      nucleus.add(mesh);
      nucleons.push({mesh, orig: pos, phase: Math.random()*Math.PI*2});
  }
  group.add(nucleus);
  
  // Nuclear Glow
  const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending})
  );
  nucleus.add(glow);

  // 2. Electron Shells (Translucent Glassy Spheres)
  const innerShell = new THREE.Mesh(
      new THREE.SphereGeometry(2, 64, 64),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.1, ior: 1.1, side: THREE.DoubleSide})
  );
  group.add(innerShell);
  
  const outerShell = new THREE.Mesh(
      new THREE.SphereGeometry(4, 64, 64),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transmission: 0.98, opacity: 1, transparent: true, roughness: 0.1, ior: 1.05, side: THREE.DoubleSide})
  );
  group.add(outerShell);

  // 3. Electrons with Dynamic Trails
  const eMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  const electrons = [];
  
  const createElectron = (radius, speed, angleOffset, axis) => {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eMat);
      
      // Trail system using a BufferGeometry line
      const trailLen = 40;
      const tGeo = new THREE.BufferGeometry();
      const tPos = new Float32Array(trailLen * 3);
      tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
      const tMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
      const trail = new THREE.Line(tGeo, tMat);
      
      group.add(e, trail);
      electrons.push({mesh: e, trail, tPos, radius, speed, offset: angleOffset, axis, history: []});
  };
  
  // 2 Core electrons
  createElectron(2, 3.0, 0, new THREE.Vector3(0,1,0.2).normalize());
  createElectron(2, 3.1, Math.PI, new THREE.Vector3(0,1,-0.2).normalize());
  
  // 3 Valence electrons
  createElectron(4, 1.5, 0, new THREE.Vector3(1,0,0).normalize());
  createElectron(4, 1.4, Math.PI*2/3, new THREE.Vector3(0.5,0.866,0).normalize());
  createElectron(4, 1.6, Math.PI*4/3, new THREE.Vector3(0.5,-0.866,0).normalize());

  // Lighting
  const pLight = new THREE.PointLight(0xffddaa, 5, 20);
  group.add(pLight);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
      
      // Jiggle nucleons
      nucleons.forEach(n => {
          n.mesh.position.x = n.orig.x + Math.sin(time*speed*10 + n.phase)*0.05;
          n.mesh.position.y = n.orig.y + Math.cos(time*speed*12 + n.phase)*0.05;
          n.mesh.position.z = n.orig.z + Math.sin(time*speed*11 + n.phase)*0.05;
      });
      glow.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      pLight.intensity = 5 + Math.sin(time*speed*5)*2;
      
      // Animate electrons and trails
      electrons.forEach(e => {
          const t = time * speed * e.speed + e.offset;
          
          // Calculate pos
          const pos = new THREE.Vector3(Math.cos(t)*e.radius, 0, Math.sin(t)*e.radius);
          pos.applyAxisAngle(e.axis, Math.PI/2); // Tilt it
          e.mesh.position.copy(pos);
          
          // Update trail history
          e.history.unshift(pos.clone());
          if (e.history.length > 40) e.history.pop();
          
          for(let i=0; i<40; i++) {
              const pt = e.history[i] || pos;
              e.tPos[i*3] = pt.x;
              e.tPos[i*3+1] = pt.y;
              e.tPos[i*3+2] = pt.z;
          }
          e.trail.geometry.attributes.position.needsUpdate = true;
      });
  };

  return {
    group: group,
    description: "Boron Atom (Ultra High Quality). This is a completely upgraded physical simulation of the Boron atom. The 5 protons and 6 neutrons are rendered with highly reflective physical materials and undergo high-frequency quantum jitter in the core. The electron shells are no longer simple rings; they are fully 3D volumetric glass spheres (using IOR and Transmission mapping) to represent the inner 1s and outer 2s/2p shells. The 5 electrons streak through these shells leaving particle trails.",
    parts: [
      { name: "Ruby/Silver Core", material: "Nucleons", function: "5 Protons and 6 Neutrons bound by the strong force." },
      { name: "Cyan Glass Sphere", material: "Core Shell (1s)", function: "Holds 2 tightly bound electrons." },
      { name: "Magenta Glass Sphere", material: "Valence Shell (2s/2p)", function: "Holds the 3 reactive outer electrons." }
    ],
    quizQuestions: [
      { question: "Why is the outer magenta shell much larger than the inner cyan shell?", options: ["Because it has more protons", "Because higher energy levels (like n=2) extend further away from the nucleus than lower levels (n=1)", "Because it is melting", "Because the electrons are bigger"], correct: 1, explanation: "Electrons in higher shells possess more energy, which allows them to resist the pull of the nucleus and maintain an orbit that is further away." }
    ]
  };
}