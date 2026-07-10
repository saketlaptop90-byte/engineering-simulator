import * as THREE from 'three';

export function createBerylliumGammaDecay() {
  const group = new THREE.Group();
  
  // Nucleus dropping from an excited meta-state (R*) to ground state (R), emitting Gamma ray
  const nuc = new THREE.Group();
  
  for(let i=0; i<9; i++) {
      const isP = i < 4;
      const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff})
      );
      m.position.set((Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2);
      nuc.add(m);
  }
  group.add(nuc);
  
  // Gamma Ray (sharp, high frequency sine wave)
  const pts = [];
  for(let i=0; i<50; i++) {
      pts.push(new THREE.Vector3(i*0.1, Math.sin(i*4)*0.2, 0));
  }
  const gammaGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 128, 0.05, 8, false);
  const gammaMat = new THREE.MeshBasicMaterial({color: 0xaa00ff});
  const gammaRay = new THREE.Mesh(gammaGeo, gammaMat);
  group.add(gammaRay);
  
  // Glow aura for excited state
  const aura = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xaa00ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending}));
  group.add(aura);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      nuc.rotation.y += delta * 0.5;
      
      const t = time % 4; // 4s loop
      
      if(t < 2) {
          // Excited state
          nuc.scale.setScalar(1.2 + Math.sin(time*20)*0.05); // swollen and vibrating
          aura.material.opacity = 0.3 + Math.sin(time*10)*0.1;
          gammaRay.position.set(999,999,999);
      } else {
          // Relaxation and Emission
          const prog = t - 2;
          
          // Nucleus snaps to tight ground state
          nuc.scale.setScalar(1.0);
          aura.material.opacity = 0;
          
          // Gamma ray shoots out
          gammaRay.position.set(1.5 + prog*10, 0, 0);
      }
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Gamma Decay": "After alpha or beta decay, the daughter nucleus is often left in an excited state. It relaxes by emitting a high-energy Gamma photon.",
    "Nuclear Fission": "While not fissile like Uranium, striking Be-9 with high-energy neutrons or alpha particles can cause it to break apart (often yielding neutrons, used as a neutron source).",
    "Nuclear Fusion": "In stars, Beryllium is formed via the Triple-Alpha process (He + He -> Be-8), though Be-8 is highly unstable and must immediately fuse with a third He to make Carbon.",
    "Binding Energy": "The strong nuclear force binds protons and neutrons together, overcoming the immense electrostatic repulsion of the protons.",
    "Mass Defect": "The mass of a Be nucleus is strictly LESS than the sum of its individual protons and neutrons. The missing mass was converted to binding energy (E=mc^2)!"
  };

  return group;
}
