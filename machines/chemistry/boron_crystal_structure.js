import * as THREE from 'three';

export function createBoronCrystalStructure() {
  const group = new THREE.Group();
  
  // Custom Visualizer for CrystalStructure

  const icoGeo = new THREE.IcosahedronGeometry(1.5, 0);
  const icoMat = new THREE.MeshStandardMaterial({color: 0x111111, wireframe: true});
  const ico = new THREE.Mesh(icoGeo, icoMat);
  group.add(ico);
  
  // Atoms at vertices
  const pts = icoGeo.attributes.position.array;
  const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const sphereMat = new THREE.MeshBasicMaterial({color: 0xff4444});
  for(let i=0; i<pts.length; i+=3) {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(pts[i], pts[i+1], pts[i+2]);
      ico.add(mesh);
  }
  
  group.userData.animate = function(delta, time) {
      ico.rotation.y += delta;
      ico.rotation.x += delta*0.5;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "God-Tier Visualization": "True",
    "Description": "Rhombohedral crystal structure containing B12 icosahedra."
  };
  return group;
}
