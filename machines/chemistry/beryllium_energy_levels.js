import * as THREE from 'three';

export function createBerylliumEnergyLevels() {
  const group = new THREE.Group();
  
  // Create a stylized 3D "Staircase" or "Energy Diagram"
  const stepMat = new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.8 });
  const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  // n=1 (1s)
  const level1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), stepMat);
  level1.position.set(0, -3, 0);
  group.add(level1);
  
  const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const e1_1 = new THREE.Mesh(eGeo, eMat); e1_1.position.set(-1, -2.8, 0); group.add(e1_1);
  const e1_2 = new THREE.Mesh(eGeo, eMat); e1_2.position.set(1, -2.8, 0); group.add(e1_2);

  // n=2 (2s)
  const level2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 6), stepMat);
  level2.position.set(0, 0, 0);
  group.add(level2);
  
  const e2_1 = new THREE.Mesh(eGeo, eMat); e2_1.position.set(-2, 0.2, 0); group.add(e2_1);
  const e2_2 = new THREE.Mesh(eGeo, eMat); e2_2.position.set(2, 0.2, 0); group.add(e2_2);

  // n=2 (2p) - Empty but exists slightly higher in energy
  const level2p = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 6), new THREE.MeshPhysicalMaterial({ color: 0xff0055, transparent: true, opacity: 0.2 }));
  level2p.position.set(0, 1.5, 0);
  group.add(level2p);

  // Connection lines (Energy gap)
  const lineMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.2 });
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 0, 0)]);
  const gapLine = new THREE.Line(geo, lineMat);
  gapLine.computeLineDistances();
  group.add(gapLine);
  
  const geo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0)]);
  const gapLine2 = new THREE.Line(geo2, lineMat);
  gapLine2.computeLineDistances();
  group.add(gapLine2);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      // Bobbing electrons to show they have energy
      e1_1.position.y = -2.8 + Math.sin(time*5)*0.1;
      e1_2.position.y = -2.8 + Math.cos(time*5.5)*0.1;
      e2_1.position.y = 0.2 + Math.sin(time*4)*0.15;
      e2_2.position.y = 0.2 + Math.cos(time*4.5)*0.15;
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Energy Levels (n)": "Principal quantum number n=1 (K shell) has 2 electrons, n=2 (L shell) has 2 electrons.",
    "Subshells (l)": "s subshells (l=0) are spherical. Beryllium has filled 1s and 2s subshells. It has empty 2p subshells available for hybridization.",
    "s Orbitals": "Symmetric and spherical. The 2s orbital has a radial node.",
    "p Orbitals": "Dumbbell shaped along x, y, z axes. Beryllium's 2p orbitals are formally empty but participate in metallic bonding and hybridization (sp, sp2, sp3).",
    "d Orbitals": "Complex clover shapes. Empty and high energy for Beryllium (3d), but conceptually relevant for understanding atomic structure progression."
  };

  return group;
}
