import * as THREE from 'three';

export function createBerylliumAlphaDecay() {
  const group = new THREE.Group();
  
  // Be-8 fissions instantly into TWO Alpha particles (He-4)
  // Be-8 = 4 Protons, 4 Neutrons. Splits exactly down the middle.
  
  const createAlpha = () => {
      const alpha = new THREE.Group();
      const pGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const pMat = new THREE.MeshStandardMaterial({color: 0xff0000}); // Protons
      const nMat = new THREE.MeshStandardMaterial({color: 0x0000ff}); // Neutrons
      
      // 2 Protons, 2 Neutrons tightly packed
      const p1 = new THREE.Mesh(pGeo, pMat); p1.position.set(0.2, 0.2, 0); alpha.add(p1);
      const p2 = new THREE.Mesh(pGeo, pMat); p2.position.set(-0.2, -0.2, 0); alpha.add(p2);
      const n1 = new THREE.Mesh(pGeo, nMat); n1.position.set(-0.2, 0.2, 0); alpha.add(n1);
      const n2 = new THREE.Mesh(pGeo, nMat); n2.position.set(0.2, -0.2, 0); alpha.add(n2);
      
      return alpha;
  };

  const alpha1 = createAlpha();
  const alpha2 = createAlpha();
  group.add(alpha1); group.add(alpha2);

  // Shockwave ring
  const shockwave = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.8, 32), new THREE.MeshBasicMaterial({color: 0xffaaff, transparent: true, opacity: 0, side: THREE.DoubleSide}));
  group.add(shockwave);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      const t = time % 3; // 3 sec loop
      
      if(t < 1) {
          // Be-8 state (fused together)
          alpha1.position.set(-0.3, 0, 0);
          alpha2.position.set(0.3, 0, 0);
          
          // Jiggle violently
          alpha1.position.y = Math.sin(time*40)*0.05;
          alpha2.position.y = -Math.sin(time*40)*0.05;
          
          shockwave.material.opacity = 0;
      } else if (t < 2) {
          // FISSION! They blast apart
          const prog = t - 1;
          alpha1.position.x = -0.3 - prog * 5; // fly left
          alpha2.position.x = 0.3 + prog * 5;  // fly right
          
          alpha1.rotation.z += delta * 10;
          alpha2.rotation.z -= delta * 10;
          
          // Shockwave expands
          shockwave.scale.setScalar(1 + prog*10);
          shockwave.material.opacity = 1 - prog;
      } else {
          // Reset waiting
          alpha1.position.set(999,999,999);
          alpha2.position.set(999,999,999);
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
