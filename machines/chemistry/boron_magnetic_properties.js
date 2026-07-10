import * as THREE from 'three';

export function createBoronMagneticProperties() {
  const group = new THREE.Group();
  
  // Custom Visualizer for MagneticProperties

  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x444444}));
  group.add(core);
  
  const fieldGeo = new THREE.TorusGeometry(2, 0.05, 16, 100);
  const fieldMat = new THREE.MeshBasicMaterial({color: 0x00aaff, transparent: true, opacity: 0.5});
  const field1 = new THREE.Mesh(fieldGeo, fieldMat);
  const field2 = new THREE.Mesh(fieldGeo, fieldMat);
  field1.rotation.x = Math.PI/2;
  group.add(field1);
  group.add(field2);

  group.userData.animate = function(delta, time) {
      field1.scale.setScalar(1.0 + Math.sin(time*5)*0.2);
      field2.scale.setScalar(1.0 + Math.cos(time*5)*0.2);
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Boron is diamagnetic."
  };
  return group;
}
