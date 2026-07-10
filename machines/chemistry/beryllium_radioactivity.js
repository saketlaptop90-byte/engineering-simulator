import * as THREE from 'three';

export function createBerylliumRadioactivity() {
  const group = new THREE.Group();
  
  // A highly unstable nucleus emitting radiation (waves and particles)
  
  const nuc = new THREE.Group();
  for(let i=0; i<10; i++) {
      const isP = i < 4;
      const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff})
      );
      m.position.set((Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
      nuc.add(m);
  }
  group.add(nuc);
  
  // Gamma rays (waves emitting outwards)
  const gammaRays = [];
  const waveGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 64);
  const waveMat = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.5});
  
  for(let i=0; i<3; i++) {
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.rotation.x = Math.random() * Math.PI;
      wave.rotation.y = Math.random() * Math.PI;
      group.add(wave);
      gammaRays.push({mesh: wave, scale: i*2, maxScale: 6});
  }

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      // Nucleus vibration
      nuc.position.x = Math.sin(time*30)*0.1;
      nuc.position.y = Math.cos(time*25)*0.1;
      nuc.position.z = Math.sin(time*35)*0.1;
      
      // Gamma radiation waves expanding
      gammaRays.forEach(r => {
          r.scale += delta * 3;
          if(r.scale > r.maxScale) r.scale = 0.5;
          r.mesh.scale.setScalar(r.scale);
          r.mesh.material.opacity = 1 - (r.scale / r.maxScale);
      });
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
