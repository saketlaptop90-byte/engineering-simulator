import * as THREE from 'three';

export function createBerylliumIonicBonding() {
  const group = new THREE.Group();
  
  // Simulate BeO (Beryllium Oxide) lattice structure interaction
  // Be is small and highly charged (Be2+), O is large (O2-)
  
  const beGeo = new THREE.SphereGeometry(0.6, 16, 16);
  const beMat = new THREE.MeshStandardMaterial({color: 0xffaa00, roughness: 0.2}); // Be2+
  
  const oGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const oMat = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.2}); // O2-
  
  // Very simple alternating 2x2x2 lattice
  const lattice = new THREE.Group();
  const spacing = 1.8;
  
  for(let x=0; x<2; x++) {
      for(let y=0; y<2; y++) {
          for(let z=0; z<2; z++) {
              const isBe = (x+y+z) % 2 === 0;
              const mesh = new THREE.Mesh(isBe ? beGeo : oGeo, isBe ? beMat : oMat);
              mesh.position.set(x*spacing - spacing/2, y*spacing - spacing/2, z*spacing - spacing/2);
              lattice.add(mesh);
          }
      }
  }
  group.add(lattice);

  // Electrostatic lines of force (connecting Be to O)
  const lineMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
  lattice.children.forEach(c1 => {
      lattice.children.forEach(c2 => {
          if(c1 !== c2 && c1.geometry !== c2.geometry) { // If opposite charges
              if(c1.position.distanceTo(c2.position) <= spacing * 1.1) {
                  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([c1.position, c2.position]), lineMat);
                  lattice.add(line);
              }
          }
      });
  });

  group.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light = new THREE.PointLight(0xffffff, 1, 20);
  light.position.set(5,5,5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      group.rotation.x += delta * 0.1;
      group.rotation.y += delta * 0.2;
      
      // Jiggle to show thermal energy but strong ionic lock
      lattice.scale.setScalar(1 + Math.sin(time*10)*0.01);
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
