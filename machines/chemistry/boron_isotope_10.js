import * as THREE from 'three';
export function createBoron10() {
  const group = new THREE.Group();
  
  // Boron-10 Isotope & Neutron Capture Therapy
  
  const core = new THREE.Group();
  group.add(core);
  
  const protonMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.3, roughness: 0.1, clearcoat: 1.0});
  const neutronMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, metalness: 1.0, roughness: 0.2});
  
  const particles = [];
  // B-10: 5 Protons, 5 Neutrons
  for(let i=0; i<10; i++) {
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
  
  // Incoming slow neutron
  const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), new THREE.MeshPhysicalMaterial({color: 0x00ff00, metalness: 1.0, roughness: 0.2, emissive: 0x004400}));
  group.add(bullet);
  
  const flash = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending}));
  group.add(flash);
  
  const pLight = new THREE.PointLight(0xffaaaa, 5, 20);
  core.add(pLight);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 0.5) % 3;
      
      if (cycle < 1) {
          // Stable B-10 jittering
          particles.forEach(p => {
              const pull = new THREE.Vector3(0,0,0).sub(p.mesh.position).multiplyScalar(0.1);
              p.vel.add(pull);
              p.vel.x += (Math.random()-0.5)*0.2; p.vel.y += (Math.random()-0.5)*0.2; p.vel.z += (Math.random()-0.5)*0.2;
              p.vel.multiplyScalar(0.8);
              p.mesh.position.add(p.vel);
          });
          
          // Bullet approaches
          bullet.position.set(-8 + cycle*8, 0, 0); // Hits at cycle=1
          bullet.visible = true;
          flash.material.opacity = 0;
      } else if (cycle < 1.2) {
          // IMPACT! B-10 absorbs the neutron to become highly unstable B-11, which instantly fissions!
          bullet.visible = false;
          flash.material.opacity = 1 - ((cycle-1)*5); // fade out fast
          pLight.color.setHex(0xffffff);
          pLight.intensity = 20;
          
          // Split into Lithium-7 and an Alpha particle (Helium-4)
          // Just explode everything outward for dramatic effect
          particles.forEach(p => {
              const explode = p.mesh.position.clone().normalize().multiplyScalar(0.5);
              p.vel.add(explode);
              p.mesh.position.add(p.vel);
          });
      } else {
          // Debris flying away
          particles.forEach(p => {
              p.mesh.position.add(p.vel);
          });
          pLight.intensity = 0;
      }
  };

  return {
    group: group,
    description: "Boron-10 Isotope & Neutron Capture Therapy. About 20% of the Boron on Earth is the 'Boron-10' isotope (5 Protons, 5 Neutrons). B-10 has a superpower: it has a massive 'Neutron Capture Cross-Section'. This means it is incredibly good at catching flying thermal neutrons! When B-10 catches the green neutron, it momentarily becomes B-11, which is so overloaded with energy that it instantly detonates, splitting into Lithium and a highly lethal Alpha particle. Doctors inject Boron-10 into brain tumors and fire neutrons at the patient's head. The tumor detonates from the inside out, killing the cancer cells while sparing healthy tissue!",
    parts: [
      { name: "Cluster (5 Red, 5 Silver)", material: "Boron-10 Nucleus", function: "Stable, but highly susceptible to neutron absorption." },
      { name: "Green Sphere", material: "Thermal Neutron", function: "Flying into the nucleus." },
      { name: "Violent Explosion", material: "Nuclear Fission", function: "The atom splits apart, releasing massive energy localized to a single cell." }
    ],
    quizQuestions: [
      { question: "Why is Boron-10 used to kill cancer cells in 'Neutron Capture Therapy'?", options: ["Because it is poisonous", "Because when Boron-10 catches a neutron, it instantly detonates like a microscopic nuclear bomb, destroying only the specific cell it is inside", "Because it freezes the cell", "Because it starves the cell of oxygen"], correct: 1, explanation: "The alpha particle released in the explosion only travels about the length of a single human cell. If you put Boron-10 inside a cancer cell, the explosion destroys that cell and nothing else!" }
    ]
  };
}