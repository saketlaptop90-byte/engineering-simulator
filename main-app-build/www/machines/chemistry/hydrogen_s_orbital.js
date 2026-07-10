import * as THREE from 'three';
export function createHydrogenSOrbital() {
  const group = new THREE.Group();
  
  const axesHelper = new THREE.AxesHelper(3);
  group.add(axesHelper);

  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  const orbitalGeo = new THREE.SphereGeometry(2, 64, 64);
  const orbitalMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5, transmission: 0.5, roughness: 0.4, side: THREE.DoubleSide });
  const orbital = new THREE.Mesh(orbitalGeo, orbitalMat);
  group.add(orbital);

  return {
    group: group,
    description: "The 1s Orbital of Hydrogen. It is perfectly spherical, indicating no angular dependence in probability.",
    parts: [
      { name: "Nucleus", material: "Proton", function: "Center" },
      { name: "1s Orbital Boundary", material: "Mathematical Surface", function: "Encloses 90% of the electron probability." },
      { name: "XYZ Axes", material: "Reference", function: "Shows spherical symmetry." }
    ]
  };
}
