import * as THREE from 'three';

export function createBerylliumSpectralLines() {
  const group = new THREE.Group();
  
  // Visualizing the emission spectrum (barcode) of Beryllium
  // Be emits strongly in the UV and visible (e.g., 313 nm, 332 nm, 457 nm, etc.)
  
  // Background dark bar
  const bg = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 0.1), new THREE.MeshBasicMaterial({color: 0x111111}));
  group.add(bg);
  
  // Spectral Lines (approximate colors based on wavelengths)
  const createLine = (x, color, label) => {
      const lineGroup = new THREE.Group();
      
      // The glowing slit
      const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2), new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending}));
      slit.position.z = 0.06;
      lineGroup.add(slit);
      
      // A soft glow halo
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.2), new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending}));
      glow.position.z = 0.05;
      lineGroup.add(glow);
      
      lineGroup.position.x = x;
      return lineGroup;
  };

  // 313 nm (UV - rendered as deep violet)
  const l1 = createLine(-3.5, 0x4400ff); group.add(l1);
  // 332 nm (UV - violet)
  const l2 = createLine(-2.0, 0x6600ff); group.add(l2);
  // 457 nm (Blue)
  const l3 = createLine(1.0, 0x0088ff); group.add(l3);
  // 527 nm (Green)
  const l4 = createLine(3.0, 0x00ff00); group.add(l4);

  // Decorative prism effect
  const prism = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 3), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.2, transmission: 0.9, ior: 1.5}));
  prism.rotation.x = Math.PI/2;
  prism.position.set(0, -4, 0);
  group.add(prism);

  // Incoming white light hitting prism
  const wBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
  wBeam.position.set(0, -7, 0);
  group.add(wBeam);
  
  // Rays connecting prism to lines
  const rayMat = new THREE.LineBasicMaterial({transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending});
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0), new THREE.Vector3(-3.5,-1,0.06)]), new THREE.LineBasicMaterial({color: 0x4400ff})));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0), new THREE.Vector3(-2.0,-1,0.06)]), new THREE.LineBasicMaterial({color: 0x6600ff})));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0), new THREE.Vector3(1.0,-1,0.06)]), new THREE.LineBasicMaterial({color: 0x0088ff})));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2,0), new THREE.Vector3(3.0,-1,0.06)]), new THREE.LineBasicMaterial({color: 0x00ff00})));

  group.userData.animate = function(delta, time) {
      // Pulse lines
      l1.scale.x = 1 + Math.sin(time*5)*0.2;
      l2.scale.x = 1 + Math.sin(time*6)*0.2;
      l3.scale.x = 1 + Math.sin(time*7)*0.2;
      l4.scale.x = 1 + Math.sin(time*4)*0.2;
      
      prism.rotation.y += delta * 0.5;
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
