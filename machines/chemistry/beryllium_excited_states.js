import * as THREE from 'three';

export function createBerylliumExcitedStates() {
  const group = new THREE.Group();
  
  // Ground state: 1s2 2s2 -> Excited state: 1s2 2s1 2p1
  
  const coreShell = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xffaa00, transparent: true, opacity: 0.8}));
  group.add(coreShell);
  
  // 2s orbital (sphere)
  const s2Orbital = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.2, depthWrite: false}));
  group.add(s2Orbital);
  
  // 2p orbital (dumbbell)
  const pOrbitalGeo = new THREE.SphereGeometry(1, 32, 32);
  pOrbitalGeo.scale(1, 2.5, 1);
  const pOrbitalMat = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.0, depthWrite: false}); // Starts invisible
  const p1 = new THREE.Mesh(pOrbitalGeo, pOrbitalMat); p1.position.y = 2; group.add(p1);
  const p2 = new THREE.Mesh(pOrbitalGeo, pOrbitalMat); p2.position.y = -2; group.add(p2);
  
  // 2s electrons
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e1); group.add(e2);
  
  // Label / Energy indicator
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.5, 3.6, 64), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
  ring.rotation.x = Math.PI/2;
  group.add(ring);

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      group.rotation.z = Math.sin(time*0.5)*0.1;
      
      const isExcited = (time % 4) > 2; // alternates every 2 secs
      
      if(!isExcited) {
          // Ground state (both in 2s)
          e1.position.set(Math.cos(time*3)*2.5, 0, Math.sin(time*3)*2.5);
          e2.position.set(Math.cos(time*3+Math.PI)*2.5, 0, Math.sin(time*3+Math.PI)*2.5);
          
          p1.material.opacity = 0;
          p2.material.opacity = 0;
          s2Orbital.material.opacity = 0.4;
          ring.material.color.setHex(0x00aaff); // Blue = Ground
      } else {
          // Excited state (one in 2s, one in 2p)
          e1.position.set(Math.cos(time*3)*2.5, 0, Math.sin(time*3)*2.5);
          
          // e2 moves in the 2p dumbbell
          const pAngle = time*5;
          const px = Math.cos(pAngle)*0.8;
          const py = Math.sin(pAngle)*2.5;
          e2.position.set(px, py, 0);
          
          p1.material.opacity = 0.3;
          p2.material.opacity = 0.3;
          s2Orbital.material.opacity = 0.1;
          ring.material.color.setHex(0xff00ff); // Pink = Excited
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
