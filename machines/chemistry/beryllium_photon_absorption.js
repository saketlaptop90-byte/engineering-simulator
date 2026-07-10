import * as THREE from 'three';

export function createBerylliumPhotonAbsorption() {
  const group = new THREE.Group();
  
  // Exact inverse of emission. Photon flies IN, hits electron, electron jumps OUT.
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);
  
  const trkMat = new THREE.LineBasicMaterial({color: 0x555555});
  const t1 = new THREE.LineLoop(new THREE.CircleGeometry(1.5, 64).attributes.position, trkMat); t1.rotation.x = Math.PI/2; group.add(t1);
  const t2 = new THREE.LineLoop(new THREE.CircleGeometry(4, 64).attributes.position, trkMat); t2.rotation.x = Math.PI/2; group.add(t2);
  
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(electron);
  
  const pts = [];
  for(let i=0; i<30; i++) {
      pts.push(new THREE.Vector3(-i*0.2, Math.sin(i*1.5)*0.5, 0)); // reversed direction
  }
  const photon = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.05, 8, false), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(photon);
  
  // Ripple effect on impact
  const ripple = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.5, 32), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0}));
  ripple.rotation.x = Math.PI/2;
  group.add(ripple);

  group.userData.animate = function(delta, time) {
      group.rotation.x = 0.3;
      
      const loop = time % 4; // 4s loop
      const angle = time * 2;
      
      if(loop < 2) {
          // Ground state waiting for photon
          electron.position.set(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5);
          
          // Photon flying IN
          photon.position.set(electron.position.x + 8 - loop*4, electron.position.y, electron.position.z);
          photon.lookAt(electron.position); // Point at electron
          
          ripple.material.opacity = 0;
      } else {
          // Boom! Absorbed, jump to R=4
          electron.position.set(Math.cos(angle)*4, 0, Math.sin(angle)*4);
          photon.position.set(999,999,999);
          
          const impactTime = loop - 2;
          if(impactTime < 0.5) {
              ripple.position.set(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5); // at original impact spot
              ripple.scale.setScalar(1 + impactTime*10);
              ripple.material.opacity = 1 - (impactTime*2);
          } else {
              ripple.material.opacity = 0;
          }
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
