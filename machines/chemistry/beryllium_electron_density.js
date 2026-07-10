import * as THREE from 'three';

export function createBerylliumElectronDensity() {
  const group = new THREE.Group();
  
  // Cross-section Heatmap style
  const planeGeo = new THREE.PlaneGeometry(10, 10, 128, 128);
  
  // Custom shader for Heatmap
  const vertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `;
  
  const fragmentShader = `
      varying vec2 vUv;
      uniform float time;
      
      // Calculate Beryllium 1s and 2s radial probability density
      float density(float r) {
          // Approximate normalized functions
          float psi1s = exp(-r * 2.0);
          float psi2s = (2.0 - r) * exp(-r / 2.0);
          // Probability is |psi|^2
          float prob = (psi1s * psi1s * 4.0) + (psi2s * psi2s * 0.5);
          return prob;
      }

      vec3 heatMap(float t) {
          // Colors from black -> blue -> red -> yellow -> white
          t = clamp(t, 0.0, 1.0);
          vec3 c1 = vec3(0.0, 0.0, 0.2);
          vec3 c2 = vec3(0.0, 0.5, 1.0);
          vec3 c3 = vec3(1.0, 0.0, 0.0);
          vec3 c4 = vec3(1.0, 1.0, 0.0);
          vec3 c5 = vec3(1.0, 1.0, 1.0);
          
          if(t < 0.25) return mix(c1, c2, t*4.0);
          if(t < 0.5) return mix(c2, c3, (t-0.25)*4.0);
          if(t < 0.75) return mix(c3, c4, (t-0.5)*4.0);
          return mix(c4, c5, (t-0.75)*4.0);
      }

      void main() {
          vec2 center = vec2(0.5, 0.5);
          float r = distance(vUv, center) * 10.0; // Scale radius
          
          float d = density(r);
          d = pow(d, 0.4); // Exaggerate for visibility
          
          vec3 color = heatMap(d);
          gl_FragColor = vec4(color, d > 0.01 ? 0.9 : 0.0);
      }
  `;

  const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { time: { value: 0 } },
      transparent: true,
      side: THREE.DoubleSide
  });

  const plane = new THREE.Mesh(planeGeo, material);
  group.add(plane);
  
  // Add an intersecting plane for 3D feel
  const plane2 = new THREE.Mesh(planeGeo, material);
  plane2.rotation.y = Math.PI / 2;
  group.add(plane2);

  group.userData.animate = function(delta, time) {
      material.uniforms.time.value = time;
      group.rotation.y += delta * 0.2;
      group.rotation.x = Math.sin(time * 0.5) * 0.2;
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
