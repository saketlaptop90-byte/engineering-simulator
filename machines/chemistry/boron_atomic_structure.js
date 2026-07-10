import * as THREE from 'three';

export function createBoronAtomicStructure() {
  const group = new THREE.Group();
  
  // Nucleus: 5 Protons (Red), 6 Neutrons (Blue)
  const nucleus = new THREE.Group();
  const pGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const nGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const pMat = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.5});
  const nMat = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0.5});
  
  for(let i=0; i<11; i++) {
      const isProton = i < 5;
      const particle = new THREE.Mesh(isProton ? pGeo : nGeo, isProton ? pMat : nMat);
      // Tightly pack them
      particle.position.set((Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2);
      nucleus.add(particle);
  }
  group.add(nucleus);

  // Electron shells (K=2, L=3)
  const eGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const eMat = new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0x444400});
  
  const innerShell = new THREE.Group();
  for(let i=0; i<2; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      e.position.set(Math.cos(i*Math.PI)*2.5, 0, Math.sin(i*Math.PI)*2.5);
      innerShell.add(e);
  }
  
  const outerShell = new THREE.Group();
  for(let i=0; i<3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const e = new THREE.Mesh(eGeo, eMat);
      e.position.set(Math.cos(angle)*5, 0, Math.sin(angle)*5);
      outerShell.add(e);
  }
  
  // Orbit tracks
  const trackMat = new THREE.LineBasicMaterial({color: 0x444444, transparent: true, opacity: 0.5});
  const t1 = new THREE.LineLoop(new THREE.CircleGeometry(2.5, 64).attributes.position, trackMat); t1.rotation.x = Math.PI/2; group.add(t1);
  const t2 = new THREE.LineLoop(new THREE.CircleGeometry(5, 64).attributes.position, trackMat); t2.rotation.x = Math.PI/2; group.add(t2);

  group.add(innerShell);
  group.add(outerShell);

  group.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light = new THREE.PointLight(0xffffff, 1.5, 20);
  group.add(light);

  group.userData.animate = function(delta, time) {
      nucleus.rotation.x += delta * 0.2;
      nucleus.rotation.y += delta * 0.3;
      
      innerShell.rotation.y += delta * 1.5;
      outerShell.rotation.y -= delta * 0.8; // outer orbits slower
      
      group.rotation.x = Math.sin(time * 0.5) * 0.2; // subtle tilt
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "Atomic Mass": "10.81",
    "Category": "Metalloid",
    "Atomic Structure": "Boron has 5 protons and usually 6 neutrons (B-11 is most common). It has 5 electrons: 2 in the inner 1s shell, and 3 valence electrons (2s2 2p1).",
    "Bohr Model": "Shows a central nucleus with 2 electrons in the first (K) shell and 3 electrons in the second (L) shell orbiting in rigid circular paths.",
    "Rutherford Model": "Demonstrates a tiny, dense, positively charged nucleus with 5 electrons buzzing around it in random, intersecting orbits like a swarm of bees.",
    "Thomson Model": "The 'Plum Pudding' model, where 5 negatively charged electron 'plums' are embedded in a diffuse sphere of positive charge.",
    "Quantum Model": "The modern view: Electrons don't have exact orbits. Instead, they exist in 3D probability clouds (two spherical 's' orbitals and one dumbbell-shaped 'p' orbital)."
  };

  return group;
}
