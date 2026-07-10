import * as THREE from 'three';

export function createBoronMeltingPoint() {
  const group = new THREE.Group();
  
  // Custom Visualizer for MeltingPoint

  const geo = new THREE.IcosahedronGeometry(2, 0);
  const mat = new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0x880000, wireframe: true});
  const solid = new THREE.Mesh(geo, mat);
  group.add(solid);
  
  group.add(new THREE.PointLight(0xffaa00, 2, 10));

  group.userData.animate = function(delta, time) {
      solid.rotation.x += delta;
      solid.rotation.y += delta;
      solid.scale.setScalar(1.0 + Math.sin(time*10)*0.05);
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Melts at extremely high temperature: 2076 °C."
  };
  return group;
}
