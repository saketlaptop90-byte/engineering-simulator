import * as THREE from 'three';
export function createHydrogenIonFormation() {
  const group = new THREE.Group();
  
  // H atom losing electron
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  proton.position.x = -2;
  group.add(proton);

  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const electron = new THREE.Mesh(eGeo, eMat);
  group.add(electron);

  // Arrow
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 2, 0xffffff);
  group.add(arrow);

  group.userData.animate = function(delta, time, speed) {
      // Electron flies away
      electron.position.x = -1 + (time * speed) % 5;
  };

  return {
    group: group,
    description: "Formation of a Hydrogen ion (H+), which is simply a bare proton.",
    parts: [
      { name: "Proton (H+ Ion)", material: "Nucleus", function: "Remains after ionization." },
      { name: "Ejected Electron", material: "Particle", function: "Removed via ionization energy (13.6 eV)." },
      { name: "Ionization Process", material: "Action", function: "Energy absorbed causes electron escape." }
    ]
  };
}
