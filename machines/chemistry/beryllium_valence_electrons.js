import * as THREE from 'three';

export function createBerylliumValenceElectrons() {
  const group = new THREE.Group();
  
  // Highlight ONLY the outer 2s shell and dim the core
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x222222, transparent: true, opacity: 0.5}));
  group.add(core);

  // Glowing Valence Shell
  const valShell = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3, emissive: 0x004444, side: THREE.DoubleSide}));
  group.add(valShell);
  
  // Valence electrons (vivid)
  const v1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x00ffff}));
  const v2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x00ffff}));
  group.add(v1); group.add(v2);
  
  // Core electrons (dim)
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444}));
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x444444}));
  group.add(c1); group.add(c2);

  // Add a glowing halo connecting the two valence electrons to show they are a "pair" ready for bonding
  const haloGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
  const haloMat = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending});
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI/2;
  group.add(halo);

  const light = new THREE.PointLight(0xffffff, 2, 10);
  group.add(light);

  group.userData.animate = function(delta, time) {
      valShell.rotation.x += delta * 0.1;
      valShell.rotation.y += delta * 0.2;
      
      // Orbit valence
      v1.position.set(Math.cos(time)*3, 0, Math.sin(time)*3);
      v2.position.set(Math.cos(time+Math.PI)*3, 0, Math.sin(time+Math.PI)*3);
      
      // Orbit core
      c1.position.set(Math.cos(time*3)*1, Math.sin(time*3)*1, 0);
      c2.position.set(Math.cos(time*3+Math.PI)*1, Math.sin(time*3+Math.PI)*1, 0);
      
      halo.scale.setScalar(1 + Math.sin(time*4)*0.02);
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
