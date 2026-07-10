import * as THREE from 'three';

export function createBerylliumElectronCloud() {
  const group = new THREE.Group();
  
  const nucGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa });
  group.add(new THREE.Mesh(nucGeo, nucMat));

  // Volumetric fog representation using instanced sprites or many points
  const particleCount = 30000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
      let r = -Math.log(1 - Math.random()) * 0.7; // 1s
      if(Math.random() > 0.5) r = (1.5 - Math.log(1 - Math.random())) * 1.5; // 2s
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      sizes[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // We use standard Points but simulate fog
  const material = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.15,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false
  });

  const cloud = new THREE.Points(geometry, material);
  group.add(cloud);

  group.userData.animate = function(delta, time) {
      cloud.rotation.y += delta * 0.05;
      cloud.rotation.x += delta * 0.02;
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
