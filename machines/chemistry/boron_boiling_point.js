import * as THREE from 'three';

export function createBoronBoilingPoint() {
  const group = new THREE.Group();
  
  // Custom Visualizer for BoilingPoint

  const geo = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);
  for(let i=0; i<count*3; i++) positions[i] = (Math.random()-0.5)*10;
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const mat = new THREE.PointsMaterial({color: 0xff8800, size: 0.1, blending: THREE.AdditiveBlending});
  const points = new THREE.Points(geo, mat);
  group.add(points);

  group.userData.animate = function(delta, time) {
      points.rotation.y += delta * 0.2;
      const positions = points.geometry.attributes.position.array;
      for(let i=0; i<count; i++) {
          positions[i*3+1] += delta * (Math.random() * 5);
          if (positions[i*3+1] > 5) positions[i*3+1] = -5;
      }
      points.geometry.attributes.position.needsUpdate = true;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Boils at 3927 °C."
  };
  return group;
}
