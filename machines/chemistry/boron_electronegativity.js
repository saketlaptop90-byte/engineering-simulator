import * as THREE from 'three';

export function createBoronElectronegativity() {
  const group = new THREE.Group();
  
  // Custom Visualizer for Electronegativity

  const mat = new THREE.MeshPhysicalMaterial({color: 0x88ffaa, transmission: 0.9, opacity: 1, transparent: true});
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), mat);
  group.add(sphere);
  
  // Electronegativity attraction field
  const ringGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5});
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);
  
  group.userData.animate = function(delta, time) {
      ring.scale.setScalar(1.0 + Math.sin(time*2)*0.2);
      sphere.rotation.y += delta * 0.5;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Boron has a Pauling electronegativity of 2.04."
  };
  return group;
}
