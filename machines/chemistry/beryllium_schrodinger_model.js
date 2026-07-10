import * as THREE from 'three';

export function createBerylliumSchrodingerModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const nucGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  group.add(new THREE.Mesh(nucGeo, nucMat));

  // Schrödinger Wave Representation (1s and 2s waves)
  // We'll create a series of concentric wavy shells
  const waveCount = 20;
  const waves = [];
  
  for(let i=1; i<=waveCount; i++) {
      const radius = i * 0.25;
      const geo = new THREE.IcosahedronGeometry(radius, 4);
      // Determine if in 1s region or 2s region based on node (~radius 1.5)
      const is1s = radius < 1.5;
      const mat = new THREE.MeshBasicMaterial({ 
          color: is1s ? 0xff5500 : 0x00aaff, 
          wireframe: true, 
          transparent: true, 
          opacity: (1 - radius/5) * 0.5 
      });
      const mesh = new THREE.Mesh(geo, mat);
      
      // Store original vertices for wave manipulation
      const posAttribute = geo.attributes.position;
      const originalPos = new Float32Array(posAttribute.count * 3);
      for(let j=0; j<posAttribute.count * 3; j++) originalPos[j] = posAttribute.array[j];
      
      waves.push({ mesh, originalPos, radius, is1s });
      group.add(mesh);
  }

  group.userData.animate = function(delta, time) {
      waves.forEach(w => {
          const pos = w.mesh.geometry.attributes.position;
          const orig = w.originalPos;
          const k = w.is1s ? 5 : 3; // Wave number
          const omega = w.is1s ? 4 : 2; // Frequency
          
          for(let i=0; i<pos.count; i++) {
              const ix = i*3, iy = i*3+1, iz = i*3+2;
              const x = orig[ix], y = orig[iy], z = orig[iz];
              // Apply spherical harmonic-like wave perturbation
              const perturbation = Math.sin(x*k + time*omega) * Math.cos(y*k + time*omega) * 0.05;
              const scale = 1 + perturbation;
              pos.array[ix] = x * scale;
              pos.array[iy] = y * scale;
              pos.array[iz] = z * scale;
          }
          pos.needsUpdate = true;
          w.mesh.rotation.y += delta * 0.1 * (w.is1s ? 1 : -1);
      });
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
