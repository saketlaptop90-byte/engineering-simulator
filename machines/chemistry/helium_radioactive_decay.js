import * as THREE from 'three';
export function createHeliumRadioactiveDecay() {
  const group = new THREE.Group();
  
  // Heavy Nucleus (e.g. Uranium-238)
  const u238 = new THREE.Group();
  for(let i=0; i<60; i++) {
      const isProton = Math.random() > 0.6;
      const nucleon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8,8), new THREE.MeshBasicMaterial({color: isProton ? 0xff0000 : 0x888888}));
      const r = Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      nucleon.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      u238.add(nucleon);
  }
  u238.position.set(-2, 0, 0);
  group.add(u238);

  // Emitted Alpha Particle (Helium Nucleus)
  const alpha = new THREE.Group();
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})); p1.position.set(0.2,0.2,0);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})); p2.position.set(-0.2,-0.2,0);
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0x888888})); n1.position.set(-0.2,0.2,0.2);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0x888888})); n2.position.set(0.2,-0.2,-0.2);
  alpha.add(p1,p2,n1,n2);
  group.add(alpha);

  // Speed lines
  const lines = new THREE.Group();
  for(let i=0; i<3; i++) {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1.5,0,0)]), new THREE.LineBasicMaterial({color: 0xffff00}));
      line.position.set((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5));
      lines.add(line);
  }
  alpha.add(lines);

  group.userData.animate = function(delta, time, speed) {
      u238.rotation.y = time * speed * 0.2;
      u238.scale.setScalar(1 + Math.sin(time*speed*10)*0.02); // vibrating heavily
      
      const cycle = (time * speed) % 3;
      if (cycle < 0.5) {
          alpha.position.set(-1.5, 0, 0); // inside
          alpha.visible = false;
      } else {
          alpha.visible = true;
          const t = cycle - 0.5;
          alpha.position.set(-1.5 + t*6, Math.sin(t*2)*0.5, 0); // shooting out
          alpha.rotation.x = t*10;
          lines.position.x = -1; // trailing behind
      }
  };

  return {
    group: group,
    description: "Radioactive Alpha Decay. Almost all the Helium on Earth did NOT come from the Sun! It was created deep underground by the radioactive decay of heavy elements like Uranium and Thorium. These unstable elements spit out 'Alpha Particles' (bare Helium nuclei) which then steal two electrons from the surrounding rock to become trapped Helium gas.",
    parts: [
      { name: "Heavy Isotope", material: "Uranium-238", function: "Unstable, too large to hold itself together." },
      { name: "Alpha Particle", material: "He Nucleus", function: "Ejected at high speed to reduce the heavy atom's mass." }
    ],
    quizQuestions: [
      { question: "Where does the Helium gas inside a party balloon originally come from?", options: ["It is sucked down from the sun", "It is mined from underground natural gas deposits, where it was created by the radioactive decay of Uranium", "It is manufactured in factories by splitting water", "It is breathed out by plants"], correct: 1, explanation: "Helium is too light to stay in Earth's atmosphere; it floats away into space. The only reason we have any on Earth is because heavy radioactive elements in the crust constantly undergo alpha decay, slowly producing new Helium gas that gets trapped in natural gas pockets." }
    ]
  };
}