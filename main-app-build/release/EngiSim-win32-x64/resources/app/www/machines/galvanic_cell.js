import * as THREE from 'three';

export function createGalvanicCell() {
  const group = new THREE.Group();
  
  // Beaker 1 (Anode)
  const beaker1Geo = new THREE.CylinderGeometry(2, 2, 4, 32);
  const beaker1Mat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transmission: 0.9, opacity: 1, transparent: true });
  const beaker1 = new THREE.Mesh(beaker1Geo, beaker1Mat);
  beaker1.position.set(-3, 2, 0);
  group.add(beaker1);

  // Beaker 2 (Cathode)
  const beaker2Geo = new THREE.CylinderGeometry(2, 2, 4, 32);
  const beaker2Mat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transmission: 0.9, opacity: 1, transparent: true });
  const beaker2 = new THREE.Mesh(beaker2Geo, beaker2Mat);
  beaker2.position.set(3, 2, 0);
  group.add(beaker2);

  // Salt Bridge
  const bridgeGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-3, 4, 0),
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(3, 4, 0)
  ), 20, 0.4, 8, false);
  const bridgeMat = new THREE.MeshPhysicalMaterial({ color: 0xddddff, transmission: 0.8, transparent: true });
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  group.add(bridge);

  // Zinc Anode
  const anodeGeo = new THREE.BoxGeometry(0.8, 3, 0.2);
  const anodeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.4 });
  const anode = new THREE.Mesh(anodeGeo, anodeMat);
  anode.position.set(-3, 2, 0);
  group.add(anode);

  // Copper Cathode
  const cathodeGeo = new THREE.BoxGeometry(0.8, 3, 0.2);
  const cathodeMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 });
  const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
  cathode.position.set(3, 2, 0);
  group.add(cathode);

  return {
    model: group,
    description: "An electrochemical cell that derives electrical energy from spontaneous redox reactions taking place within the cell.",
    parts: [
      { name: "Anode Beaker", material: "Glass", function: "Holds the oxidation half-reaction electrolyte." },
      { name: "Cathode Beaker", material: "Glass", function: "Holds the reduction half-reaction electrolyte." },
      { name: "Salt Bridge", material: "Glass / Gel", function: "Maintains electrical neutrality by allowing ion flow." },
      { name: "Zinc Anode", material: "Zinc", function: "Undergoes oxidation, releasing electrons." },
      { name: "Copper Cathode", material: "Copper", function: "Undergoes reduction, accepting electrons." }
    ]
  };
}
