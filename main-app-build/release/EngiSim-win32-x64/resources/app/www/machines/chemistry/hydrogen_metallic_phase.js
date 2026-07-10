import * as THREE from 'three';
export function createHydrogenMetallicPhase() {
  const group = new THREE.Group();
  
  // Metallic lattice of protons
  const lattice = new THREE.Group();
  for(let x=-2; x<=2; x+=2) {
    for(let y=-2; y<=2; y+=2) {
      for(let z=-2; z<=2; z+=2) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        p.position.set(x, y, z);
        lattice.add(p);
      }
    }
  }
  group.add(lattice);

  // Electron sea
  const seaGeo = new THREE.BoxGeometry(6, 6, 6);
  const seaMat = new THREE.MeshPhysicalMaterial({ color: 0x4444ff, transparent: true, opacity: 0.3, transmission: 0.9, roughness: 0.2 });
  const sea = new THREE.Mesh(seaGeo, seaMat);
  group.add(sea);

  group.userData.animate = function(delta, time, speed) {
      lattice.rotation.y = Math.sin(time * speed * 0.5) * 0.2;
      lattice.rotation.x = Math.cos(time * speed * 0.5) * 0.2;
  };

  return {
    group: group,
    description: "Metallic Hydrogen. Under extreme pressure (e.g., inside Jupiter), hydrogen molecules dissociate into a lattice of protons submerged in a degenerate electron sea.",
    parts: [
      { name: "Proton Lattice", material: "Nuclei", function: "Arranged in a highly compressed crystal structure." },
      { name: "Electron Sea", material: "Delocalized Electrons", function: "Electrons flow freely, granting metallic conductivity." },
      { name: "High Pressure Phase", material: "State", function: "Requires >400 GPa of pressure." }
    ]
  };
}
