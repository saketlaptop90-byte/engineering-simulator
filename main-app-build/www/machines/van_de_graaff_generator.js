import * as THREE from 'three';

export function createVanDeGraaffGenerator() {
  const group = new THREE.Group();
  
  // Dome (Sphere)
  const domeGeo = new THREE.SphereGeometry(2, 32, 32);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 5;
  group.add(dome);

  // Column
  const columnGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
  const columnMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.8 }); // Plastic/insulator
  const column = new THREE.Mesh(columnGeo, columnMat);
  column.position.y = 2.5;
  group.add(column);

  // Base
  const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.25;
  group.add(base);

  // Belt inside the column (visible if we make column transparent, but we'll leave it as a distinct part)
  const beltGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.8, 16);
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.y = 2.5;
  group.add(belt);

  return {
    model: group,
    description: "An electrostatic generator which uses a moving belt to accumulate electric charge on a hollow metal globe.",
    parts: [
      { name: "Metal Dome", material: "Aluminum / Steel", function: "Accumulates static electrical charge." },
      { name: "Insulating Column", material: "PVC or Acrylic", function: "Supports the dome and insulates it from ground." },
      { name: "Motor Base", material: "Steel and Plastic", function: "Houses the motor that drives the belt." },
      { name: "Rubber Belt", material: "Rubber / Silicone", function: "Transports electrons to the dome." }
    ]
  };
}
