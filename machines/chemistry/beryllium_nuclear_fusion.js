import * as THREE from 'three';

export function createBerylliumNuclearFusion() {
  const group = new THREE.Group();
  
  // Two Alpha particles (He-4) fuse to make Beryllium-8
  
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
  
  const alpha1 = createNuc(2, 2); group.add(alpha1);
  const alpha2 = createNuc(2, 2); group.add(alpha2);
  const be8 = createNuc(4, 4); group.add(be8);
  
  const flash = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0}));
  group.add(flash);

  group.add(new THREE.AmbientLight(0xffffff, 0.5));
  group.add(new THREE.PointLight(0xffffff, 1, 10));

  group.userData.animate = function(delta, time) {
      const t = time % 4;
      
      if(t < 2) {
          // Flying towards each other
          be8.visible = false;
          alpha1.visible = true;
          alpha2.visible = true;
          
          // Start at x=-5 and x=5, meet at 0 at t=2
          alpha1.position.set(-5 + t*2.5, 0, 0);
          alpha2.position.set(5 - t*2.5, 0, 0);
          
          flash.material.opacity = 0;
      } else {
          // FUSION!
          alpha1.visible = false;
          alpha2.visible = false;
          be8.visible = true;
          
          const prog = t - 2;
          
          if(prog < 0.5) {
              flash.material.opacity = 1 - (prog*2);
          } else {
              flash.material.opacity = 0;
          }
          
          // The new Be-8 rotates rapidly
          be8.rotation.y += delta * 5;
          be8.rotation.x += delta * 3;
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
