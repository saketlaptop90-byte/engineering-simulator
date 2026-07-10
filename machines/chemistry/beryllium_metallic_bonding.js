import * as THREE from 'three';

export function createBerylliumMetallicBonding() {
  const group = new THREE.Group();
  
  // Lattice of Be2+ ions
  const lattice = new THREE.Group();
  const ionGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const ionMat = new THREE.MeshStandardMaterial({color: 0xaa2222, emissive: 0x440000});
  
  for(let x=-2; x<=2; x+=2) {
      for(let y=-2; y<=2; y+=2) {
          for(let z=-2; z<=2; z+=2) {
              const ion = new THREE.Mesh(ionGeo, ionMat);
              ion.position.set(x,y,z);
              lattice.add(ion);
          }
      }
  }
  group.add(lattice);
  
  // Sea of electrons (particles zooming freely around the lattice)
  const sea = new THREE.Group();
  const eGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  const electrons = [];
  
  for(let i=0; i<50; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      // Random starting positions inside lattice
      e.position.set((Math.random()-0.5)*6, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
      sea.add(e);
      // Random velocities
      electrons.push({
          mesh: e,
          vel: new THREE.Vector3((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5)
      });
  }
  group.add(sea);
  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 20));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      group.rotation.x += delta * 0.05;
      
      electrons.forEach(el => {
          el.mesh.position.addScaledVector(el.vel, delta);
          
          // Bounce off bounds
          if(Math.abs(el.mesh.position.x) > 3) el.vel.x *= -1;
          if(Math.abs(el.mesh.position.y) > 3) el.vel.y *= -1;
          if(Math.abs(el.mesh.position.z) > 3) el.vel.z *= -1;
      });
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
