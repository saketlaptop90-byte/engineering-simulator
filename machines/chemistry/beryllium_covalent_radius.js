import * as THREE from 'three';

export function createBerylliumCovalentRadius() {
  const group = new THREE.Group();
  
  // Two Be atoms covalently bonded
  const createBe = (x) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})));
      g.add(new THREE.Mesh(new THREE.SphereGeometry(2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x0088ff, transparent: true, opacity: 0.3, depthWrite: false})));
      g.position.x = x;
      return g;
  };

  const be1 = createBe(-1.5);
  const be2 = createBe(1.5);
  group.add(be1); group.add(be2);
  
  // Bond visual
  const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
  bond.rotation.z = Math.PI/2;
  group.add(bond);

  // Ruler measuring distance between nuclei
  const rulerLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.5, 2.5, 0), new THREE.Vector3(1.5, 2.5, 0)]), new THREE.LineBasicMaterial({color: 0xffffff}));
  group.add(rulerLine);
  
  // Tick marks
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.5, 2.2, 0), new THREE.Vector3(-1.5, 2.8, 0)]), new THREE.LineBasicMaterial({color: 0xffffff})));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1.5, 2.2, 0), new THREE.Vector3(1.5, 2.8, 0)]), new THREE.LineBasicMaterial({color: 0xffffff})));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, 2.8, 0)]), new THREE.LineBasicMaterial({color: 0xff0000}))); // Center tick
  
  // Indicator for half distance (Covalent Radius)
  const radiusHighlight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.7}));
  radiusHighlight.position.set(-0.75, 2.7, 0);
  group.add(radiusHighlight);

  group.userData.animate = function(delta, time) {
      group.rotation.y = Math.sin(time*0.5)*0.2;
      radiusHighlight.scale.x = 1 + Math.sin(time*4)*0.05;
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
