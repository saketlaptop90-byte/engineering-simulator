import * as THREE from 'three';

export function createBerylliumBohrModel() {
  const group = new THREE.Group();
  
  // Central Nucleus Symbol
  const nucGeo = new THREE.SphereGeometry(0.8, 32, 32);
  const nucMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xaa5500, wireframe: true });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  group.add(nucleus);

  const electronGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00 });

  const shells = [
    { radius: 2.5, electrons: 2, speed: 2 }, // n=1
    { radius: 5.0, electrons: 2, speed: 1 }  // n=2
  ];

  const allElectrons = [];

  shells.forEach((shell) => {
    const ringGeo = new THREE.RingGeometry(shell.radius - 0.02, shell.radius + 0.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    for (let i = 0; i < shell.electrons; i++) {
        const angle = (i / shell.electrons) * Math.PI * 2;
        const el = new THREE.Mesh(electronGeo, electronMat);
        group.add(el);
        allElectrons.push({ mesh: el, radius: shell.radius, angle: angle, speed: shell.speed });
    }
  });

  group.userData.animate = function(delta, time) {
      nucleus.rotation.y -= delta * 0.5;
      allElectrons.forEach(e => {
          e.angle += delta * e.speed;
          e.mesh.position.set(Math.cos(e.angle) * e.radius, 0, Math.sin(e.angle) * e.radius);
      });
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
