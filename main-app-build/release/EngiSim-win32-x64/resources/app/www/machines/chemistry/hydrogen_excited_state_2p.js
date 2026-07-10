import * as THREE from 'three';
export function createHydrogenExcitedState2p() {
  const group = new THREE.Group();
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // 2p orbital (dumbbell)
  const lobeGeo = new THREE.CapsuleGeometry(1.2, 2, 32, 32);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, transparent: true, opacity: 0.6, transmission: 0.8 });
  
  const lobe1 = new THREE.Mesh(lobeGeo, mat);
  lobe1.position.y = 1.8;
  const lobe2 = new THREE.Mesh(lobeGeo, mat);
  lobe2.position.y = -1.8;
  
  group.add(lobe1);
  group.add(lobe2);
  
  const axes = new THREE.AxesHelper(4);
  group.add(axes);

  return {
    group: group,
    description: "Excited State: 2p Orbital. Shows a dumbbell shape with a planar node at the nucleus, representing angular momentum l=1.",
    parts: [
      { name: "Upper Lobe", material: "Wavefunction (+)", function: "High probability region." },
      { name: "Lower Lobe", material: "Wavefunction (-)", function: "High probability region with opposite phase." },
      { name: "Nodal Plane", material: "Node", function: "Zero probability of finding the electron at the nucleus." }
    ]
  };
}
