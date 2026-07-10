import * as THREE from 'three';

export function createBerylliumCoreElectrons() {
  const group = new THREE.Group();
  
  // Inverse of previous: highlight the core, make valence a ghost
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Glowing Core Shell
  const coreShell = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshPhysicalMaterial({color: 0xffaa00, transparent: true, opacity: 0.6, emissive: 0x552200, side: THREE.DoubleSide}));
  group.add(coreShell);
  
  // Ghost Valence Shell
  const valShell = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({color: 0x222222, transparent: true, opacity: 0.1, wireframe: true}));
  group.add(valShell);
  
  // Core electrons (vivid)
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffaa00}));
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffaa00}));
  group.add(c1); group.add(c2);
  
  // Shield visualization - show particles bouncing off the core (shielding)
  const photons = [];
  const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({color: 0xff00ff});
  for(let i=0; i<5; i++) {
      const p = new THREE.Mesh(pGeo, pMat);
      group.add(p);
      photons.push({mesh: p, angle: Math.random()*Math.PI*2, r: 4});
  }

  const light = new THREE.PointLight(0xffffff, 2, 10);
  group.add(light);

  group.userData.animate = function(delta, time) {
      coreShell.rotation.y += delta * 0.5;
      
      // Orbit core
      c1.position.set(Math.cos(time*3)*1.5, Math.sin(time*3)*1.5, 0);
      c2.position.set(Math.cos(time*3+Math.PI)*1.5, Math.sin(time*3+Math.PI)*1.5, 0);
      
      // Bouncing shielding effect
      photons.forEach(p => {
          p.r -= delta * 3; // move inward
          if(p.r < 1.5) p.r = 4; // bounce off core
          p.mesh.position.set(Math.cos(p.angle)*p.r, Math.sin(p.angle)*p.r, 0);
      });
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Orbital Filling Sequence": "Follows the Aufbau principle: 1s -> 2s. The 1s subshell fills completely with 2 electrons before the 2s subshell begins filling.",
    "Valence Electrons": "2 electrons in the outermost 2s shell. These participate in chemical bonding.",
    "Core Electrons": "2 electrons tightly bound in the 1s shell. They do not participate in bonding and strongly shield the nucleus.",
    "Atomic Radius": "105 pm (Empirical). The distance from the center of the nucleus to the boundary of the surrounding electron cloud.",
    "Ionic Radius": "45 pm (for Be2+). When Beryllium loses its 2 valence electrons, the remaining 1s shell is pulled much closer by the +4 nuclear charge, shrinking the radius dramatically."
  };

  return group;
}
