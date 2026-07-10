import * as THREE from 'three';

export function createBerylliumVanDerWaals() {
  const group = new THREE.Group();
  
  // Two neutral Beryllium atoms in vapor phase interacting via induced dipoles
  const createAtom = (x) => {
      const atom = new THREE.Group();
      atom.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}))); // Nucleus
      
      // Electron cloud (deformable)
      const cloudGeo = new THREE.SphereGeometry(1.5, 32, 32);
      const cloudMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.3, depthWrite: false});
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      atom.add(cloud);
      
      atom.position.x = x;
      return { group: atom, cloud: cloud };
  };

  const a1 = createAtom(-2);
  const a2 = createAtom(2);
  group.add(a1.group); group.add(a2.group);

  // Interaction waves (London dispersion forces)
  const waveGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 64);
  const waveMat = new THREE.MeshBasicMaterial({color: 0xffaaff, transparent: true, opacity: 0.5});
  const wave1 = new THREE.Mesh(waveGeo, waveMat); wave1.rotation.y = Math.PI/2;
  const wave2 = new THREE.Mesh(waveGeo, waveMat); wave2.rotation.y = Math.PI/2;
  group.add(wave1); group.add(wave2);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      
      // Simulate instantaneous dipole induction!
      // The electron clouds slosh back and forth together.
      const slosh = Math.sin(time * 2) * 0.3;
      
      // Deform clouds slightly and shift them off-center from nucleus
      a1.cloud.position.x = slosh;
      a2.cloud.position.x = slosh; // Induces the same direction
      
      // If slosh is positive, left side of cloud is positive, right is negative
      // We'll use scale to make it slightly egg-shaped
      a1.cloud.scale.set(1 + Math.abs(slosh)*0.2, 1 - Math.abs(slosh)*0.1, 1 - Math.abs(slosh)*0.1);
      a2.cloud.scale.set(1 + Math.abs(slosh)*0.2, 1 - Math.abs(slosh)*0.1, 1 - Math.abs(slosh)*0.1);
      
      // Animate interaction waves between them
      const t = time % 1; // 1 second loop
      wave1.position.x = -1.5 + t * 3.0; // Travel from left to right
      wave1.scale.setScalar(1 + t*2);
      wave1.material.opacity = 0.5 * (1-t);
      
      wave2.position.x = 1.5 - t * 3.0; // Travel from right to left
      wave2.scale.setScalar(1 + t*2);
      wave2.material.opacity = 0.5 * (1-t);
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
