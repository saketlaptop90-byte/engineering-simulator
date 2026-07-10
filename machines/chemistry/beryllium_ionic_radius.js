import * as THREE from 'three';

export function createBerylliumIonicRadius() {
  const group = new THREE.Group();
  
  // Compare Atomic (105 pm) vs Ionic Be2+ (45 pm)
  
  // Ghost of the original atomic radius (105 pm -> scale 3.0)
  const atomicShell = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 32), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(atomicShell);
  
  // Solid Ionic radius (45 pm -> scale ~1.3)
  const ionicShell = new THREE.Mesh(new THREE.SphereGeometry(1.3, 64, 64), new THREE.MeshPhysicalMaterial({color: 0xffaa00, transparent: true, opacity: 0.8, transmission: 0.5, side: THREE.DoubleSide}));
  group.add(ionicShell);
  
  // Nucleus +4
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);
  
  // Show 2 electrons leaving (Ionization)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(e1); group.add(e2);
  
  // Measurement rulers
  const geo1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0, 3.0, 0)]);
  const geo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1.3, 0, 0)]);
  group.add(new THREE.Line(geo1, new THREE.LineBasicMaterial({color: 0x555555})));
  group.add(new THREE.Line(geo2, new THREE.LineBasicMaterial({color: 0xffffff})));

  group.userData.animate = function(delta, time) {
      atomicShell.rotation.y -= delta * 0.1;
      ionicShell.rotation.y += delta * 0.2;
      
      // Loop: electrons in valence shell -> fly away -> radius shrinks (visual loop)
      const t = time % 4;
      if (t < 1) {
          // Normal atomic state
          e1.position.set(-3.0, 0, 0);
          e2.position.set(3.0, 0, 0);
          ionicShell.scale.setScalar(3.0/1.3); // Swells up to atomic radius size
          ionicShell.material.color.setHex(0x0088ff);
      } else if (t < 2) {
          // Ionization happening!
          const prog = t - 1;
          e1.position.x = -3.0 - prog * 5; // fly away
          e1.position.y = prog * 2;
          e2.position.x = 3.0 + prog * 5;
          e2.position.y = prog * 2;
          
          // Radius collapses rapidly!
          const scale = THREE.MathUtils.lerp(3.0/1.3, 1.0, prog);
          ionicShell.scale.setScalar(scale);
          // Color shifts from blue to gold (cation)
          ionicShell.material.color.setHex(0x0088ff).lerp(new THREE.Color(0xffaa00), prog);
      } else {
          // Ionized state (Be2+)
          e1.position.set(999,999,999); // hidden
          e2.position.set(999,999,999);
          ionicShell.scale.setScalar(1.0);
          ionicShell.material.color.setHex(0xffaa00);
          
          // Slight pulse to show dense charge
          ionicShell.scale.setScalar(1.0 + Math.sin(time*10)*0.02);
      }
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Orbital Filling Sequence": "Follows the Aufbau principle: 1s -> 2s. The 1s subshell fills completely with 2 electrons before the 2s subshell begins filling.",
    "Valence Electrons": "2 electrons in the outermost 2s shell. These participate in chemical bonding.",
    "Core Electrons": "2 electrons tightly bound in the 1s shell. They do not participate in bonding and strongly shield the nucleus.",
    "Atomic Radius": "105 pm (Empirical). The distance from the center of the nucleus to the boundary of the surrounding electron cloud.",
    "Ionic Radius": "45 pm (for Be2+). When Beryllium loses its 2 valence electrons, the remaining 1s shell is pulled much closer by the +4 nuclear charge, shrinking the radius dramatically."
  };

  return group;
}
