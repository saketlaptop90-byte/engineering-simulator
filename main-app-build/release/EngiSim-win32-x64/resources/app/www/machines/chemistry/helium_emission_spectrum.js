import * as THREE from 'three';
export function createHeliumEmissionSpectrum() {
  const group = new THREE.Group();
  
  const prismGeo = new THREE.CylinderGeometry(0, 1.5, 3, 3);
  const prismMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.rotation.z = Math.PI / 2;
  prism.position.x = -2;
  group.add(prism);

  // Helium lines: 587.6 nm (yellow), 667.8 nm (red), 501.6 nm (green), 447.1 nm (blue)
  const lines = [
      { color: 0xff0000, pos: 1, name: "667.8 nm (Red)" },
      { color: 0xffd700, pos: 1.5, name: "587.6 nm (Yellow - D3)" }, 
      { color: 0x00ff00, pos: 2, name: "501.6 nm (Green)" }, 
      { color: 0x0000ff, pos: 2.8, name: "447.1 nm (Blue)" }
  ];

  lines.forEach(l => {
      const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: l.color });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.z = Math.PI / 2 - (l.pos * 0.1);
      beam.position.set(0.5, l.pos - 2, 0);
      group.add(beam);
  });

  return {
    group: group,
    description: "Helium Emission Spectrum. Helium was actually discovered in the Sun before Earth, identified by its bright yellow D3 spectral line (587.6 nm) during a solar eclipse in 1868.",
    parts: [
      { name: "Yellow D3 Line", material: "Photon", function: "The signature line that led to Helium's discovery." },
      { name: "Spectral Fingerprint", material: "Light", function: "Unique to Helium electron transitions." }
    ],
    quizQuestions: [
      { question: "Where was Helium first discovered?", options: ["In deep underground mines", "In the Earth's atmosphere", "In the spectrum of the Sun", "In a laboratory reaction"], correct: 2, explanation: "Helium was discovered by Pierre Janssen and Norman Lockyer in 1868 by observing a yellow spectral line in sunlight during a solar eclipse. 'Helios' is Greek for Sun." }
    ]
  };
}
