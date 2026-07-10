import * as THREE from 'three';

export function createHydrogenFuelCell() {
  const group = new THREE.Group();
  
  // Membrane
  const membraneGeo = new THREE.BoxGeometry(0.5, 4, 4);
  const membraneMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.2 });
  const membrane = new THREE.Mesh(membraneGeo, membraneMat);
  group.add(membrane);

  // Anode
  const anodeGeo = new THREE.BoxGeometry(0.5, 3.8, 3.8);
  const anodeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.5 });
  const anode = new THREE.Mesh(anodeGeo, anodeMat);
  anode.position.x = -0.55;
  group.add(anode);

  // Cathode
  const cathodeGeo = new THREE.BoxGeometry(0.5, 3.8, 3.8);
  const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9, metalness: 0.5 });
  const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathode.position.x = 0.55;
  group.add(cathode);

  // Casing
  const casingGeo = new THREE.BoxGeometry(2, 4.5, 4.5);
  const casingMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.3 });
  const casing = new THREE.Mesh(casingGeo, casingMat);
  group.add(casing);

  return {
    model: group,
    description: "A hydrogen fuel cell converts the chemical energy of hydrogen and oxygen into electricity.",
    parts: [
      { name: "Proton Exchange Membrane", material: "Polymer", function: "Allows protons to pass through but blocks electrons." },
      { name: "Anode (Negative)", material: "Platinum-coated Carbon", function: "Splits hydrogen molecules into protons and electrons." },
      { name: "Cathode (Positive)", material: "Platinum-coated Carbon", function: "Combines protons, electrons, and oxygen to form water." },
      { name: "Outer Casing", material: "Composite", function: "Houses the fuel cell components safely." }
    ]
  };
}
