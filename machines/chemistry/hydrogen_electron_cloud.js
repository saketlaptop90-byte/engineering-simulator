import * as THREE from 'three';
export function createHydrogenElectronCloud() {
  const group = new THREE.Group();
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Volumetric cloud representation using layered transparent spheres
  const cloudGroup = new THREE.Group();
  for(let i=1; i<=10; i++) {
     const radius = i * 0.4;
     const opacity = 0.3 * Math.exp(-i/2); // Density decreases outwards
     const geo = new THREE.SphereGeometry(radius, 32, 32);
     const mat = new THREE.MeshPhysicalMaterial({ color: 0x4488ff, transparent: true, opacity: opacity, transmission: 0.9, roughness: 0.1 });
     cloudGroup.add(new THREE.Mesh(geo, mat));
  }
  group.add(cloudGroup);

  return {
    group: group,
    description: "Electron Cloud visualization showing the electron density gradient of Hydrogen.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center of the atom." },
      { name: "Electron Density", material: "Cloud", function: "Darker/denser regions represent higher probability of finding the electron." }
    ]
  };
}
