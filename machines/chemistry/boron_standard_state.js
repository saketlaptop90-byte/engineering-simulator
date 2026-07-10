import * as THREE from 'three';

export function createBoronStandardState() {
  const group = new THREE.Group();
  
  // Custom Visualizer for StandardState

  // Abstract God-Tier Data Node
  const geo = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
  const mat = new THREE.MeshNormalMaterial({ wireframe: true });
  const knot = new THREE.Mesh(geo, mat);
  group.add(knot);

  const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
  const core = new THREE.Mesh(innerGeo, innerMat);
  group.add(core);

  group.userData.animate = function(delta, time) {
      knot.rotation.x += delta * 0.5;
      knot.rotation.y += delta * 0.8;
      core.scale.setScalar(1.0 + Math.sin(time * 3) * 0.1);
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Solid"
  };
  return group;
}
