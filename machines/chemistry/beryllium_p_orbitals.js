import * as THREE from 'three';

export function createBerylliumPOrbitals() {
  const group = new THREE.Group();
  
  // Beryllium has empty 2p orbitals. We will visualize them as ghostly/holographic dumbbells
  const createDumbbell = (color, rotX, rotY, rotZ) => {
      const db = new THREE.Group();
      
      const lobeGeo = new THREE.SphereGeometry(1.2, 32, 32);
      lobeGeo.scale(1, 1.5, 1);
      
      const matPositive = new THREE.MeshPhysicalMaterial({ color: color, transparent: true, opacity: 0.2, transmission: 0.9, depthWrite: false });
      const matNegative = new THREE.MeshPhysicalMaterial({ color: 0x555555, transparent: true, opacity: 0.2, transmission: 0.9, depthWrite: false });
      
      const lobe1 = new THREE.Mesh(lobeGeo, matPositive);
      lobe1.position.y = 1.6;
      db.add(lobe1);
      
      const lobe2 = new THREE.Mesh(lobeGeo, matNegative);
      lobe2.position.y = -1.6;
      db.add(lobe2);
      
      db.rotation.set(rotX, rotY, rotZ);
      return db;
  };

  const px = createDumbbell(0xff0000, 0, 0, Math.PI/2);
  const py = createDumbbell(0x00ff00, 0, 0, 0);
  const pz = createDumbbell(0x0000ff, Math.PI/2, 0, 0);
  
  group.add(px);
  group.add(py);
  group.add(pz);
  
  // Add 2s orbital sphere in the center (filled)
  const s2Geo = new THREE.SphereGeometry(1, 32, 32);
  const s2Mat = new THREE.MeshPhysicalMaterial({ color: 0xffff00, transparent: true, opacity: 0.4 });
  const s2 = new THREE.Mesh(s2Geo, s2Mat);
  group.add(s2);

  // Label "Empty 2p" in 3D logic: we'll pulse the p-orbitals to show they are available for hybridization
  
  group.userData.animate = function(delta, time) {
      group.rotation.x += delta * 0.2;
      group.rotation.y += delta * 0.3;
      
      // Pulse opacity of empty p orbitals
      const p = (Math.sin(time*2) + 1)/2 * 0.2 + 0.1;
      px.children.forEach(c => c.material.opacity = p);
      py.children.forEach(c => c.material.opacity = p);
      pz.children.forEach(c => c.material.opacity = p);
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
