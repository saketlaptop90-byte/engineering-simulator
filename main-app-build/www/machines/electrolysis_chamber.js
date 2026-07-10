import * as THREE from 'three';

export function createElectrolysisChamber() {
  const group = new THREE.Group();
  
  // Main Tank
  const tankGeo = new THREE.BoxGeometry(6, 4, 4);
  const tankMat = new THREE.MeshPhysicalMaterial({ color: 0xccffff, transmission: 0.7, opacity: 1, transparent: true, roughness: 0.1 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.y = 2;
  group.add(tank);

  // Electrodes
  const electrodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
  const electrodeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
  
  const anode = new THREE.Mesh(electrodeGeo, electrodeMat);
  anode.position.set(-1.5, 2, 0);
  group.add(anode);

  const cathode = new THREE.Mesh(electrodeGeo, electrodeMat);
  cathode.position.set(1.5, 2, 0);
  group.add(cathode);

  // Gas collection tubes
  const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
  const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transmission: 0.9, opacity: 1, transparent: true });
  
  const oxygenTube = new THREE.Mesh(tubeGeo, tubeMat);
  oxygenTube.position.set(-1.5, 4.5, 0);
  group.add(oxygenTube);

  const hydrogenTube = new THREE.Mesh(tubeGeo, tubeMat);
  hydrogenTube.position.set(1.5, 4.5, 0);
  group.add(hydrogenTube);

  return {
    model: group,
    description: "An electrolysis chamber splits water into hydrogen and oxygen gases using an electric current.",
    parts: [
      { name: "Electrolyte Tank", material: "Glass / Plastic", function: "Holds the water and electrolyte solution." },
      { name: "Anode (Positive)", material: "Platinum / Graphite", function: "Attracts oxygen ions to form O2 gas." },
      { name: "Cathode (Negative)", material: "Platinum / Graphite", function: "Attracts hydrogen ions to form H2 gas." },
      { name: "Oxygen Collection Tube", material: "Glass", function: "Captures the generated Oxygen gas." },
      { name: "Hydrogen Collection Tube", material: "Glass", function: "Captures the generated Hydrogen gas (twice the volume of O2)." }
    ]
  };
}
