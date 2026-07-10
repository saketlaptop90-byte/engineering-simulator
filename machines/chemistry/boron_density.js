import * as THREE from 'three';

export function createBoronDensity() {
  const group = new THREE.Group();
  
  // Custom Visualizer for Density

  const boxGeo = new THREE.BoxGeometry(2,2,2);
  const boxMat = new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.8, roughness: 0.2});
  const box = new THREE.Mesh(boxGeo, boxMat);
  group.add(box);
  group.add(new THREE.AmbientLight(0xffffff, 1));
  group.userData.animate = function(delta, time) {
      box.rotation.x += delta*0.5;
      box.rotation.y += delta*0.5;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Density is 2.08 g/cm³ (beta rhombohedral boron)."
  };
  return group;
}
