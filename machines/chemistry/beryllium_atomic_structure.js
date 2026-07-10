import * as THREE from 'three';

export function createBerylliumAtomicStructure() {
  const group = new THREE.Group();
  
  // Nucleus: 4 Protons (Red), 5 Neutrons (Blue)
  const nucleus = new THREE.Group();
  const nucleonGeo = new THREE.SphereGeometry(0.3, 32, 32);
  const protonMat = new THREE.MeshPhysicalMaterial({ color: 0xff3333, roughness: 0.2, metalness: 0.1, clearcoat: 1.0, emissive: 0x440000 });
  const neutronMat = new THREE.MeshPhysicalMaterial({ color: 0x3333ff, roughness: 0.2, metalness: 0.1, clearcoat: 1.0, emissive: 0x000044 });

  const positions = [
    [0.2, 0.2, 0.2], [-0.2, -0.2, 0.2], [0.2, -0.2, -0.2], [-0.2, 0.2, -0.2], // 4 Protons
    [0, 0, 0.3], [0, 0.3, 0], [0.3, 0, 0], [-0.3, -0.1, 0], [0, -0.3, -0.1] // 5 Neutrons
  ];
  
  positions.forEach((pos, i) => {
    const isProton = i < 4;
    const mesh = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
    mesh.position.set(...pos);
    nucleus.add(mesh);
  });
  group.add(nucleus);

  // Electrons (4) - 2 in 1s, 2 in 2s
  const electronGeo = new THREE.SphereGeometry(0.12, 32, 32);
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2 });
  
  const electrons = [];
  const orbits = [
    { radius: 2, speed: 2.5, angle: 0, tilt: 0 },
    { radius: 2, speed: 2.5, angle: Math.PI, tilt: Math.PI/2 },
    { radius: 4, speed: 1.5, angle: 0, tilt: Math.PI/4 },
    { radius: 4, speed: 1.5, angle: Math.PI, tilt: -Math.PI/4 }
  ];

  orbits.forEach((orb) => {
    // Orbit Path
    const pathGeo = new THREE.TorusGeometry(orb.radius, 0.01, 16, 100);
    const pathMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.1 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = Math.PI / 2;
    
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = orb.tilt;
    tiltGroup.add(path);
    
    const electron = new THREE.Mesh(electronGeo, electronMat);
    tiltGroup.add(electron);
    group.add(tiltGroup);
    
    electrons.push({ mesh: electron, ...orb });
  });

  const light = new THREE.PointLight(0xffffff, 2, 10);
  group.add(light);

  group.userData.animate = function(delta, time) {
      nucleus.rotation.y += delta * 0.5;
      nucleus.rotation.x += delta * 0.2;
      
      electrons.forEach((e) => {
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
