import * as THREE from 'three';
export function createHydrogenFuelCellReaction() {
  const group = new THREE.Group();
  
  // Membrane
  const mem = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 4), new THREE.MeshPhysicalMaterial({ color: 0x888888, transparent: true, opacity: 0.7 }));
  group.add(mem);

  // Anode/Cathode labels implicitly
  
  // H2 incoming
  const h2 = new THREE.Group();
  const aMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
  const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), aMat); a1.position.y=0.3;
  const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), aMat); a2.position.y=-0.3;
  h2.add(a1); h2.add(a2);
  group.add(h2);

  // H+ through membrane
  const hPlus1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const hPlus2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(hPlus1); group.add(hPlus2);
  
  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      if(cycle < 2) {
          h2.visible = true; hPlus1.visible = false; hPlus2.visible = false;
          h2.position.set(-3 + cycle, 0, 0);
      } else {
          h2.visible = false; hPlus1.visible = true; hPlus2.visible = true;
          hPlus1.position.set(-1 + (cycle-2)*1.5, 0.5, 0);
          hPlus2.position.set(-1 + (cycle-2)*1.5, -0.5, 0);
      }
  };

  return {
    group: group,
    description: "Hydrogen Fuel Cell Anode Reaction: H2 -> 2H+ + 2e-. Protons pass through the membrane while electrons travel the external circuit.",
    parts: [
      { name: "H2 Molecule", material: "Gas", function: "Fuel enters anode." },
      { name: "Proton Exchange Membrane", material: "Polymer", function: "Allows only H+ ions to pass." },
      { name: "H+ Ions", material: "Protons", function: "Migrate to cathode to form water." }
    ]
  };
}
