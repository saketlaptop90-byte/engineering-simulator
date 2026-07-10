import * as THREE from 'three';

export function createBerylliumSOrbitals() {
  const group = new THREE.Group();
  
  // High fidelity visualization of the 2s orbital node
  // Inner positive lobe, radial node (empty), outer negative lobe (quantum phase)
  const innerGeo = new THREE.SphereGeometry(1, 32, 32);
  const innerMat = new THREE.MeshPhysicalMaterial({ color: 0xff4444, transparent: true, opacity: 0.6, transmission: 0.5, side: THREE.DoubleSide });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);
  
  // Node gap between 1 and 2
  
  const outerGeo = new THREE.SphereGeometry(3, 32, 32);
  // Using blue to represent opposite wave phase of 2s orbital
  const outerMat = new THREE.MeshPhysicalMaterial({ color: 0x4444ff, transparent: true, opacity: 0.3, transmission: 0.8, side: THREE.DoubleSide });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  group.add(outer);

  // Nucleus
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  // Add thousands of points floating inside to simulate probability density gas
  const ptsCount = 10000;
  const ptsGeo = new THREE.BufferGeometry();
  const ptsPos = new Float32Array(ptsCount * 3);
  
  for(let i=0; i<ptsCount; i++) {
      let r = Math.random() < 0.2 ? Math.random()*0.9 : 2 + Math.random(); // Avoid node
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      ptsPos[i*3] = r * Math.sin(phi)*Math.cos(theta);
      ptsPos[i*3+1] = r * Math.sin(phi)*Math.sin(theta);
      ptsPos[i*3+2] = r * Math.cos(phi);
  }
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPos, 3));
  const ptsMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.02, transparent: true, opacity: 0.3});
  const pts = new THREE.Points(ptsGeo, ptsMat);
  group.add(pts);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.15;
      group.rotation.z = Math.sin(time*0.5)*0.1;
      
      // Pulse phases
      inner.scale.setScalar(1 + Math.sin(time*4)*0.02);
      outer.scale.setScalar(1 - Math.sin(time*4)*0.01);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Energy Levels (n)": "Principal quantum number n=1 (K shell) has 2 electrons, n=2 (L shell) has 2 electrons.",
    "Subshells (l)": "s subshells (l=0) are spherical. Beryllium has filled 1s and 2s subshells. It has empty 2p subshells available for hybridization.",
    "s Orbitals": "Symmetric and spherical. The 2s orbital has a radial node.",
    "p Orbitals": "Dumbbell shaped along x, y, z axes. Beryllium's 2p orbitals are formally empty but participate in metallic bonding and hybridization (sp, sp2, sp3).",
    "d Orbitals": "Complex clover shapes. Empty and high energy for Beryllium (3d), but conceptually relevant for understanding atomic structure progression."
  };

  return group;
}
