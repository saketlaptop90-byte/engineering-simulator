import * as THREE from 'three';

export function createBerylliumElectronElectronRepulsion() {
  const group = new THREE.Group();
  
  // Nucleus
  const nucGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  // Electrons
  const electronGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // 1s
  const valMat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // 2s
  
  const electrons = [
      { mesh: new THREE.Mesh(electronGeo, coreMat), radius: 2, angle: 0, speed: 1.5, type: 'core' },
      { mesh: new THREE.Mesh(electronGeo, coreMat), radius: 2, angle: Math.PI, speed: 1.5, type: 'core' },
      { mesh: new THREE.Mesh(electronGeo, valMat), radius: 5, angle: Math.PI/2, speed: 0.8, type: 'val' },
      { mesh: new THREE.Mesh(electronGeo, valMat), radius: 5, angle: -Math.PI/2, speed: 0.8, type: 'val' }
  ];

  electrons.forEach(e => group.add(e.mesh));

  // Dynamic repulsion lines between all electrons
  const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
  const lines = [];

  for(let i=0; i<electrons.length; i++) {
      for(let j=i+1; j<electrons.length; j++) {
          const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
          const line = new THREE.Line(geo, lineMat);
          group.add(line);
          lines.push({ e1: electrons[i], e2: electrons[j], line: line });
      }
  }

  // Shockwave rings emitted between repelling pairs
  const ringGeo = new THREE.RingGeometry(0.1, 0.2, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const shockwaves = [];
  
  for(let i=0; i<10; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);
      shockwaves.push({ mesh: ring, active: false, t: 0, p1: null, p2: null });
  }

  group.userData.animate = function(delta, time) {
      electrons.forEach(e => {
          e.angle += delta * e.speed;
          e.mesh.position.set(Math.cos(e.angle)*e.radius, 0, Math.sin(e.angle)*e.radius);
      });

      lines.forEach(l => {
          const p1 = l.e1.mesh.position;
          const p2 = l.e2.mesh.position;
          l.line.geometry.attributes.position.array[0] = p1.x;
          l.line.geometry.attributes.position.array[1] = p1.y;
          l.line.geometry.attributes.position.array[2] = p1.z;
          l.line.geometry.attributes.position.array[3] = p2.x;
          l.line.geometry.attributes.position.array[4] = p2.y;
          l.line.geometry.attributes.position.array[5] = p2.z;
          l.line.geometry.attributes.position.needsUpdate = true;
          
          // Randomly trigger shockwaves between close electrons
          if(p1.distanceTo(p2) < 4 && Math.random() < 0.05) {
              const sw = shockwaves.find(s => !s.active);
              if(sw) {
                  sw.active = true;
                  sw.t = 0;
                  sw.p1 = p1.clone();
                  sw.p2 = p2.clone();
                  sw.mesh.position.copy(p1).lerp(p2, 0.5); // midpoint
                  sw.mesh.lookAt(p1);
              }
          }
      });

      shockwaves.forEach(sw => {
          if(sw.active) {
              sw.t += delta * 2;
              sw.mesh.scale.setScalar(1 + sw.t * 5);
              sw.mesh.material.opacity = 1 - sw.t;
              if(sw.t >= 1) {
                  sw.active = false;
                  sw.mesh.material.opacity = 0;
              }
          }
      });
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Core Electrons": "2 (1s²)",
    "Valence Electrons": "2 (2s²)",
    "Shielding Effect": "The two inner 1s electrons strongly shield the two outer 2s electrons from the full +4 nuclear charge.",
    "Effective Nuclear Charge (Z_eff)": "Calculated via Slater's rules: Z_eff = Z - S ≈ 4 - 2.05 = +1.95 for the 2s valence electrons.",
    "Nuclear Attraction": "The Strong Nuclear Force binds the 4 protons and 5 neutrons (Be-9) together tightly, overcoming proton-proton electrostatic repulsion.",
    "Electron Repulsion": "Valence electrons (2s) repel each other and are repelled by the core electrons (1s)."
  };

  return group;
}
