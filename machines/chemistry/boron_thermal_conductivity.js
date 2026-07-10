import * as THREE from 'three';

export function createBoronThermalConductivity() {
  const group = new THREE.Group();
  
  // Custom Visualizer for ThermalConductivity

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 32), new THREE.MeshBasicMaterial({color: 0xff0000}));
  rod.rotation.z = Math.PI/2;
  group.add(rod);
  
  group.userData.animate = function(delta, time) {
      const intensity = (Math.sin(time * 3) + 1.0) / 2.0;
      rod.material.color.setHSL(intensity * 0.2, 1.0, 0.5); 
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Thermal conductivity is 27.4 W/(m·K)."
  };
  return group;
}
