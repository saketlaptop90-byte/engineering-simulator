import * as THREE from 'three';

export function createBerylliumIsotopes() {
  const group = new THREE.Group();
  
  // Create 3 separate nuclei (Be-7, Be-9, Be-10)
  const createNucleus = (x, neutrons, labelStr) => {
      const nuc = new THREE.Group();
      
      const pGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const nGeo = new THREE.SphereGeometry(0.3, 16, 16);
      
      const pMat = new THREE.MeshStandardMaterial({color: 0xff0000}); // Protons
      const nMat = new THREE.MeshStandardMaterial({color: 0x0000ff}); // Neutrons
      
      // Protons (Always 4)
      for(let i=0; i<4; i++) {
          const p = new THREE.Mesh(pGeo, pMat);
          p.position.set((Math.random()-0.5)*0.6, (Math.random()-0.5)*0.6, (Math.random()-0.5)*0.6);
          nuc.add(p);
      }
      
      // Neutrons
      for(let i=0; i<neutrons; i++) {
          const n = new THREE.Mesh(nGeo, nMat);
          n.position.set((Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
          nuc.add(n);
      }
      
      nuc.position.x = x;
      
      // Label box
      const lbl = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
      lbl.position.y = 1.5;
      nuc.add(lbl);
      
      return nuc;
  };

  const be7 = createNucleus(-3.5, 3, "Be-7"); // Radioactive
  const be9 = createNucleus(0, 5, "Be-9"); // Stable
  const be10 = createNucleus(3.5, 6, "Be-10"); // Radioactive

  group.add(be7); group.add(be9); group.add(be10);
  
  const light = new THREE.PointLight(0xffffff, 1, 20);
  light.position.set(0, 5, 5);
  group.add(light);
  group.add(new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time) {
      // Be-9 (Stable) rotates peacefully
      be9.rotation.y += delta * 0.5;
      be9.rotation.x += delta * 0.3;
      
      // Be-7 and Be-10 (Unstable) vibrate/jiggle
      be7.rotation.y += delta * 0.5;
      be7.position.y = Math.sin(time*20)*0.1; // violent shake
      
      be10.rotation.y += delta * 0.5;
      be10.position.y = Math.cos(time*15)*0.08; // moderate shake
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Isotopes": "Be-9 is the only stable isotope (4 protons, 5 neutrons). Be-7 (3 neutrons) and Be-10 (6 neutrons) are cosmogenic radioisotopes.",
    "Radioactivity": "Unstable isotopes decay over time because the ratio of neutrons to protons is not favorable for the Strong Nuclear Force to hold the nucleus together.",
    "Half-life": "Be-10 has a half-life of 1.39 million years. Be-7 has a half-life of 53.22 days (decays via electron capture).",
    "Alpha Decay": "Beryllium-8 (4 neutrons) is wildly unstable and instantly fissions into two Alpha particles (Helium-4 nuclei) with a half-life of 8x10^-17 seconds!",
    "Beta Decay": "Be-10 undergoes Beta minus decay. A neutron turns into a proton (emitting an electron and antineutrino), transmuting Beryllium-10 into Boron-10."
  };

  return group;
}
