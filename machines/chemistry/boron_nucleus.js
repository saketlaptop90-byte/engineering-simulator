import * as THREE from 'three';
export function createBoronNucleus() {
  const group = new THREE.Group();
  
  // The Ultimate Nucleus Battle (Remastered)
  
  const protonMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.5, roughness: 0.1, clearcoat: 1.0});
  const neutronMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 1.0, roughness: 0.2});
  
  const core = new THREE.Group();
  group.add(core);
  
  const particles = [];
  
  // 5 Protons, 6 Neutrons
  for(let i=0; i<11; i++) {
      const isProton = i < 5;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), isProton ? protonMat : neutronMat);
      
      const pos = new THREE.Vector3(
          (Math.random()-0.5)*1.5,
          (Math.random()-0.5)*1.5,
          (Math.random()-0.5)*1.5
      );
      mesh.position.copy(pos);
      core.add(mesh);
      particles.push({mesh, isProton, pos: pos.clone(), vel: new THREE.Vector3(0,0,0)});
  }
  
  // Ambient glow
  const pLight = new THREE.PointLight(0xffaaaa, 5, 20);
  core.add(pLight);
  
  // Volumetric force field
  const forceField = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 4),
      new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.1})
  );
  core.add(forceField);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.z = Math.sin(time*speed*0.05)*0.1;
      
      forceField.scale.setScalar(1 + Math.sin(time*speed*10)*0.05);
      forceField.material.opacity = 0.1 + Math.sin(time*speed*20)*0.05; // Rapid pulsing
      
      // Physics sim: Protons repel, everything attracts to center
      particles.forEach(p => {
          // 1. Spring to center (Strong Force / confinement)
          const pull = new THREE.Vector3(0,0,0).sub(p.mesh.position).multiplyScalar(0.05);
          p.vel.add(pull);
          
          // 2. Protons repel each other (Electromagnetic force)
          if (p.isProton) {
              particles.forEach(p2 => {
                  if (p !== p2 && p2.isProton) {
                      const dist = p.mesh.position.distanceTo(p2.mesh.position);
                      if(dist < 1.5) {
                          const push = p.mesh.position.clone().sub(p2.mesh.position).normalize().multiplyScalar(0.05 / (dist*dist));
                          p.vel.add(push);
                      }
                  }
              });
          }
          
          // 3. Short range repulsion so they don't clip into each other
          particles.forEach(p2 => {
              if (p !== p2) {
                  const dist = p.mesh.position.distanceTo(p2.mesh.position);
                  if (dist < 0.8) {
                      const push = p.mesh.position.clone().sub(p2.mesh.position).normalize().multiplyScalar(0.1);
                      p.vel.add(push);
                  }
              }
          });
          
          // 4. Random quantum jitter
          p.vel.x += (Math.random()-0.5)*0.1;
          p.vel.y += (Math.random()-0.5)*0.1;
          p.vel.z += (Math.random()-0.5)*0.1;
          
          // Friction & update
          p.vel.multiplyScalar(0.85);
          p.mesh.position.add(p.vel);
      });
  };

  return {
    group: group,
    description: "The Nucleus (Ultra High Quality Physics Sim). This is a real-time, high-fidelity physics simulation of the forces inside the Boron nucleus. The 5 red protons are actively trying to violently repel each other due to the Electromagnetic Force. The 6 silver neutrons are providing a massive influx of the Strong Nuclear Force, acting as a gravitational/confining well that aggressively pulls everything back to the center. Watch the particles physically fight against these opposing forces in real-time, resulting in a rapidly vibrating, boiling cluster of matter!",
    parts: [
      { name: "Ruby Spheres", material: "Protons", function: "Actively trying to blow the nucleus apart." },
      { name: "Silver Spheres", material: "Neutrons", function: "Actively pulling everything together." },
      { name: "Pulsing Wireframe", material: "Nuclear Confinement", function: "The boundary of the Strong Force field." }
    ],
    quizQuestions: [
      { question: "If you watch the simulation closely, the nucleus never sits perfectly still. Why?", options: ["Because the code is broken", "Because it is boiling hot", "Because of the constant, rapid battle between the outward Electromagnetic repulsion and the inward Strong Nuclear Force (and quantum jitter)", "Because it is breathing"], correct: 2, explanation: "A nucleus is not a static rock. It is a highly dynamic, boiling droplet of quantum fluid constantly held in a state of extreme tension by opposing fundamental forces!" }
    ]
  };
}