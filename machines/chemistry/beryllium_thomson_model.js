import * as THREE from 'three';

export function createBerylliumThomsonModel() {
  const group = new THREE.Group();
  
  // Positive fluid sphere
  const sphereGeo = new THREE.SphereGeometry(3, 64, 64);
  const sphereMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xffaaaa, transparent: true, opacity: 0.5, 
      transmission: 0.9, roughness: 0.1, ior: 1.5 
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  // Embedded Electrons (Plums)
  const plumGeo = new THREE.SphereGeometry(0.3, 32, 32);
  const plumMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.3 });
  
  const plums = [];
  const positions = [
      [1, 1, 1], [-1, -1, -1], [1, -1, 1], [-1, 1, -1]
  ];
  
  positions.forEach(pos => {
      const plum = new THREE.Mesh(plumGeo, plumMat);
      plum.position.set(...pos).normalize().multiplyScalar(1.5);
      group.add(plum);
      plums.push({ mesh: plum, basePos: plum.position.clone(), phase: Math.random()*Math.PI*2 });
  });

  group.userData.animate = function(delta, time) {
      sphere.rotation.y += delta * 0.1;
      sphere.rotation.z += delta * 0.05;
      
      plums.forEach(p => {
          p.mesh.position.copy(p.basePos);
          p.mesh.position.x += Math.sin(time*2 + p.phase) * 0.1;
          p.mesh.position.y += Math.cos(time*2.5 + p.phase) * 0.1;
          p.mesh.position.z += Math.sin(time*1.5 + p.phase) * 0.1;
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
