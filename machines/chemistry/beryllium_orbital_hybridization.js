import * as THREE from 'three';

export function createBerylliumOrbitalHybridization() {
  const group = new THREE.Group();
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})));

  // Hybridization: 2s + 2p(x) -> Two sp hybrid orbitals (180 degrees apart)
  const createHybridLobe = (color, rotZ) => {
      const lobeGroup = new THREE.Group();
      
      // Major lobe
      const majorGeo = new THREE.SphereGeometry(1.5, 32, 32);
      majorGeo.translate(1.5, 0, 0);
      majorGeo.scale(1.2, 0.6, 0.6);
      const major = new THREE.Mesh(majorGeo, new THREE.MeshPhysicalMaterial({color: color, transparent: true, opacity: 0.5, transmission: 0.5}));
      lobeGroup.add(major);
      
      // Minor lobe (opposite side)
      const minorGeo = new THREE.SphereGeometry(0.5, 16, 16);
      minorGeo.translate(-0.5, 0, 0);
      minorGeo.scale(0.8, 0.5, 0.5);
      const minor = new THREE.Mesh(minorGeo, new THREE.MeshPhysicalMaterial({color: color, transparent: true, opacity: 0.2, transmission: 0.5}));
      lobeGroup.add(minor);
      
      lobeGroup.rotation.z = rotZ;
      return lobeGroup;
  };

  const sp1 = createHybridLobe(0xff0055, 0); // Points right
  const sp2 = createHybridLobe(0x0055ff, Math.PI); // Points left
  
  group.add(sp1);
  group.add(sp2);

  // Add a ghostly ring for the unhybridized 2py and 2pz orbitals (empty)
  const unhybridGeo = new THREE.TorusGeometry(2, 0.5, 16, 64);
  const unhybridMat = new THREE.MeshBasicMaterial({color: 0x555555, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending});
  const unhybrid = new THREE.Mesh(unhybridGeo, unhybridMat);
  unhybrid.rotation.y = Math.PI/2;
  group.add(unhybrid);

  group.userData.animate = function(delta, time) {
      group.rotation.x += delta * 0.2;
      group.rotation.y += delta * 0.3;
      
      sp1.children[0].scale.setScalar(1 + Math.sin(time*4)*0.05);
      sp2.children[0].scale.setScalar(1 + Math.sin(time*4)*0.05);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Orbital Overlap": "In metallic Be, atomic orbitals overlap to form continuous delocalized bands.",
    "Orbital Hybridization": "To form bonds (e.g., BeCl2), the 2s electron is promoted to 2p, forming two linear sp hybrid orbitals (180°).",
    "Electron Spin (ms)": "Intrinsic angular momentum. In each orbital (1s, 2s), electrons must pair with opposite spins (+1/2, -1/2).",
    "Pauli Exclusion Principle": "No two electrons in a Be atom can have the same four quantum numbers (n, l, ml, ms). Thus, a maximum of 2 electrons per orbital with opposite spins.",
    "Hund's Rule": "States that for degenerate orbitals (like 2p), electrons fill singly first. Since Be's ground state has empty 2p orbitals, Hund's rule applies during excitation/hybridization."
  };

  return group;
}
