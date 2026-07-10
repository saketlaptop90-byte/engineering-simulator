import * as THREE from 'three';
export function createHydrogenExcitedState2s() {
  const group = new THREE.Group();
  
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(proton);

  const innerGeo = new THREE.SphereGeometry(1, 32, 32);
  const outerGeo = new THREE.SphereGeometry(3, 32, 32);
  const innerMat = new THREE.MeshPhysicalMaterial({ color: 0xff4444, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  const outerMat = new THREE.MeshPhysicalMaterial({ color: 0x4444ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  
  group.add(new THREE.Mesh(innerGeo, innerMat));
  group.add(new THREE.Mesh(outerGeo, outerMat));

  // Cross section plane to see inside
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0x000000, colorWrite: false, depthWrite: true }));
  plane.position.z = 0.1;
  // group.add(plane); // Advanced clipping requires WebGL renderer config, we'll keep it simple

  return {
    group: group,
    description: "Excited State: 2s Orbital. Spherical but contains a radial node (a spherical shell where probability is zero) separating the inner and outer regions.",
    parts: [
      { name: "Inner Region", material: "Wavefunction", function: "Dense probability near nucleus." },
      { name: "Radial Node", material: "Node", function: "Spherical boundary of zero probability." },
      { name: "Outer Region", material: "Wavefunction", function: "Main probability density for n=2." }
    ]
  };
}
