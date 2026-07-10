import * as THREE from 'three';
export function createHydrogenHydrideIon() {
  const group = new THREE.Group();
  
  // Nucleus
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  group.add(proton);

  // Electrons
  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000088 });
  const e1 = new THREE.Mesh(eGeo, eMat);
  const e2 = new THREE.Mesh(eGeo, eMat);
  
  // Orbits
  const orbitCurve = new THREE.EllipseCurve(0, 0, 3.5, 3.5, 0, 2*Math.PI, false, 0);
  const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(64)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
  orbitLine.rotation.x = Math.PI / 2;
  group.add(orbitLine);
  group.add(e1);
  group.add(e2);

  group.userData.animate = function(delta, time, speed) {
      const angle1 = time * speed * 2;
      const angle2 = angle1 + Math.PI; // Opposite sides due to repulsion
      e1.position.set(Math.cos(angle1) * 3.5, 0, Math.sin(angle1) * 3.5);
      e2.position.set(Math.cos(angle2) * 3.5, 0, Math.sin(angle2) * 3.5);
  };

  return {
    group: group,
    description: "Hydride Ion (H-). The hydrogen atom gains an extra electron, filling its 1s orbital. The electrons repel each other, maximizing their distance.",
    parts: [
      { name: "Proton", material: "Nucleus", function: "Charge +1." },
      { name: "Electron 1", material: "Particle", function: "Charge -1." },
      { name: "Electron 2", material: "Particle", function: "Charge -1." },
      { name: "Electron Repulsion", material: "Force", function: "Causes the atomic radius of H- (208 pm) to be much larger than H (53 pm)." }
    ]
  };
}
