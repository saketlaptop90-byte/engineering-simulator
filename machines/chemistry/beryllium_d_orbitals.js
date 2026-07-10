import * as THREE from 'three';

export function createBerylliumDOrbitals() {
  const group = new THREE.Group();
  
  // Beryllium does NOT use d orbitals (empty 3d is very high energy), but we conceptually show the shape
  
  const createClover = (color, rotX, rotY, rotZ) => {
      const cl = new THREE.Group();
      const lobeGeo = new THREE.SphereGeometry(0.8, 32, 32);
      lobeGeo.scale(1, 2, 1);
      const matPos = new THREE.MeshPhysicalMaterial({ color: color, transparent: true, opacity: 0.15, transmission: 0.9, depthWrite: false });
      const matNeg = new THREE.MeshPhysicalMaterial({ color: 0x555555, transparent: true, opacity: 0.15, transmission: 0.9, depthWrite: false });
      
      const positions = [[1.5, 1.5, 0], [-1.5, -1.5, 0], [1.5, -1.5, 0], [-1.5, 1.5, 0]];
      
      positions.forEach((pos, i) => {
          const isPos = i < 2;
          const lobe = new THREE.Mesh(lobeGeo, isPos ? matPos : matNeg);
          lobe.position.set(...pos);
          // Rotate lobe to point outward
          lobe.lookAt(new THREE.Vector3(0,0,0));
          cl.add(lobe);
      });
      
      cl.rotation.set(rotX, rotY, rotZ);
      return cl;
  };

  const dxy = createClover(0xff8800, 0, 0, 0);
  const dyz = createClover(0x00ff88, Math.PI/2, 0, 0);
  const dxz = createClover(0x8800ff, 0, Math.PI/2, 0);
  
  // dz2 has a donut
  const dz2 = new THREE.Group();
  const lobeGeo = new THREE.SphereGeometry(0.8, 32, 32); lobeGeo.scale(1,2,1);
  const matPos = new THREE.MeshPhysicalMaterial({ color: 0xffff00, transparent: true, opacity: 0.15, depthWrite: false });
  const matDonut = new THREE.MeshPhysicalMaterial({ color: 0x555555, transparent: true, opacity: 0.15, depthWrite: false });
  const l1 = new THREE.Mesh(lobeGeo, matPos); l1.position.y = 1.8; dz2.add(l1);
  const l2 = new THREE.Mesh(lobeGeo, matPos); l2.position.y = -1.8; dz2.add(l2);
  const donut = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.4, 16, 64), matDonut);
  donut.rotation.x = Math.PI/2;
  dz2.add(donut);

  group.add(dxy); group.add(dyz); group.add(dxz); group.add(dz2);
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16), new THREE.MeshBasicMaterial({color: 0xffffff})));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.1;
      group.rotation.z += delta * 0.05;
      
      // Flash them very faintly to show they are unoccupied / high energy states
      const op = 0.05 + Math.sin(time*2)*0.05;
      dxy.children.forEach(c => c.material.opacity = op);
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
