import * as THREE from 'three';

export function createBerylliumDipoleInteractions() {
  const group = new THREE.Group();
  
  // Asymmetric molecule: BeClF (Fluorine is highly electronegative, Chlorine less so)
  
  // F (left)
  const f = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.8}));
  f.position.x = -2;
  group.add(f);
  
  // Be (center)
  const be = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.8}));
  group.add(be);
  
  // Cl (right)
  const cl = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xaaaa00, transparent: true, opacity: 0.8}));
  cl.position.x = 2.5;
  group.add(cl);

  // Dipole Moment Arrow (points toward F, which is more electronegative)
  const arrowGroup = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  shaft.rotation.z = Math.PI/2;
  arrowGroup.add(shaft);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  head.position.x = -1.5;
  head.rotation.z = Math.PI/2;
  arrowGroup.add(head);
  // Cross at tail (positive end)
  const cross = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  cross.position.x = 1.3;
  arrowGroup.add(cross);
  
  arrowGroup.position.y = 1.5;
  group.add(arrowGroup);

  // Electron cloud density shift
  const density = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1, depthWrite: false}));
  density.scale.set(3, 1, 1);
  group.add(density);

  group.add(new THREE.AmbientLight(0xffffff, 0.8));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.3;
      group.rotation.z = Math.sin(time)*0.1;
      
      // Pulse the dipole arrow
      arrowGroup.scale.x = 1 + Math.sin(time*4)*0.1;
      
      // Shift density cloud toward Fluorine back and forth slightly
      density.position.x = -0.5 + Math.sin(time*3)*0.2;
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
