import * as THREE from 'three';
export function createHydrogenIsotopes() {
  const group = new THREE.Group();
  
  const createNucleus = (protons, neutrons, xOffset) => {
      const nGroup = new THREE.Group();
      for(let i=0; i<protons; i++){
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xff0000}));
          p.position.set(Math.random()*0.2, Math.random()*0.2, Math.random()*0.2);
          nGroup.add(p);
      }
      for(let i=0; i<neutrons; i++){
          const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshStandardMaterial({color: 0xcccccc}));
          n.position.set(Math.random()*0.4 - 0.2, Math.random()*0.4 - 0.2, Math.random()*0.4 - 0.2);
          nGroup.add(n);
      }
      
      const orbitCurve = new THREE.EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0);
      const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(50)), new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 }));
      orbitLine.rotation.x = Math.PI / 2;
      
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
      e.position.set(2, 0, 0);
      
      nGroup.add(orbitLine);
      nGroup.add(e);
      
      nGroup.position.x = xOffset;
      return nGroup;
  };

  const protium = createNucleus(1, 0, -4);
  const deuterium = createNucleus(1, 1, 0);
  const tritium = createNucleus(1, 2, 4);

  group.add(protium);
  group.add(deuterium);
  group.add(tritium);

  return {
    group: group,
    description: "The three isotopes of Hydrogen: Protium (1H), Deuterium (2H), and Tritium (3H).",
    parts: [
      { name: "Protium (Left)", material: "1 Proton", function: "Most common isotope." },
      { name: "Deuterium (Center)", material: "1 Proton, 1 Neutron", function: "Stable isotope, used in heavy water." },
      { name: "Tritium (Right)", material: "1 Proton, 2 Neutrons", function: "Radioactive isotope." }
    ]
  };
}
