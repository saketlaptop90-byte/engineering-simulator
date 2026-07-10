import * as THREE from 'three';

export function createBoronElectricalConductivity() {
  const group = new THREE.Group();
  
  // Custom Visualizer for ElectricalConductivity

  const lattice = new THREE.GridHelper(10, 10, 0x00ff00, 0x222222);
  group.add(lattice);
  
  const electronGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const electronMat = new THREE.MeshBasicMaterial({color: 0xffff00});
  const e1 = new THREE.Mesh(electronGeo, electronMat);
  const e2 = new THREE.Mesh(electronGeo, electronMat);
  group.add(e1);
  group.add(e2);

  group.userData.animate = function(delta, time) {
      e1.position.set(Math.sin(time)*4, 0, Math.cos(time*1.5)*4);
      e2.position.set(Math.cos(time*1.2)*4, 0, Math.sin(time*2)*4);
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Boron is a metalloid/semiconductor, conductivity increases at higher temperatures."
  };
  return group;
}
