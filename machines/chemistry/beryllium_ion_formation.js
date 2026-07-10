import * as THREE from 'three';

export function createBerylliumIonFormation() {
  const group = new THREE.Group();
  
  // Show neutral atom, add energy (photons), eject 2 electrons!
  
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffaa00, transparent: true, opacity: 0.8}));
  group.add(core);
  
  const valShell = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({color: 0x00aaff, transparent: true, opacity: 0.2, wireframe: true}));
  group.add(valShell);
  
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(e1); group.add(e2);
  
  // Incoming energy (laser/photon)
  const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0}));
  laser.rotation.z = Math.PI/2;
  group.add(laser);

  group.userData.animate = function(delta, time) {
      valShell.rotation.y += delta * 0.5;
      
      const t = time % 5; // 5 second story loop
      
      if(t < 2) {
          // Orbit normally
          e1.position.set(Math.cos(time*3)*3, Math.sin(time*3)*3, 0);
          e2.position.set(Math.cos(time*3+Math.PI)*3, Math.sin(time*3+Math.PI)*3, 0);
          laser.material.opacity = 0;
          valShell.material.opacity = 0.2;
          core.scale.setScalar(1.0);
      } else if (t < 2.5) {
          // Zap!
          laser.material.opacity = 1;
          laser.position.x = -5 + (t-2)*2 * 5; // move fast
      } else if (t < 4) {
          // Ejection!
          const prog = t - 2.5;
          laser.material.opacity = 0;
          
          e1.position.x += prog * delta * 50;
          e1.position.y += prog * delta * 50;
          
          e2.position.x -= prog * delta * 50;
          e2.position.y += prog * delta * 50;
          
          valShell.material.opacity -= delta;
          
          // Core shrinks tighter because it's now +2
          core.scale.setScalar(1.0 - prog*0.2);
          core.material.emissive.setHex(0x550000); // gets hot/charged
      } else {
          // Rest waiting for loop
          e1.position.set(999,999,999);
          e2.position.set(999,999,999);
      }
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
