import * as THREE from 'three';
export function createLithiumEmissionSpectrum() {
  const group = new THREE.Group();
  
  // Lithium Emission Spectrum (Remastered)
  
  // Flame background (Lithium burns Crimson Red)
  const flameGeo = new THREE.SphereGeometry(6, 32, 32);
  const flameMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending});
  const flame = new THREE.Mesh(flameGeo, flameMat);
  group.add(flame);
  
  // Prism to split the light
  const prism = new THREE.Mesh(
      new THREE.ConeGeometry(2, 4, 3),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.8, roughness: 0.05, ior: 1.5, clearcoat: 1.0})
  );
  prism.rotation.x = Math.PI/2;
  prism.position.x = -2;
  group.add(prism);
  
  // Incoming white/heat energy
  const beamIn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 10, 8),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
  );
  beamIn.rotation.z = Math.PI/2;
  beamIn.position.set(-7, 0, 0);
  group.add(beamIn);
  
  // Spectral lines hitting a detector screen
  const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 8),
      new THREE.MeshBasicMaterial({color: 0x222222})
  );
  screen.position.set(6, 0, 0);
  group.add(screen);
  
  // The spectral lines of Lithium (Mainly a very strong red line at 670.8 nm)
  const drawLine = (yPos, colorHex, intensity) => {
      const line = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 8, 8),
          new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: intensity, blending: THREE.AdditiveBlending})
      );
      line.rotation.z = Math.PI/2;
      // Angle it from the prism to the screen
      const dir = new THREE.Vector3(6 - (-2), yPos - 0, 0).normalize();
      const length = Math.sqrt(8*8 + yPos*yPos);
      line.scale.y = length / 8; // stretch to reach
      line.position.set(2, yPos/2, 0); // midpoint
      line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
      
      const band = new THREE.Mesh(
          new THREE.PlaneGeometry(0.15, 8),
          new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: Math.min(1.0, intensity*2), blending: THREE.AdditiveBlending})
      );
      band.position.set(5.95, yPos, 0); // Slightly in front of screen
      group.add(line, band);
      return band;
  };
  
  const redBand = drawLine(2, 0xff0000, 1.0); // 670.8 nm (Strong Crimson Red)
  const orangeBand = drawLine(0, 0xffaa00, 0.2); // Minor line
  const blueBand = drawLine(-2.5, 0x0088ff, 0.1); // Minor line

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.1) * 0.2 - 0.2; // look at screen
      
      // Flame flicker
      flame.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      
      // Beam pulse
      redBand.material.opacity = 0.8 + Math.sin(time*speed*10)*0.2;
  };

  return {
    group: group,
    description: "Lithium Emission Spectrum (Remastered). If you throw Lithium into a fire, the flames turn a beautiful, deep Crimson Red! Why? When Lithium atoms are heated, their valence electrons jump to higher energy levels. When they fall back down, they release photons of light. If we pass that light through a prism to separate it, we don't see a rainbow—we see distinct 'Spectral Lines'. Lithium has a massive, dominant spectral line at exactly 670.8 nanometers, which corresponds to red light. This is how astronomers know that stars millions of lightyears away contain Lithium!",
    parts: [
      { name: "Glass Prism", material: "Diffraction Grating", function: "Splits the light into its component wavelengths." },
      { name: "Bright Red Band", material: "670.8 nm Photon", function: "The primary fingerprint of the Lithium atom." }
    ],
    quizQuestions: [
      { question: "Why does Lithium's emission spectrum look like a few distinct lines instead of a full rainbow?", options: ["Because the prism is broken", "Because electrons can only jump between specific, 'quantized' energy levels, meaning they only emit very specific colors (wavelengths) of light.", "Because Lithium only absorbs red light", "Because fire is red"], correct: 1, explanation: "This 'quantization' of energy is the foundation of Quantum Mechanics! Electrons can't exist between levels, so they can't emit colors between levels." }
    ]
  };
}