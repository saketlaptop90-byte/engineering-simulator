import * as THREE from 'three';

export function createBerylliumCovalentBonding() {
  const group = new THREE.Group();
  
  // Simulate BeCl2 (Linear covalent molecule)
  // Be in center
  const be = new THREE.Group();
  be.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.8})));
  be.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  
  // Cl atoms
  const clLeft = new THREE.Group();
  clLeft.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.6})));
  clLeft.position.set(-3.5, 0, 0);
  
  const clRight = new THREE.Group();
  clRight.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.6})));
  clRight.position.set(3.5, 0, 0);
  
  group.add(be); group.add(clLeft); group.add(clRight);

  // Shared electrons! (The covalent bonds)
  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({color: 0xffff00});
  
  // Left bond (2 electrons shared)
  const bL1 = new THREE.Mesh(eGeo, eMat); group.add(bL1);
  const bL2 = new THREE.Mesh(eGeo, eMat); group.add(bL2);
  
  // Right bond (2 electrons shared)
  const bR1 = new THREE.Mesh(eGeo, eMat); group.add(bR1);
  const bR2 = new THREE.Mesh(eGeo, eMat); group.add(bR2);

  // Bond overlap glow
  const glowGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
  glowGeo.rotateZ(Math.PI/2);
  const glowMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending});
  const g1 = new THREE.Mesh(glowGeo, glowMat); g1.position.x = -1.75; group.add(g1);
  const g2 = new THREE.Mesh(glowGeo, glowMat); g2.position.x = 1.75; group.add(g2);

  group.add(new THREE.AmbientLight(0xffffff, 1));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      group.rotation.z = Math.sin(time)*0.1; // slight wobble
      
      // Animate shared electrons in figure-8 or circular orbits between atoms
      bL1.position.set(-1.75 + Math.cos(time*5)*0.5, Math.sin(time*5)*0.3, 0);
      bL2.position.set(-1.75 + Math.cos(time*5+Math.PI)*0.5, Math.sin(time*5+Math.PI)*0.3, 0);
      
      bR1.position.set(1.75 + Math.cos(time*5)*0.5, Math.sin(time*5)*0.3, 0);
      bR2.position.set(1.75 + Math.cos(time*5+Math.PI)*0.5, Math.sin(time*5+Math.PI)*0.3, 0);
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
