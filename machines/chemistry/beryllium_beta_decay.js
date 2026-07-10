import * as THREE from 'three';

export function createBerylliumBetaDecay() {
  const group = new THREE.Group();
  
  // Be-10 (4P, 6N) decays via Beta- to B-10 (5P, 5N)
  // A neutron turns into a proton + electron + antineutrino!
  
  const nuc = new THREE.Group();
  
  // Static nucleons (3 Protons, 5 Neutrons)
  for(let i=0; i<8; i++) {
      const isP = i < 3;
      const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff})
      );
      m.position.set((Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2);
      nuc.add(m);
  }
  
  // The decaying neutron
  const decayingNucleon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  decayingNucleon.position.set(0, 0, 1.2);
  nuc.add(decayingNucleon);
  group.add(nuc);
  
  // Emitted Electron (Beta particle)
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(electron);
  
  // Emitted Antineutrino (ghostly particle)
  const neutrino = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  group.add(neutrino);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      nuc.rotation.y += delta * 0.2;
      
      const t = time % 4; // 4s loop
      
      if(t < 2) {
          // Normal Be-10 state
          decayingNucleon.material.color.setHex(0x0000ff); // Blue Neutron
          electron.position.set(999,999,999);
          neutrino.position.set(999,999,999);
      } else {
          // DECAY!
          const prog = t - 2;
          
          // Nucleon turns RED (becomes a proton)
          decayingNucleon.material.color.setHex(0x0000ff).lerp(new THREE.Color(0xff0000), Math.min(prog*5, 1));
          
          // Shoot particles out
          electron.position.set(0, 0, 1.2 + prog*10); // shoots forward Z
          neutrino.position.set(0, prog*10, 1.2 - prog*5); // shoots up and back
      }
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
