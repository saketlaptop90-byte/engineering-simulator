import * as THREE from 'three';

export function createBerylliumElectronSpin() {
  const group = new THREE.Group();
  
  // Show 1s and 2s orbitals as glowing tracks, and electrons as arrows spinning on their axes
  const trackGeo = new THREE.TorusGeometry(3, 0.05, 8, 64);
  const trackMat = new THREE.MeshBasicMaterial({color: 0x555555, transparent: true, opacity: 0.3});
  group.add(new THREE.Mesh(trackGeo, trackMat));
  
  const trackGeo2 = new THREE.TorusGeometry(5, 0.05, 8, 64);
  group.add(new THREE.Mesh(trackGeo2, trackMat));

  const createSpinElectron = (radius, angleOffset, spinUp) => {
      const eGroup = new THREE.Group();
      
      // Sphere
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x0055aa}));
      eGroup.add(sphere);
      
      // Arrow (Up or Down)
      const arrowGeo = new THREE.CylinderGeometry(0, 0.2, 1, 12);
      arrowGeo.translate(0, 0.5, 0);
      const arrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({color: spinUp ? 0x00ff00 : 0xff0000}));
      if(!spinUp) arrow.rotation.x = Math.PI;
      eGroup.add(arrow);
      
      // Spin trails
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.6, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
      ring.rotation.x = Math.PI/2;
      eGroup.add(ring);
      
      group.add(eGroup);
      return { group: eGroup, radius: radius, angle: angleOffset, spinUp: spinUp };
  };

  const electrons = [
      createSpinElectron(3, 0, true),
      createSpinElectron(3, Math.PI, false),
      createSpinElectron(5, Math.PI/2, true),
      createSpinElectron(5, -Math.PI/2, false)
  ];

  const light = new THREE.PointLight(0xffffff, 1, 10);
  group.add(light);

  group.userData.animate = function(delta, time) {
      group.rotation.x = 0.5; // Tilt scene slightly
      
      electrons.forEach(e => {
          e.angle += delta;
          e.group.position.set(Math.cos(e.angle)*e.radius, 0, Math.sin(e.angle)*e.radius);
          // Spin on own axis
          e.group.rotation.y += delta * (e.spinUp ? 5 : -5);
      });
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electronic Configuration": "1s² 2s²",
    "Orbital Overlap": "In metallic Be, atomic orbitals overlap to form continuous delocalized bands.",
    "Orbital Hybridization": "To form bonds (e.g., BeCl2), the 2s electron is promoted to 2p, forming two linear sp hybrid orbitals (180°).",
    "Electron Spin (ms)": "Intrinsic angular momentum. In each orbital (1s, 2s), electrons must pair with opposite spins (+1/2, -1/2).",
    "Pauli Exclusion Principle": "No two electrons in a Be atom can have the same four quantum numbers (n, l, ml, ms). Thus, a maximum of 2 electrons per orbital with opposite spins.",
    "Hund's Rule": "States that for degenerate orbitals (like 2p), electrons fill singly first. Since Be's ground state has empty 2p orbitals, Hund's rule applies during excitation/hybridization."
  };

  return group;
}
