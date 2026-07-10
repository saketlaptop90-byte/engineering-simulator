import * as THREE from 'three';

export function createBerylliumSubshells() {
  const group = new THREE.Group();
  
  // Visualize nested spherical subshells (1s and 2s)
  const s1Geo = new THREE.SphereGeometry(1.5, 32, 32);
  const s1Mat = new THREE.MeshPhysicalMaterial({ color: 0xff5500, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const s1 = new THREE.Mesh(s1Geo, s1Mat);
  group.add(s1);
  
  const s2Geo = new THREE.SphereGeometry(3.5, 32, 32);
  const s2Mat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const s2 = new THREE.Mesh(s2Geo, s2Mat);
  group.add(s2);

  // Add small orbiting particles to represent the 2 electrons in each subshell
  const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const electrons = [];
  
  for(let i=0; i<4; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      group.add(e);
      const is1s = i < 2;
      electrons.push({
          mesh: e,
          radius: is1s ? 1.5 : 3.5,
          angle: i * Math.PI,
          speed: is1s ? 3 : 1.5,
          tilt: is1s ? 0 : Math.PI/2
      });
  }

  // Cross section plane to cut away half the shells for viewing inside
  const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.5);
  s1Mat.clippingPlanes = [clipPlane];
  s2Mat.clippingPlanes = [clipPlane];
  
  // Enable local clipping in renderer later, but for now just use a visual wireframe trick if clipping isn't active
  const w1 = new THREE.Mesh(s1Geo, new THREE.MeshBasicMaterial({color:0xff5500, wireframe: true, transparent: true, opacity: 0.2}));
  const w2 = new THREE.Mesh(s2Geo, new THREE.MeshBasicMaterial({color:0x00aaff, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(w1); group.add(w2);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      electrons.forEach(el => {
          el.angle += delta * el.speed;
          const x = Math.cos(el.angle) * el.radius;
          const z = Math.sin(el.angle) * el.radius;
          
          if(el.tilt === 0) {
              el.mesh.position.set(x, 0, z);
          } else {
              el.mesh.position.set(0, x, z);
          }
      });
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
