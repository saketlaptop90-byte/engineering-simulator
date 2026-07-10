import * as THREE from 'three';

export function createBerylliumHydrogenBonding() {
  const group = new THREE.Group();
  
  // Visualize a [Be(H2O)4]2+ complex hydrogen bonding to a bulk water molecule
  
  // Central Be
  const be = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff}));
  group.add(be);
  
  // One coordinated water molecule
  const coordH2O = new THREE.Group();
  const ox1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  coordH2O.add(ox1);
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xdddddd}));
  h1.position.set(0.8, 0.8, 0); coordH2O.add(h1);
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xdddddd}));
  h2.position.set(-0.8, 0.8, 0); coordH2O.add(h2);
  
  coordH2O.position.set(0, 1.5, 0);
  group.add(coordH2O);
  
  // Coordinate bond
  const cBond = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  cBond.position.set(0, 0.75, 0);
  group.add(cBond);
  
  // Bulk water molecule
  const bulkH2O = new THREE.Group();
  const ox2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  bulkH2O.add(ox2);
  const h3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xdddddd}));
  h3.position.set(0.8, 0.8, 0); bulkH2O.add(h3);
  const h4 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xdddddd}));
  h4.position.set(-0.8, 0.8, 0); bulkH2O.add(h4);
  
  bulkH2O.position.set(2.5, 3, 0);
  bulkH2O.rotation.z = -Math.PI/4;
  group.add(bulkH2O);

  // The Hydrogen Bond (dotted/dashed pulsing line)
  const hBondGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.8, 2.3, 0), new THREE.Vector3(2.5, 3.0, 0)]);
  const hBondMat = new THREE.LineDashedMaterial({color: 0x00ffff, dashSize: 0.1, gapSize: 0.1, linewidth: 2});
  const hBond = new THREE.Line(hBondGeo, hBondMat);
  hBond.computeLineDistances();
  group.add(hBond);
  
  // Polarization visual (showing electron density pulling away from H)
  const deltaPlus = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending}));
  deltaPlus.position.copy(h1.position);
  coordH2O.add(deltaPlus);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.PointLight(0xffffff, 1, 10);
  light.position.set(5, 5, 5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      
      // Jiggle the bulk water due to thermal motion, stretching the H-bond
      bulkH2O.position.x = 2.5 + Math.sin(time*3)*0.2;
      bulkH2O.position.y = 3.0 + Math.cos(time*4)*0.2;
      
      hBond.geometry.setFromPoints([new THREE.Vector3(0.8, 2.3, 0), bulkH2O.position]);
      hBond.computeLineDistances();
      
      // Pulse H-bond strength
      hBond.material.opacity = 0.5 + Math.sin(time*8)*0.5;
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Hydrogen Bonding": "While Be itself doesn't form H-bonds, [Be(H2O)4]2+ complexes have highly polarized O-H bonds that form extraordinarily strong hydrogen bonds with surrounding water.",
    "van der Waals Interactions": "Weak induced dipole-dipole interactions. Only relevant in Beryllium vapor at extreme temperatures where Be atoms interact without bonding.",
    "Dipole Interactions": "In asymmetric complexes (e.g., BeClF), differences in electronegativity create permanent dipole moments across the Beryllium atom.",
    "Ion Formation": "Be has a high ionization energy for a metal. It loses 2s electrons to form Be2+, leaving a highly charge-dense 1s core.",
    "Oxidation and Reduction": "Beryllium acts as a reducing agent (is oxidized from Be to Be2+ by losing electrons) but is less reactive than other alkaline earth metals due to a passivating oxide layer."
  };

  return group;
}
