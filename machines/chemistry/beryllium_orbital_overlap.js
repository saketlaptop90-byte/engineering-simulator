import * as THREE from 'three';

export function createBerylliumOrbitalOverlap() {
  const group = new THREE.Group();
  
  // Visualize two Be atoms overlapping their 2s orbitals
  const createAtom = (x) => {
      const atom = new THREE.Group();
      // Nucleus
      const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      atom.add(nuc);
      
      // 1s Core
      const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff5500, transparent: true, opacity: 0.8, side: THREE.DoubleSide}));
      atom.add(core);

      // 2s Orbital
      const val = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false}));
      atom.add(val);
      
      atom.position.x = x;
      return { group: atom, val: val };
  };

  const atom1 = createAtom(-2.5);
  const atom2 = createAtom(2.5);
  group.add(atom1.group);
  group.add(atom2.group);

  // The overlap region (interference) - visually highlight it
  // We can use an intersecting geometry or just a pulsing light/glow in the center
  const overlapGlowGeo = new THREE.SphereGeometry(1.5, 32, 32);
  overlapGlowGeo.scale(0.5, 2.5, 2.5);
  const overlapGlowMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending});
  const overlap = new THREE.Mesh(overlapGlowGeo, overlapGlowMat);
  group.add(overlap);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      // Pulse the overlap region to show constructive interference (bonding)
      overlap.scale.setScalar(1 + Math.sin(time*3)*0.2);
      overlap.material.opacity = 0.3 + Math.sin(time*6)*0.2;
      
      atom1.val.material.opacity = 0.15 + Math.sin(time*2)*0.05;
      atom2.val.material.opacity = 0.15 + Math.cos(time*2)*0.05;
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
