import * as THREE from 'three';

export function createBerylliumHalfLife() {
  const group = new THREE.Group();
  
  // Visualize a grid of 16 Be-10 atoms decaying over "time"
  
  const atoms = [];
  const spacing = 1.5;
  const matAlive = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x005500}); // Be-10
  const matDead = new THREE.MeshStandardMaterial({color: 0x555555}); // B-10 (Decayed)
  
  for(let x=0; x<4; x++) {
      for(let y=0; y<4; y++) {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), matAlive);
          atom.position.set(x*spacing - spacing*1.5, y*spacing - spacing*1.5, 0);
          group.add(atom);
          atoms.push({mesh: atom, isAlive: true, delay: Math.random() * 8}); // random decay time
      }
  }

  // A clock/timer visual
  const clockBg = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({color: 0x222222}));
  clockBg.position.set(4, 0, 0);
  group.add(clockBg);
  
  const handGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
  handGeo.translate(0, 0.4, 0);
  const hand = new THREE.Mesh(handGeo, new THREE.MeshBasicMaterial({color: 0xffffff}));
  hand.position.set(4, 0, 0.01);
  group.add(hand);

  group.add(new THREE.AmbientLight(0xffffff, 1));

  group.userData.animate = function(delta, time) {
      const t = time % 10; // 10 second loop (represents millions of years)
      
      // Reset loop
      if (t < 0.1) {
          atoms.forEach(a => {
              a.isAlive = true;
              a.mesh.material = matAlive;
              a.mesh.scale.setScalar(1);
          });
      }
      
      // Decay logic
      atoms.forEach(a => {
          if (a.isAlive && t > a.delay) {
              a.isAlive = false;
              a.mesh.material = matDead;
              a.mesh.scale.setScalar(0.8); // shrinks slightly as B-10
          }
      });
      
      // Clock spins rapidly
      hand.rotation.z = -t * Math.PI; // Full rotation every 2 seconds
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
