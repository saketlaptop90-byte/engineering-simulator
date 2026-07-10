import * as THREE from 'three';
export function createLithiumAtomicStructure() {
  const group = new THREE.Group();
  
  // Lithium Atom (Upgraded to Ultra High Quality)
  // 3 Protons, 4 Neutrons. 1s2, 2s1 electron configuration.
  
  const nucleus = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.1, roughness: 0.3, clearcoat: 1.0});
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.1, roughness: 0.3, clearcoat: 1.0});
  
  // 3 Protons
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p1.position.set(0.2, 0.2, 0); nucleus.add(p1);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p2.position.set(-0.2, -0.2, 0.2); nucleus.add(p2);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p3.position.set(-0.2, 0.2, -0.2); nucleus.add(p3);
  
  // 4 Neutrons (Lithium-7 is the most common isotope)
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n1.position.set(0, -0.2, -0.2); nucleus.add(n1);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n2.position.set(-0.2, 0, 0.2); nucleus.add(n2);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n3.position.set(0.2, -0.2, 0.2); nucleus.add(n3);
  const n4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n4.position.set(0.2, 0, -0.2); nucleus.add(n4);
  
  group.add(nucleus);
  
  // Electron Cloud System (Ultra High Quality Particles)
  const createOrbitalCloud = (count, radius, colorHex) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for(let i=0; i<count; i++) {
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          const r = radius * (0.8 + Math.random()*0.4); // fuzzy shell
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      
      const mat = new THREE.PointsMaterial({
          size: 0.1,
          color: colorHex,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false
      });
      return new THREE.Points(geo, mat);
  };
  
  // 1s orbital (2 electrons tightly bound, dense cloud)
  const innerCloud = createOrbitalCloud(2000, 1.5, 0x00ffff);
  group.add(innerCloud);
  
  // 2s orbital (1 lonely valence electron, diffuse cloud far away)
  const outerCloud = createOrbitalCloud(1000, 4.0, 0xff00ff);
  group.add(outerCloud);

  const light = new THREE.PointLight(0xffffff, 2, 20);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Nucleus vibration (thermal energy)
      nucleus.rotation.x = time * speed * 0.5;
      nucleus.rotation.z = time * speed * 0.3;
      
      // Cloud rotation
      innerCloud.rotation.y = -time * speed * 0.5;
      innerCloud.rotation.z = time * speed * 0.2;
      
      outerCloud.rotation.x = time * speed * 0.2;
      outerCloud.rotation.y = time * speed * 0.3;
      
      // Pulse outer cloud (shows it is weakly bound and ready to leave)
      outerCloud.scale.setScalar(1 + Math.sin(time*speed*3)*0.1);
  };

  return {
    group: group,
    description: "Lithium Atom (Remastered). Lithium is atomic number 3. It has 3 red protons and 4 blue neutrons in its nucleus (Lithium-7). It is the very first metal on the periodic table! Look at the electron clouds: the inner cyan cloud holds 2 electrons (the 1s orbital), holding them tightly. But the outer magenta cloud (the 2s orbital) holds only 1 lonely 'valence' electron. Because this electron is so far from the nucleus, Lithium violently throws it away at the first opportunity to achieve a stable inner shell. This is why Lithium reacts explosively with water and is perfect for batteries!",
    parts: [
      { name: "Red/Blue Cluster", material: "Nucleus", function: "3 Protons and 4 Neutrons." },
      { name: "Dense Cyan Cloud", material: "1s Orbital", function: "2 inner electrons safely locked away." },
      { name: "Pulsing Magenta Cloud", material: "2s Valence Orbital", function: "1 highly reactive outer electron that Lithium desperately wants to lose." }
    ],
    quizQuestions: [
      { question: "Why is Lithium incredibly reactive and used in high-power batteries?", options: ["Because it has too many electrons", "Because its single, lonely outer electron (in the 2s orbital) is weakly held and is violently given away to achieve stability, providing an excellent flow of electricity.", "Because it has no neutrons", "Because it absorbs water"], correct: 1, explanation: "Metals love to lose electrons. Lithium only has one to lose, making it highly eager to give it away!" }
    ]
  };
}