import * as THREE from 'three';

export function createBoronIsotopes() {
  const group = new THREE.Group();
  
  // Custom Visualizer for Isotopes

  const b10 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff4444, wireframe: true}));
  b10.position.x = -2;
  const b11 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0x44ff44, wireframe: true}));
  b11.position.x = 2;
  
  group.add(b10);
  group.add(b11);

  group.userData.animate = function(delta, time) {
      b10.rotation.y += delta;
      b11.rotation.y -= delta;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Natural isotopes: B-10 (19.9%) and B-11 (80.1%)."
  };
  return group;
}
