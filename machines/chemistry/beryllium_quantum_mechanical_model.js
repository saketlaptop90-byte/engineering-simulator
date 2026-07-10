import * as THREE from 'three';

export function createBerylliumQuantumMechanicalModel() {
  const group = new THREE.Group();
  
  // Nucleus
  const nucGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const nucMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  group.add(new THREE.Mesh(nucGeo, nucMat));

  // Electron Cloud (Probability Density) using Points
  const particleCount = 20000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1s = new THREE.Color(0xffaa00);
  const color2s = new THREE.Color(0x00aaff);

  for (let i = 0; i < particleCount; i++) {
      const is1s = i < particleCount / 2;
      let r;
      if (is1s) {
          r = -Math.log(1 - Math.random()) * 0.5;
      } else {
          const rBase = -Math.log(1 - Math.random());
          r = Math.random() > 0.2 ? rBase * 2 + 1.5 : rBase * 0.5; 
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = is1s ? color1s : color2s;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
  });

  const cloud = new THREE.Points(geometry, material);
  group.add(cloud);

  group.userData.animate = function(delta, time) {
      cloud.rotation.y += delta * 0.1;
      cloud.rotation.z += delta * 0.05;
      material.opacity = 0.3 + 0.1 * Math.sin(time * 3);
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Atomic Mass": "9.0122 u",
    "Group": "2 (Alkaline Earth Metals)",
    "Period": "2",
    "Block": "s-block",
    "Electronic Configuration": "1s² 2s²",
    "Shell Configuration": "2, 2",
    "Valence Electrons": "2",
    "Core Electrons": "2",
    "Electronegativity": "1.57 (Pauling scale)",
    "Electron Affinity": "-50 kJ/mol (Calculated)",
    "Ionization Energies": "1st: 899.5 kJ/mol, 2nd: 1757.1 kJ/mol",
    "Atomic Radius": "105 pm",
    "Ionic Radius": "45 pm (Be2+)",
    "Density": "1.85 g/cm³",
    "Melting Point": "1560 K (1287 °C)",
    "Boiling Point": "2742 K (2469 °C)",
    "Phase": "Solid",
    "Color": "Lead-gray",
    "Magnetic Properties": "Diamagnetic",
    "Oxidation States": "+2, +1",
    "Nature": "Metallic (Alkaline Earth)",
    "Biological Importance": "Highly toxic, causes berylliosis. No known biological role.",
    "Industrial Uses": "Aerospace components, X-ray windows, beryllium-copper alloys (non-sparking tools), nuclear reactors (neutron reflector)."
  };

  return group;
}
