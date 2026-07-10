import * as THREE from 'three';

export function createBerylliumProbabilityDensity() {
  const group = new THREE.Group();
  
  // Isosurface / Threshold representation
  const geo1s = new THREE.SphereGeometry(0.8, 32, 32);
  const mat1s = new THREE.MeshPhysicalMaterial({ 
      color: 0xff3300, transparent: true, opacity: 0.8, 
      transmission: 0.5, roughness: 0.1 
  });
  const shell1s = new THREE.Mesh(geo1s, mat1s);
  group.add(shell1s);

  // 2s inner node gap is between 0.8 and 1.5 roughly
  const geo2sInner = new THREE.SphereGeometry(1.4, 32, 32);
  const mat2sInner = new THREE.MeshPhysicalMaterial({ 
      color: 0x0088ff, transparent: true, opacity: 0.2, side: THREE.BackSide
  });
  const shell2sInner = new THREE.Mesh(geo2sInner, mat2sInner);
  group.add(shell2sInner);

  const geo2sOuter = new THREE.SphereGeometry(3.5, 32, 32);
  const mat2sOuter = new THREE.MeshPhysicalMaterial({ 
      color: 0x00ccff, transparent: true, opacity: 0.15,
      transmission: 0.9, roughness: 0.0
  });
  const shell2sOuter = new THREE.Mesh(geo2sOuter, mat2sOuter);
  group.add(shell2sOuter);
  
  // Slice to see inside
  const sliceMat = new THREE.MeshBasicMaterial({color:0xffffff});
  // We can't do true CSG easily here, so we simulate it by rendering wireframes over it
  const wireOuter = new THREE.Mesh(geo2sOuter, new THREE.MeshBasicMaterial({color: 0x00ccff, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(wireOuter);

  group.userData.animate = function(delta, time) {
      shell2sOuter.scale.setScalar(1 + Math.sin(time*2)*0.02);
      shell1s.scale.setScalar(1 + Math.cos(time*3)*0.05);
      group.rotation.y += delta * 0.1;
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Atomic Mass": "9.0122 u",
    "Electronic Configuration": "1s² 2s²",
    "Quantum Information": "Describes the wave-like behavior of electrons. The 1s and 2s orbitals are spherical, but the 2s orbital has a radial node where probability drops to zero.",
    "Orbitals": "Contains fully filled 1s and 2s subshells.",
    "Probability Density (|ψ|²)": "Highest near the nucleus for 1s, with a secondary peak further out for 2s.",
    "Electron-Proton Force": "Attractive Coulomb force governs the potential well holding the 4 electrons to the nucleus (Z=4).",
    "Schrödinger Equation Relevance": "The time-independent Schrödinger equation Hψ = Eψ defines these orbital states."
  };

  return group;
}
