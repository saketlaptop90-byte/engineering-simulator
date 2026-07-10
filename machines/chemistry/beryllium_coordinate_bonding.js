import * as THREE from 'three';

export function createBerylliumCoordinateBonding() {
  const group = new THREE.Group();
  
  // Beryllium is electron deficient in BeCl2 (only 4 electrons in valence).
  // It accepts lone pairs from 2 other molecules (e.g., Ether or Water) to reach an octet (sp3 tetrahedral)
  
  // Central Be
  const be = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.8}));
  group.add(be);
  
  // 4 ligands in tetrahedral arrangement
  // Let's say 2 Cl (normal covalent) and 2 H2O (coordinate covalent)
  
  const createLigand = (color, isCoordinate) => {
      const ligGroup = new THREE.Group();
      ligGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: color, transparent: true, opacity: 0.6})));
      
      // Bond tube
      const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), bondMat);
      bond.position.y = -1.5;
      ligGroup.add(bond);
      
      // If coordinate, show both electrons coming from the ligand!
      if(isCoordinate) {
          const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
          const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
          e1.position.set(0.3, -1.5, 0);
          e2.position.set(-0.3, -1.5, 0);
          ligGroup.add(e1); ligGroup.add(e2);
          
          // Animate them moving from ligand TO central Be
          ligGroup.userData.animate = (time) => {
              const t = (time % 2) / 2; // 0 to 1 loop
              e1.position.y = -3.0 + t * 2.5; // move up tube
              e2.position.y = -3.0 + t * 2.5;
              e1.material.opacity = 1-t; e1.transparent = true;
              e2.material.opacity = 1-t; e2.transparent = true;
          };
      }
      
      return ligGroup;
  };

  // Tetrahedral angles
  const t = Math.acos(-1/3); // ~109.5 deg
  
  const cl1 = createLigand(0x00ff00, false);
  cl1.position.set(0, 3, 0);
  group.add(cl1);
  
  const cl2 = createLigand(0x00ff00, false);
  cl2.position.set(3*Math.sin(t), 3*Math.cos(t), 0);
  cl2.lookAt(0,0,0);
  group.add(cl2);
  
  const h2o1 = createLigand(0xff0000, true);
  h2o1.position.set(3*Math.sin(t)*Math.cos(2*Math.PI/3), 3*Math.cos(t), 3*Math.sin(t)*Math.sin(2*Math.PI/3));
  h2o1.lookAt(0,0,0);
  group.add(h2o1);
  
  const h2o2 = createLigand(0xff0000, true);
  h2o2.position.set(3*Math.sin(t)*Math.cos(4*Math.PI/3), 3*Math.cos(t), 3*Math.sin(t)*Math.sin(4*Math.PI/3));
  h2o2.lookAt(0,0,0);
  group.add(h2o2);

  group.add(new THREE.AmbientLight(0xffffff, 1));

  group.userData.animate = function(delta, time) {
      group.rotation.x += delta * 0.1;
      group.rotation.y += delta * 0.3;
      
      h2o1.userData.animate(time*2);
      h2o2.userData.animate(time*2 + 1); // offset phase
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Covalent Radius": "89 pm. Measured as half the distance between two covalently bonded Beryllium atoms.",
    "Metallic Bonding": "In solid metal form, Be atoms release their 2 valence electrons into a 'sea' of delocalized electrons, creating strong metallic bonds.",
    "Ionic Bonding": "Beryllium rarely forms purely ionic bonds due to its high ionization energy and small size, but BeO is a classic example of highly polar/ionic interaction.",
    "Covalent Bonding": "Be often forms covalent bonds (e.g., BeCl2) by sharing its 2 valence electrons, defying the octet rule (it only gets 4 valence electrons).",
    "Coordinate Bonding": "Because Be is electron-deficient (only 4 valence electrons in BeCl2), it readily accepts lone pairs from other molecules (like H2O or Cl-) to form coordinate covalent bonds, reaching an octet."
  };

  return group;
}
