import * as THREE from 'three';

export function createBoronElectronAffinity() {
  const group = new THREE.Group();
  
  // Custom Visualizer for ElectronAffinity

  const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(eMesh);
  
  const bMesh = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xff4444, wireframe: true}));
  group.add(bMesh);

  group.userData.animate = function(delta, time) {
      const dist = 3.0 + Math.cos(time)*2.0;
      eMesh.position.set(dist, 0, 0);
      bMesh.rotation.z -= delta;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Boron has an electron affinity of 26.7 kJ/mol."
  };
  return group;
}
