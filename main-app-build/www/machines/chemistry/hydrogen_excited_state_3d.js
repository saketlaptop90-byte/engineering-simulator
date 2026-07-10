import * as THREE from 'three';
export function createHydrogenExcitedState3d() {
  const group = new THREE.Group();
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  // 3dxy clover shape (4 lobes)
  const lobeGeo = new THREE.CapsuleGeometry(0.8, 1.5, 32, 32);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x00ff88, transparent: true, opacity: 0.6 });
  
  const positions = [
      {x: 1.5, y: 1.5, rotZ: Math.PI/4},
      {x: -1.5, y: -1.5, rotZ: Math.PI/4},
      {x: -1.5, y: 1.5, rotZ: -Math.PI/4},
      {x: 1.5, y: -1.5, rotZ: -Math.PI/4}
  ];

  positions.forEach(p => {
      const lobe = new THREE.Mesh(lobeGeo, mat);
      lobe.position.set(p.x, p.y, 0);
      lobe.rotation.z = p.rotZ;
      group.add(lobe);
  });

  return {
    group: group,
    description: "Excited State: 3d Orbital (e.g. 3dxy). Features four lobes and two perpendicular nodal planes intersecting at the nucleus (l=2).",
    parts: [
      { name: "Four Lobes", material: "Wavefunction", function: "High probability regions." },
      { name: "Nodal Planes", material: "Nodes", function: "XZ and YZ planes have zero probability." }
    ]
  };
}
