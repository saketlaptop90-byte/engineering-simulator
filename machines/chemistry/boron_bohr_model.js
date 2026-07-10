import * as THREE from 'three';

export function createBoronBohrModel() {
  const group = new THREE.Group();
  
  // Rigid planetary model
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshStandardMaterial({color: 0xff4444}));
  group.add(nucleus);
  
  const createOrbit = (radius, numElectrons, speed) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(radius-0.05, radius+0.05, 64), new THREE.MeshBasicMaterial({color: 0x555555, side: THREE.DoubleSide}));
      ring.rotation.x = Math.PI/2;
      group.add(ring);
      
      const shellGrp = new THREE.Group();
      for(let i=0; i<numElectrons; i++) {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
          const angle = (i * 2 * Math.PI) / numElectrons;
          e.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
          shellGrp.add(e);
      }
      group.add(shellGrp);
      return { shell: shellGrp, speed: speed };
  };
  
  const orbits = [
      createOrbit(2, 2, 2.0), // n=1 shell (2e)
      createOrbit(4, 3, 1.2)  // n=2 shell (3e)
  ];

  const glow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending}));
  group.add(glow);

  group.add(new THREE.AmbientLight(0xffffff, 1));

  group.userData.animate = function(delta, time) {
      orbits.forEach(o => {
          o.shell.rotation.y -= delta * o.speed;
      });
      group.rotation.z = Math.sin(time)*0.1;
  };


  group.userData.info = {
    "Name": "Boron",
    "Symbol": "B",
    "Atomic Number": "5",
    "Atomic Mass": "10.81",
    "Category": "Metalloid",
    "Atomic Structure": "Boron has 5 protons and usually 6 neutrons (B-11 is most common). It has 5 electrons: 2 in the inner 1s shell, and 3 valence electrons (2s2 2p1).",
    "Bohr Model": "Shows a central nucleus with 2 electrons in the first (K) shell and 3 electrons in the second (L) shell orbiting in rigid circular paths.",
    "Rutherford Model": "Demonstrates a tiny, dense, positively charged nucleus with 5 electrons buzzing around it in random, intersecting orbits like a swarm of bees.",
    "Thomson Model": "The 'Plum Pudding' model, where 5 negatively charged electron 'plums' are embedded in a diffuse sphere of positive charge.",
    "Quantum Model": "The modern view: Electrons don't have exact orbits. Instead, they exist in 3D probability clouds (two spherical 's' orbitals and one dumbbell-shaped 'p' orbital)."
  };

  return group;
}
