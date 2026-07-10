import * as THREE from 'three';

export function createBerylliumElectronTransitions() {
  const group = new THREE.Group();
  
  // Create 3 concentric orbital rings
  const ringGeo = new THREE.TorusGeometry(1, 0.02, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({color: 0x555555});
  
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 16, 64), ringMat); r1.rotation.x = Math.PI/2; group.add(r1);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.02, 16, 64), ringMat); r2.rotation.x = Math.PI/2; group.add(r2);
  const r3 = new THREE.Mesh(new THREE.TorusGeometry(4, 0.02, 16, 64), ringMat); r3.rotation.x = Math.PI/2; group.add(r3);
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);
  
  // The jumping electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00aaff}));
  group.add(e);
  
  // Flash ring to show jump
  const flash = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.2, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0}));
  flash.rotation.x = Math.PI/2;
  group.add(flash);
  
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      group.rotation.x = 0.2; // slight tilt
      
      const t = time % 6; // 6 sec cycle
      const angle = time * 2;
      
      let radius = 1;
      
      if(t < 2) {
          radius = 1; // Level 1
      } else if (t < 4) {
          radius = 2.5; // Jump to Level 2
      } else {
          radius = 4; // Jump to Level 3
      }
      
      // Quantized jump logic - instant teleport
      e.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
      
      // Flash effect exactly when jumping (t crosses integer boundaries)
      const flashT = time % 2;
      if (flashT < 0.2) {
          flash.position.copy(e.position);
          flash.scale.setScalar(1 + flashT * 20);
          flash.material.opacity = 1 - (flashT * 5);
      } else {
          flash.material.opacity = 0;
      }
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Electron Transitions": "Electrons can instantly jump between quantized energy levels. They cannot exist between levels.",
    "Excited States": "For Be, a common transition is promoting a 2s electron to the empty 2p orbital (2s1 2p1), preparing the atom for bonding.",
    "Photon Emission": "When an excited electron falls back to a lower energy state (e.g., 2p -> 2s), it releases a photon of exactly the energy difference.",
    "Photon Absorption": "An electron can only jump to a higher energy level if it absorbs a photon with the exact resonant energy matching the gap.",
    "Spectral Lines": "Because transitions are strictly quantized, Beryllium emits and absorbs light only at highly specific wavelengths (forming its unique atomic spectrum)."
  };

  return group;
}
