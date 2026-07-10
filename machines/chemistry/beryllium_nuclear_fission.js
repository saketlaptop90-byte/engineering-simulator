import * as THREE from 'three';

export function createBerylliumNuclearFission() {
  const group = new THREE.Group();
  
  // A neutron strikes Be-9, causing it to split into two alpha particles (He-4) and 2 free neutrons
  
  const createNuc = (protons, neutrons) => {
      const g = new THREE.Group();
      for(let i=0; i<(protons+neutrons); i++) {
          const isP = i < protons;
          const m = new THREE.Mesh(
              new THREE.SphereGeometry(0.3, 16, 16),
              new THREE.MeshStandardMaterial({color: isP ? 0xff0000 : 0x0000ff})
          );
          m.position.set((Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
          g.add(m);
      }
      return g;
  };
  
  const be9 = createNuc(4, 5);
  group.add(be9);
  
  const alpha1 = createNuc(2, 2); group.add(alpha1);
  const alpha2 = createNuc(2, 2); group.add(alpha2);
  
  // Incident neutron
  const nIn = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  group.add(nIn);
  
  // Ejected neutrons
  const nOut1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  const nOut2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  group.add(nOut1); group.add(nOut2);
  
  const flash = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      const t = time % 5;
      
      if(t < 2) {
          // Neutron flying in
          be9.position.set(0,0,0);
          be9.visible = true;
          alpha1.visible = false;
          alpha2.visible = false;
          nOut1.visible = false;
          nOut2.visible = false;
          
          nIn.visible = true;
          nIn.position.set(-6 + t*3, 0, 0); // hits at t=2
          flash.material.opacity = 0;
      } else {
          // FISSION!
          be9.visible = false;
          nIn.visible = false;
          alpha1.visible = true;
          alpha2.visible = true;
          nOut1.visible = true;
          nOut2.visible = true;
          
          const prog = t - 2;
          
          // Flash!
          if(prog < 0.2) {
              flash.material.opacity = 1 - (prog*5);
          } else {
              flash.material.opacity = 0;
          }
          
          // Fragments fly apart
          alpha1.position.set(prog*2, prog*3, 0);
          alpha2.position.set(prog*2, -prog*3, 0);
          nOut1.position.set(prog*4, prog*1, prog*2);
          nOut2.position.set(prog*4, -prog*1, -prog*2);
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
