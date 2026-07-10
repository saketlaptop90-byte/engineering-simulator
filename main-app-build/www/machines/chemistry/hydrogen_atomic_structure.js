import * as THREE from 'three';
export function createHydrogenAtomicStructure() {
  const group = new THREE.Group();
  
  // Nucleus (Proton)
  const protonGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const protonMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.4 });
  const proton = new THREE.Mesh(protonGeo, protonMat);
  group.add(proton);

  // Electron
  const electronGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const electronMat = new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x1111aa });
  const electron = new THREE.Mesh(electronGeo, electronMat);
  electron.position.set(3, 0, 0);
  
  // Electron Orbit Path
  const orbitCurve = new THREE.EllipseCurve(0, 0, 3, 3, 0, 2 * Math.PI, false, 0);
  const points = orbitCurve.getPoints(50);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
  const orbitLine = new THREE.Line(orbitGeo, orbitMat);
  orbitLine.rotation.x = Math.PI / 2;
  
  const orbitGroup = new THREE.Group();
  orbitGroup.add(orbitLine);
  orbitGroup.add(electron);
  group.add(orbitGroup);

  // Animation function attached to the group
  group.userData.animate = function(delta, time, speed) {
      orbitGroup.rotation.y += delta * speed * 2;
  };

  return {
    group: group,
    description: "The basic atomic structure of Hydrogen (1H) consisting of a single proton nucleus and one orbiting electron.",
    parts: [
      { name: "Proton (Nucleus)", material: "Hadron", function: "Provides the positive charge and nearly all the mass of the atom." },
      { name: "Electron", material: "Lepton", function: "Negatively charged particle orbiting the nucleus." },
      { name: "Electron Orbit", material: "Space", function: "The classical trajectory of the electron." }
    ]
  };
}
