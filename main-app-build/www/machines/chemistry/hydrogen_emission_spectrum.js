import * as THREE from 'three';
export function createHydrogenEmissionSpectrum() {
  const group = new THREE.Group();
  
  // Prism/Diffraction
  const prismGeo = new THREE.CylinderGeometry(0, 1.5, 3, 3);
  const prismMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.rotation.z = Math.PI / 2;
  prism.position.x = -2;
  group.add(prism);

  // Spectral lines (Balmer series)
  const lines = [
      { color: 0xff0000, pos: 1, name: "656 nm (Red)" }, // H-alpha
      { color: 0x00ffff, pos: 2, name: "486 nm (Cyan)" }, // H-beta
      { color: 0x0000ff, pos: 3, name: "434 nm (Blue)" }, // H-gamma
      { color: 0x4b0082, pos: 3.5, name: "410 nm (Violet)" } // H-delta
  ];

  lines.forEach(l => {
      const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: l.color });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.z = Math.PI / 2 - (l.pos * 0.1);
      beam.position.set(0.5, l.pos - 2, 0);
      group.add(beam);
  });

  return {
    group: group,
    description: "The emission spectrum of Hydrogen (Balmer series) created by electrons dropping to the n=2 level.",
    parts: [
      { name: "Dispersion Element", material: "Prism/Grating", function: "Splits emitted light into components." },
      { name: "H-alpha (Red)", material: "Photon (656 nm)", function: "n=3 to n=2 transition." },
      { name: "H-beta (Cyan)", material: "Photon (486 nm)", function: "n=4 to n=2 transition." },
      { name: "H-gamma (Blue)", material: "Photon (434 nm)", function: "n=5 to n=2 transition." }
    ]
  };
}
