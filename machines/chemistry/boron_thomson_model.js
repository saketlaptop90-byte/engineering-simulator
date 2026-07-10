import * as THREE from 'three';

export function createBoronThomsonModel() {
  const group = new THREE.Group();
  
  // "Plum Pudding" - Diffuse positive sphere with 5 negative electrons stuck inside
  
  // Positive "pudding"
  const pudding = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffaaaa, transparent: true, opacity: 0.4, transmission: 0.9, roughness: 0.1})
  );
  group.add(pudding);
  
  // 5 Electron "plums"
  const plums = [];
  const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const eMat = new THREE.MeshStandardMaterial({color: 0x0055ff, metalness: 0.8, roughness: 0.2});
  
  for(let i=0; i<5; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      // distribute them within the sphere
      const r = 1.5 + Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      e.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
      );
      group.add(e);
      plums.push({mesh: e, baseX: e.position.x, baseY: e.position.y, baseZ: e.position.z, offset: Math.random()*10});
  }

  const light = new THREE.PointLight(0xffffff, 2, 20);
  light.position.set(5, 5, 5);
  group.add(light);
  group.add(new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      group.rotation.x += delta * 0.1;
      
      // Plums jiggle slightly in the pudding
      plums.forEach(p => {
          p.mesh.position.x = p.baseX + Math.sin(time*2 + p.offset)*0.1;
          p.mesh.position.y = p.baseY + Math.cos(time*3 + p.offset)*0.1;
          p.mesh.position.z = p.baseZ + Math.sin(time*1.5 + p.offset)*0.1;
      });
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
