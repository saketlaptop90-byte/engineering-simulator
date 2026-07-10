import * as THREE from 'three';

export function createCyclotron() {
  const group = new THREE.Group();
  
  // Outer Magnet / Housing
  const housingGeo = new THREE.CylinderGeometry(6, 6, 2, 64);
  const housingMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.3 });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  group.add(housing);

  // D-shaped electrodes (Dees)
  const deeShape = new THREE.Shape();
  deeShape.absarc(0, 0, 5, 0, Math.PI, false);
  const extrudeSettings = { depth: 0.5, bevelEnabled: false };
  const deeGeo = new THREE.ExtrudeGeometry(deeShape, extrudeSettings);
  const deeMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 }); // Copper
  
  const dee1 = new THREE.Mesh(deeGeo, deeMat);
  dee1.position.set(0, -0.25, 0.2);
  dee1.rotation.x = Math.PI / 2;
  group.add(dee1);

  const dee2 = new THREE.Mesh(deeGeo, deeMat);
  dee2.position.set(0, 0.25, -0.2);
  dee2.rotation.x = -Math.PI / 2;
  dee2.rotation.z = Math.PI;
  group.add(dee2);

  // Particle Source (Center)
  const sourceGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const sourceMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
  const source = new THREE.Mesh(sourceGeo, sourceMat);
  group.add(source);

  // Beam Exit
  const exitGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const exitMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });
  const exit = new THREE.Mesh(exitGeo, exitMat);
  exit.rotation.z = Math.PI / 2;
  exit.position.set(7, 0, 0);
  group.add(exit);

  return {
    model: group,
    description: "A cyclotron accelerates charged particles outwards from the center along a spiral path.",
    parts: [
      { name: "Electromagnet Housing", material: "Steel / Iron", function: "Generates a perpendicular magnetic field to bend the particle path." },
      { name: "Dee 1", material: "Copper", function: "Provides the oscillating high voltage electric field to accelerate the particle." },
      { name: "Dee 2", material: "Copper", function: "Provides the oscillating high voltage electric field to accelerate the particle." },
      { name: "Particle Source", material: "Ion Generator", function: "Injects charged particles (e.g., protons) into the center." },
      { name: "Beam Extraction Port", material: "Metal Alloy", function: "Directs the accelerated particle beam out of the cyclotron." }
    ]
  };
}
